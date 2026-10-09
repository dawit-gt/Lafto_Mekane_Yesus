"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const storySchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  category: z.enum(["testimony", "ministry", "community", ""]).optional(),
  bodyMd: z.string().trim().min(1, "Story content is required.").max(8000),
  featured: z.boolean(),
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
    table_name: "stories",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseStoryForm(formData: FormData) {
  return storySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    bodyMd: formData.get("bodyMd"),
    featured: formData.get("featured") === "on",
    imageUrl: formData.get("imageUrl") ?? "",
    status: formData.get("status"),
  });
}

export async function createStory(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseStoryForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .insert({
        title: d.title,
        slug: d.slug,
        category: d.category || null,
        body_md: d.bodyMd,
        featured: d.featured,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, "create", data.id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("createStory failed:", err);
    return { status: "error", message: "Something went wrong saving this story. Please try again." };
  }

  revalidatePath("/admin/content/stories");
  revalidatePath("/stories");
  redirect("/admin/content/stories");
}

export async function updateStory(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseStoryForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("stories")
      .update({
        title: d.title,
        slug: d.slug,
        category: d.category || null,
        body_md: d.bodyMd,
        featured: d.featured,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, "update", id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("updateStory failed:", err);
    return { status: "error", message: "Something went wrong saving this story. Please try again." };
  }

  revalidatePath("/admin/content/stories");
  revalidatePath("/stories");
  redirect("/admin/content/stories");
}

export async function deleteStory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("stories").delete().eq("id", id);
  if (error) {
    console.error("deleteStory failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidatePath("/admin/content/stories");
  revalidatePath("/stories");
}