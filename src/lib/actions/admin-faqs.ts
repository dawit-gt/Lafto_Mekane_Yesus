"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required.").max(300),
  answerMd: z.string().trim().min(1, "Answer is required.").max(4000),
  pageContext: z.enum(["general", "visit", "contact"]),
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
    table_name: "faqs",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseFaqForm(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answerMd: formData.get("answerMd"),
    pageContext: formData.get("pageContext"),
    displayOrder: formData.get("displayOrder"),
    status: formData.get("status"),
  });
}

function revalidateFaqPages() {
  revalidatePath("/admin/content/faqs");
  revalidatePath("/visit");
  revalidatePath("/contact");
}

export async function createFaq(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseFaqForm(formData);
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
      .from("faqs")
      .insert({
        question: d.question,
        answer_md: d.answerMd,
        page_context: d.pageContext,
        display_order: d.displayOrder,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { question: d.question, status: d.status });
  } catch (err) {
    console.error("createFaq failed:", err);
    return { status: "error", message: "Something went wrong saving this FAQ. Please try again." };
  }

  revalidateFaqPages();
  redirect("/admin/content/faqs");
}

export async function updateFaq(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseFaqForm(formData);
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
      .from("faqs")
      .update({
        question: d.question,
        answer_md: d.answerMd,
        page_context: d.pageContext,
        display_order: d.displayOrder,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, user.id, "update", id, { question: d.question, status: d.status });
  } catch (err) {
    console.error("updateFaq failed:", err);
    return { status: "error", message: "Something went wrong saving this FAQ. Please try again." };
  }

  revalidateFaqPages();
  redirect("/admin/content/faqs");
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) {
    console.error("deleteFaq failed:", error);
    return;
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidateFaqPages();
}