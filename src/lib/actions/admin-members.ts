"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const memberSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  membershipStatus: z.enum(["active", "inactive"]),
  ministryIds: z.array(z.string().uuid()).max(100),
  directoryVisible: z.boolean(),
});

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  recordId: string | null,
  details?: Record<string, unknown>
) {
  // Never put personal details (email, phone) in the audit log.
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    table_name: "members",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseMemberForm(formData: FormData) {
  return memberSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    membershipStatus: formData.get("membershipStatus"),
    ministryIds: formData.getAll("ministryIds").map(String),
    directoryVisible: formData.get("directoryVisible") === "on",
  });
}

export async function createMember(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseMemberForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { data, error } = await supabase
      .from("members")
      .insert({
        full_name: d.fullName,
        email: d.email || null,
        phone: d.phone || null,
        membership_status: d.membershipStatus,
        ministry_ids: d.ministryIds,
        directory_visible: d.directoryVisible,
      })
      .select("id")
      .single();
    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { status: d.membershipStatus });
  } catch (err) {
    console.error("createMember failed:", err);
    return { status: "error", message: "Something went wrong saving this member. Please try again." };
  }

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function updateMember(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseMemberForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { error } = await supabase
      .from("members")
      .update({
        full_name: d.fullName,
        email: d.email || null,
        phone: d.phone || null,
        membership_status: d.membershipStatus,
        ministry_ids: d.ministryIds,
        directory_visible: d.directoryVisible,
      })
      .eq("id", id);
    if (error) throw error;

    await logAudit(supabase, user.id, "update", id, { status: d.membershipStatus });
  } catch (err) {
    console.error("updateMember failed:", err);
    return { status: "error", message: "Something went wrong saving this member. Please try again." };
  }

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) {
    console.error("deleteMember failed:", error);
    return;
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidatePath("/admin/members");
}