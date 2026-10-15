import { createClient } from "@/lib/supabase/server";

/**
 * These run with the signed-in Admin's own session, not a service-role
 * client — the RLS policies in 0001_init.sql already grant admins full
 * read access ("... or is_admin()"), so there's no need to bypass RLS here.
 * Every function fails soft (returns 0 / []) so one bad query can't take
 * down the whole dashboard.
 */

type ContentTable = "events" | "sermons" | "ministries" | "announcements";

export interface ContentCounts {
  published: number;
  draft: number;
}

export async function getContentCounts(): Promise<Record<ContentTable, ContentCounts>> {
  const tables: ContentTable[] = ["events", "sermons", "ministries", "announcements"];
  const supabase = await createClient();

  const results = await Promise.all(
    tables.map(async (table) => {
      const [published, draft] = await Promise.all([
        supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);
      return [table, { published: published.count ?? 0, draft: draft.count ?? 0 }] as const;
    })
  );

  return Object.fromEntries(results) as Record<ContentTable, ContentCounts>;
}

export interface SubmissionCounts {
  contact: number;
  prayer: number;
}

export async function getNewSubmissionCounts(): Promise<SubmissionCounts> {
  try {
    const supabase = await createClient();
    const [contact, prayer] = await Promise.all([
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("prayer_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    ]);
    return {
      contact: contact.count ?? 0,
      prayer: prayer.count ?? 0,
    };
  } catch (err) {
    console.error("getNewSubmissionCounts failed:", err);
    return { contact: 0, prayer: 0 };
  }
}

export interface RecentSubmission {
  id: string;
  type: "contact" | "prayer";
  summary: string;
  createdAt: string;
}

export async function getRecentSubmissions(limit = 6): Promise<RecentSubmission[]> {
  try {
    const supabase = await createClient();
    const [contact, prayer] = await Promise.all([
      supabase
        .from("contact_messages")
        .select("id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase
        .from("prayer_requests")
        .select("id, name, is_confidential, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const combined: RecentSubmission[] = [
      ...(contact.data ?? []).map((row) => ({
        id: row.id,
        type: "contact" as const,
        summary: `${row.name} — contact message`,
        createdAt: row.created_at,
      })),
      ...(prayer.data ?? []).map((row) => ({
        id: row.id,
        type: "prayer" as const,
        summary: row.is_confidential ? "Confidential prayer request" : row.name || "Anonymous prayer request",
        createdAt: row.created_at,
      })),
    ];

    return combined
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (err) {
    console.error("getRecentSubmissions failed:", err);
    return [];
  }
}