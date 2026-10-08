import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AuditRow = Database["public"]["Tables"]["audit_logs"]["Row"];

export interface AuditEntry {
  id: string;
  createdAt: string;
  actorName: string;
  action: string;
  tableName: string;
  recordId: string | null;
  details: AuditRow["details"];
}

export async function getAuditLogs(
  page: number,
  pageSize = 50
): Promise<{ entries: AuditEntry[]; hasMore: boolean }> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;

    // Ask for one extra row so we know whether an "Older" page exists.
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize);
    if (error) throw error;

    const rows = data ?? [];
    const hasMore = rows.length > pageSize;
    const visible = rows.slice(0, pageSize);

    const actorIds = [
      ...new Set(visible.map((r) => r.actor_id).filter((id): id is string => !!id)),
    ];
    const names = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: admins } = await supabase
        .from("admin_users")
        .select("id, full_name")
        .in("id", actorIds);
      for (const a of admins ?? []) names.set(a.id, a.full_name);
    }

    return {
      hasMore,
      entries: visible.map((r) => ({
        id: r.id,
        createdAt: r.created_at,
        actorName: r.actor_id ? (names.get(r.actor_id) ?? "Unknown") : "Former admin",
        action: r.action,
        tableName: r.table_name,
        recordId: r.record_id,
        details: r.details,
      })),
    };
  } catch (err) {
    console.error("getAuditLogs failed:", err);
    return { entries: [], hasMore: false };
  }
}