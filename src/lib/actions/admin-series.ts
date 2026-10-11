"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const seriesSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
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
    table_name: "sermon_series",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseSeriesForm(formData: FormData) {
  return seriesSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });
}

function revalidateSeriesPages() {
  revalidatePath("/admin/content/series");
  revalidatePath("/admin/content/sermons");
  revalidatePath("/sermons");
}

export async function createSeries(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseSeriesForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermon_series")
      .insert({ title: d.title, slug: d.slug, description: d.description || null })
      .select("id")
      .single();
    if (error) throw error;
    await logAudit(supabase, "create", data.id, { title: d.title });
  } catch (err) {
    console.error("createSeries failed:", err);
    return { status: "error", message: "Something went wrong saving this series. Is the slug already used?" };
  }

  revalidateSeriesPages();
  redirect("/admin/content/series");
}

export async function updateSeries(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseSeriesForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("sermon_series")
      .update({ title: d.title, slug: d.slug, description: d.description || null })
      .eq("id", id);
    if (error) throw error;
    await logAudit(supabase, "update", id, { title: d.title });
  } catch (err) {
    console.error("updateSeries failed:", err);
    return { status: "error", message: "Something went wrong saving this series. Is the slug already used?" };
  }

  revalidateSeriesPages();
  redirect("/admin/content/series");
}

export async function deleteSeries(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("sermon_series").delete().eq("id", id);
  if (error) {
    console.error("deleteSeries failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidateSeriesPages();
}
