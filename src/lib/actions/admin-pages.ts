"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const pageSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  bodyMd: z.string().trim().max(20000).optional().or(z.literal("")),
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
    table_name: "pages",
    record_id: recordId,
    details: details ?? null,
  });
}

function parsePageForm(formData: FormData) {
  return pageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    bodyMd: formData.get("bodyMd"),
    status: formData.get("status"),
  });
}

export async function createPage(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parsePageForm(formData);
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
      .from("pages")
      .insert({
        title: d.title,
        slug: d.slug,
        body_md: d.bodyMd || "",
        status: d.status,
        updated_by: user.id,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("createPage failed:", err);
    return { status: "error", message: "Something went wrong saving this page. Please try again." };
  }

  revalidatePath("/admin/content/pages");
  redirect("/admin/content/pages");
}

export async function updatePage(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parsePageForm(formData);
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
      .from("pages")
      .update({
        title: d.title,
        slug: d.slug,
        body_md: d.bodyMd || "",
        status: d.status,
        updated_by: user.id,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, user.id, "update", id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("updatePage failed:", err);
    return { status: "error", message: "Something went wrong saving this page. Please try again." };
  }

  revalidatePath("/admin/content/pages");
  redirect("/admin/content/pages");
}

export async function deletePage(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) {
    console.error("deletePage failed:", error);
    return;
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidatePath("/admin/content/pages");
}