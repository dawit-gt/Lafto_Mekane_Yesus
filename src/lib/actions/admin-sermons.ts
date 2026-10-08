"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const sermonSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  speaker: z.string().trim().min(1, "Speaker is required.").max(200),
  scripture: z.string().trim().max(200).optional().or(z.literal("")),
  seriesId: z.string().uuid().optional().or(z.literal("")),
  sermonDate: z.string().min(1, "Date is required."),
  videoUrl: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
  audioUrl: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
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
    table_name: "sermons",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseSermonForm(formData: FormData) {
  return sermonSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    speaker: formData.get("speaker"),
    scripture: formData.get("scripture"),
    seriesId: formData.get("seriesId"),
    sermonDate: formData.get("sermonDate"),
    videoUrl: formData.get("videoUrl"),
    audioUrl: formData.get("audioUrl"),
    status: formData.get("status"),
  });
}

export async function createSermon(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseSermonForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons")
      .insert({
        title: d.title,
        slug: d.slug,
        description: d.description || null,
        speaker: d.speaker,
        scripture: d.scripture || null,
        series_id: d.seriesId || null,
        sermon_date: d.sermonDate,
        video_url: d.videoUrl || null,
        audio_url: d.audioUrl || null,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, "create", data.id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("createSermon failed:", err);
    return { status: "error", message: "Something went wrong saving this sermon. Please try again." };
  }

  revalidatePath("/admin/content/sermons");
  revalidatePath("/sermons");
  redirect("/admin/content/sermons");
}

export async function updateSermon(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseSermonForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("sermons")
      .update({
        title: d.title,
        slug: d.slug,
        description: d.description || null,
        speaker: d.speaker,
        scripture: d.scripture || null,
        series_id: d.seriesId || null,
        sermon_date: d.sermonDate,
        video_url: d.videoUrl || null,
        audio_url: d.audioUrl || null,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, "update", id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("updateSermon failed:", err);
    return { status: "error", message: "Something went wrong saving this sermon. Please try again." };
  }

  revalidatePath("/admin/content/sermons");
  revalidatePath("/sermons");
  redirect("/admin/content/sermons");
}

export async function deleteSermon(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  if (error) {
    console.error("deleteSermon failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidatePath("/admin/content/sermons");
  revalidatePath("/sermons");
}