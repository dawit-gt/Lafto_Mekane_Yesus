"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const tableSchema = z.enum(["contact_messages", "prayer_requests", "volunteer_requests"]);
const statusSchema = z.enum(["new", "in_progress", "resolved", "archived"]);

type SubmissionTable = z.infer<typeof tableSchema>;
type SubmissionStatus = z.infer<typeof statusSchema>;

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  table: SubmissionTable,
  recordId: string,
  details?: Record<string, unknown>
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    table_name: table,
    record_id: recordId,
    details: details ?? null,
  });
}

// One explicit branch per table keeps the typed Supabase client happy and
// guarantees only these three tables can ever be touched.
async function applyStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: SubmissionTable,
  id: string,
  status: SubmissionStatus
) {
  switch (table) {
    case "contact_messages": {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      return error;
    }
    case "prayer_requests": {
      const { error } = await supabase.from("prayer_requests").update({ status }).eq("id", id);
      return error;
    }
    case "volunteer_requests": {
      const { error } = await supabase.from("volunteer_requests").update({ status }).eq("id", id);
      return error;
    }
  }
}

async function removeRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: SubmissionTable,
  id: string
) {
  switch (table) {
    case "contact_messages": {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      return error;
    }
    case "prayer_requests": {
      const { error } = await supabase.from("prayer_requests").delete().eq("id", id);
      return error;
    }
    case "volunteer_requests": {
      const { error } = await supabase.from("volunteer_requests").delete().eq("id", id);
      return error;
    }
  }
}

export async function setSubmissionStatus(table: string, id: string, status: string): Promise<void> {
  const parsedTable = tableSchema.safeParse(table);
  const parsedStatus = statusSchema.safeParse(status);
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedTable.success || !parsedStatus.success || !parsedId.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const error = await applyStatus(supabase, parsedTable.data, parsedId.data, parsedStatus.data);
  if (error) {
    console.error("setSubmissionStatus failed:", error);
    return;
  }

  await logAudit(supabase, user.id, "status_change", parsedTable.data, parsedId.data, {
    status: parsedStatus.data,
  });
  revalidatePath("/admin/communication");
  revalidatePath("/admin/dashboard");
}

export async function deleteSubmission(table: string, id: string): Promise<void> {
  const parsedTable = tableSchema.safeParse(table);
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedTable.success || !parsedId.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const error = await removeRow(supabase, parsedTable.data, parsedId.data);
  if (error) {
    console.error("deleteSubmission failed:", error);
    return;
  }

  // The log records that a deletion happened, but not the deleted content.
  await logAudit(supabase, user.id, "delete", parsedTable.data, parsedId.data);
  revalidatePath("/admin/communication");
  revalidatePath("/admin/dashboard");
}