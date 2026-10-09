"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "media";

export interface MediaResult {
  ok: boolean;
  message?: string;
}

const registerSchema = z.object({
  path: z.string().regex(/^[0-9a-f-]{36}\.(jpg|pdf)$/, "Invalid file."),
  title: z.string().trim().min(1, "Title is required.").max(200),
  altText: z.string().trim().max(300).optional().or(z.literal("")),
  size: z.number().int().min(0).max(5 * 1024 * 1024),
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
    table_name: "media",
    record_id: recordId,
    details: details ?? null,
  });
}

/** Called after the browser has uploaded the file. Saves it in the library. */
export async function registerMedia(input: {
  path: string;
  title: string;
  altText: string;
  size: number;
}): Promise<MediaResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { data: exists } = await supabase.storage.from(BUCKET).exists(d.path);
    if (!exists) return { ok: false, message: "The file was not uploaded. Please try again." };

    const url = supabase.storage.from(BUCKET).getPublicUrl(d.path).data.publicUrl;
    const kind = d.path.endsWith(".pdf") ? "document" : "image";

    const { data, error } = await supabase
      .from("media")
      .insert({
        title: d.title,
        kind,
        url,
        alt_text: d.altText || null,
        file_size_bytes: d.size,
        uploaded_by: user.id,
      })
      .select("id")
      .single();
    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { title: d.title, kind });
  } catch (err) {
    console.error("registerMedia failed:", err);
    return { ok: false, message: "Something went wrong saving this file. Please try again." };
  }

  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: row } = await supabase.from("media").select("url, title").eq("id", id).maybeSingle();
  if (!row) return;

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    console.error("deleteMedia failed:", error);
    return;
  }

  const match = row.url.match(/\/object\/public\/media\/([^/?#]+)$/);
  if (match?.[1]) {
    await supabase.storage.from(BUCKET).remove([match[1]]);
  }

  await logAudit(supabase, user.id, "delete", id, { title: row.title });
  revalidatePath("/admin/media");
}