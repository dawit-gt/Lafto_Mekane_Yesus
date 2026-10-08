"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAdmin } from "@/lib/auth/admin";
import type { FormState } from "@/lib/actions/state";

const addAdminSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  fullName: z.string().trim().min(1, "Please enter their name.").max(200),
});

/** Looks through Supabase Auth accounts for an exact email match. */
async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const perPage = 200;

  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match.id;
    if (data.users.length < perPage) break;
  }
  return null;
}

export async function addAdmin(_prevState: FormState, formData: FormData): Promise<FormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return { status: "error", message: "You don't have permission to do this." };
  }

  const parsed = addAdminSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const email = parsed.data.email.toLowerCase();
  const fullName = parsed.data.fullName;

  try {
    const targetId = await findAuthUserIdByEmail(email);
    if (!targetId) {
      return {
        status: "error",
        message: "No account with that email exists yet.",
        fieldErrors: {
          email: ["Create the account in Supabase first (Authentication → Users), then add it here."],
        },
      };
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", targetId)
      .maybeSingle();
    if (existing) {
      return { status: "error", message: "That person already has Admin access." };
    }

    const { error } = await supabase
      .from("admin_users")
      .insert({ id: targetId, full_name: fullName });
    if (error) throw error;

    await supabase.from("audit_logs").insert({
      actor_id: current.id,
      action: "add_admin",
      table_name: "admin_users",
      record_id: targetId,
      details: { name: fullName },
    });
  } catch (err) {
    console.error("addAdmin failed:", err);
    return {
      status: "error",
      message: "Something went wrong. Check that SUPABASE_SERVICE_ROLE_KEY is set in .env.local, then try again.",
    };
  }

  revalidatePath("/admin/users");
  return { status: "success", message: `${fullName} now has Admin access.` };
}

export async function removeAdmin(id: string): Promise<void> {
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) return;

  const current = await getCurrentAdmin();
  if (!current) return;

  // Never allow removing yourself, so you can't lock yourself out by accident.
  if (parsedId.data === current.id) return;

  const supabase = await createClient();

  // Never allow removing the last admin.
  const { count } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) return;

  const { data: target } = await supabase
    .from("admin_users")
    .select("full_name")
    .eq("id", parsedId.data)
    .maybeSingle();

  const { error } = await supabase.from("admin_users").delete().eq("id", parsedId.data);
  if (error) {
    console.error("removeAdmin failed:", error);
    return;
  }

  await supabase.from("audit_logs").insert({
    actor_id: current.id,
    action: "remove_admin",
    table_name: "admin_users",
    record_id: parsedId.data,
    details: { name: target?.full_name ?? null },
  });

  revalidatePath("/admin/users");
}