"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { zonedDateTimeToUtcIso } from "@/lib/utils/timezone";
import type { FormState } from "@/lib/actions/state";

// Announcements don't carry a per-row timezone (unlike events), so times
// are always interpreted in the church's primary timezone.
const SITE_TIMEZONE = "Africa/Addis_Ababa";

const announcementSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  bodyMd: z.string().trim().min(1, "Announcement text is required.").max(2000),
  publishAtLocal: z.string().min(1, "Publish date/time is required."),
  expiresAtLocal: z.string().optional().or(z.literal("")),
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
    table_name: "announcements",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseAnnouncementForm(formData: FormData) {
  return announcementSchema.safeParse({
    title: formData.get("title"),
    bodyMd: formData.get("bodyMd"),
    publishAtLocal: formData.get("publishAtLocal"),
    expiresAtLocal: formData.get("expiresAtLocal"),
    status: formData.get("status"),
  });
}

export async function createAnnouncement(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseAnnouncementForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: d.title,
        body_md: d.bodyMd,
        publish_at: zonedDateTimeToUtcIso(d.publishAtLocal, SITE_TIMEZONE),
        expires_at: d.expiresAtLocal ? zonedDateTimeToUtcIso(d.expiresAtLocal, SITE_TIMEZONE) : null,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, "create", data.id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("createAnnouncement failed:", err);
    return { status: "error", message: "Something went wrong saving this announcement. Please try again." };
  }

  revalidatePath("/admin/content/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/admin/content/announcements");
}

export async function updateAnnouncement(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseAnnouncementForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("announcements")
      .update({
        title: d.title,
        body_md: d.bodyMd,
        publish_at: zonedDateTimeToUtcIso(d.publishAtLocal, SITE_TIMEZONE),
        expires_at: d.expiresAtLocal ? zonedDateTimeToUtcIso(d.expiresAtLocal, SITE_TIMEZONE) : null,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, "update", id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("updateAnnouncement failed:", err);
    return { status: "error", message: "Something went wrong saving this announcement. Please try again." };
  }

  revalidatePath("/admin/content/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/admin/content/announcements");
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) {
    console.error("deleteAnnouncement failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidatePath("/admin/content/announcements");
  revalidatePath("/announcements");
  revalidatePath("/");
}