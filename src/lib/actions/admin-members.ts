"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const BUCKET = "member-photos";

const memberSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required.").max(200),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number."),
  maritalStatus: z.enum(["married", "not_married", ""]),
  occupation: z.string().trim().max(200).optional().or(z.literal("")),
  childrenCount: z
    .string()
    .trim()
    .regex(/^\d{0,2}$/, "Enter a whole number from 0 to 50.")
    .refine((v) => v === "" || Number(v) <= 50, "Enter a whole number from 0 to 50."),
  photoPath: z
    .string()
    .trim()
    .regex(/^[0-9a-f-]{36}\.jpg$/, "Invalid photo.")
    .optional()
    .or(z.literal("")),
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
  // Never put personal details (phone, work, family) in the audit log.
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
    phone: formData.get("phone"),
    maritalStatus: formData.get("maritalStatus") ?? "",
    occupation: formData.get("occupation") ?? "",
    childrenCount: formData.get("childrenCount") ?? "",
    photoPath: formData.get("photoPath") ?? "",
    membershipStatus: formData.get("membershipStatus"),
    ministryIds: formData.getAll("ministryIds").map(String),
    directoryVisible: formData.get("directoryVisible") === "on",
  });
}

function toRow(d: z.infer<typeof memberSchema>) {
  return {
    full_name: d.fullName,
    phone: d.phone,
    marital_status: d.maritalStatus === "" ? null : d.maritalStatus,
    occupation: d.occupation || null,
    children_count: d.childrenCount === "" ? null : Number(d.childrenCount),
    photo_path: d.photoPath || null,
    membership_status: d.membershipStatus,
    ministry_ids: d.ministryIds,
    directory_visible: d.directoryVisible,
  };
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

    const { data, error } = await supabase.from("members").insert(toRow(d)).select("id").single();
    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { status: d.membershipStatus });
  } catch (err) {
    console.error("createMember failed:", err);
    return { status: "error", message: "Something went wrong saving this member. Please try again." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/family");
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

    const { data: existing } = await supabase
      .from("members")
      .select("photo_path")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("members").update(toRow(d)).eq("id", id);
    if (error) throw error;

    // Remove the old photo file if it was replaced or removed.
    const oldPath = existing?.photo_path;
    if (oldPath && oldPath !== (d.photoPath || null)) {
      await supabase.storage.from(BUCKET).remove([oldPath]);
    }

    await logAudit(supabase, user.id, "update", id, { status: d.membershipStatus });
  } catch (err) {
    console.error("updateMember failed:", err);
    return { status: "error", message: "Something went wrong saving this member. Please try again." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/family");
  redirect("/admin/members");
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("members")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) {
    console.error("deleteMember failed:", error);
    return;
  }
  if (existing?.photo_path) {
    await supabase.storage.from(BUCKET).remove([existing.photo_path]);
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidatePath("/admin/members");
  revalidatePath("/family");
}