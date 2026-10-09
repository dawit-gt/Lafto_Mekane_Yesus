"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const ministrySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  summary: z.string().trim().min(1, "Summary is required.").max(300),
  descriptionMd: z.string().trim().max(4000).optional().or(z.literal("")),
  meetingInfo: z.string().trim().max(500).optional().or(z.literal("")),
  contactName: z.string().trim().max(200).optional().or(z.literal("")),
  contactEmail: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
  contactPhone: z.string().trim().max(40).optional().or(z.literal("")),
  imageUrl: z.string().trim().url("Invalid picture link.").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  action: string,
  recordId: string | null,
  details?: Record<string, unknown>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action,
    table_name: "ministries",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseMinistryForm(formData: FormData) {
  return ministrySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    descriptionMd: formData.get("descriptionMd"),
    meetingInfo: formData.get("meetingInfo"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    imageUrl: formData.get("imageUrl") ?? "",
    status: formData.get("status"),
  });
}

export async function createMinistry(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseMinistryForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries")
      .insert({
        name: d.name,
        slug: d.slug,
        summary: d.summary,
        description_md: d.descriptionMd || null,
        meeting_info: d.meetingInfo || null,
        contact_name: d.contactName || null,
        contact_email: d.contactEmail || null,
        contact_phone: d.contactPhone || null,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, "create", data.id, { name: d.name, status: d.status });
  } catch (err) {
    console.error("createMinistry failed:", err);
    return { status: "error", message: "Something went wrong saving this ministry. Please try again." };
  }

  revalidatePath("/admin/content/ministries");
  revalidatePath("/ministries");
  redirect("/admin/content/ministries");
}

export async function updateMinistry(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseMinistryForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("ministries")
      .update({
        name: d.name,
        slug: d.slug,
        summary: d.summary,
        description_md: d.descriptionMd || null,
        meeting_info: d.meetingInfo || null,
        contact_name: d.contactName || null,
        contact_email: d.contactEmail || null,
        contact_phone: d.contactPhone || null,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, "update", id, { name: d.name, status: d.status });
  } catch (err) {
    console.error("updateMinistry failed:", err);
    return { status: "error", message: "Something went wrong saving this ministry. Please try again." };
  }

  revalidatePath("/admin/content/ministries");
  revalidatePath("/ministries");
  redirect("/admin/content/ministries");
}

export async function deleteMinistry(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("ministries").delete().eq("id", id);
  if (error) {
    console.error("deleteMinistry failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidatePath("/admin/content/ministries");
  revalidatePath("/ministries");
}