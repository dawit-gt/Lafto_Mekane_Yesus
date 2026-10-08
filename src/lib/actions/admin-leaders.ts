"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const leaderSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required.").max(200),
  title: z.string().trim().min(1, "Title is required.").max(200),
  bioMd: z.string().trim().max(4000).optional().or(z.literal("")),
  photoUrl: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
  displayOrder: z.coerce.number().int("Must be a whole number.").min(0).max(9999),
  status: z.enum(["draft", "published", "archived"]),
});

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  recordId: string | null,
  details?: Record<string, unknown>
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    table_name: "leaders",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseLeaderForm(formData: FormData) {
  return leaderSchema.safeParse({
    fullName: formData.get("fullName"),
    title: formData.get("title"),
    bioMd: formData.get("bioMd"),
    photoUrl: formData.get("photoUrl"),
    displayOrder: formData.get("displayOrder"),
    status: formData.get("status"),
  });
}

export async function createLeader(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseLeaderForm(formData);
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
      .from("leaders")
      .insert({
        full_name: d.fullName,
        title: d.title,
        bio_md: d.bioMd || null,
        photo_url: d.photoUrl || null,
        display_order: d.displayOrder,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { name: d.fullName, status: d.status });
  } catch (err) {
    console.error("createLeader failed:", err);
    return { status: "error", message: "Something went wrong saving this leader. Please try again." };
  }

  revalidatePath("/admin/content/leaders");
  revalidatePath("/about");
  redirect("/admin/content/leaders");
}

export async function updateLeader(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseLeaderForm(formData);
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
      .from("leaders")
      .update({
        full_name: d.fullName,
        title: d.title,
        bio_md: d.bioMd || null,
        photo_url: d.photoUrl || null,
        display_order: d.displayOrder,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, user.id, "update", id, { name: d.fullName, status: d.status });
  } catch (err) {
    console.error("updateLeader failed:", err);
    return { status: "error", message: "Something went wrong saving this leader. Please try again." };
  }

  revalidatePath("/admin/content/leaders");
  revalidatePath("/about");
  redirect("/admin/content/leaders");
}

export async function deleteLeader(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("leaders").delete().eq("id", id);
  if (error) {
    console.error("deleteLeader failed:", error);
    return;
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidatePath("/admin/content/leaders");
  revalidatePath("/about");
}