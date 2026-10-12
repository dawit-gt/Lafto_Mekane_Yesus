import { createClient } from "@/lib/supabase/server";
import { excerpt } from "@/lib/utils/format";

export type SearchKind = "Sermon" | "Event" | "Story" | "Ministry" | "Page";

export interface SearchResult {
  kind: SearchKind;
  title: string;
  href: string;
  snippet: string;
}

const PER_TYPE = 8;

/**
 * Keeps only what is safe to put inside a search filter: letters, numbers
 * (including Amharic), spaces and hyphens. Characters that have a special
 * meaning in the database filter (commas, brackets, dots, % * _ quotes) are dropped.
 */
export function cleanQuery(raw: string | undefined): string {
  return (raw ?? "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} -]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function like(columns: string[], q: string): string {
  return columns.map((column) => `${column}.ilike.*${q}*`).join(",");
}

/** Searches published content only. Returns [] if the search is too short or fails. */
export async function searchSite(rawQuery: string | undefined): Promise<SearchResult[]> {
  const q = cleanQuery(rawQuery);
  if (q.length < 2) return [];

  try {
    const supabase = await createClient();

    const [sermons, events, stories, ministries, pages] = await Promise.all([
      supabase
        .from("sermons")
        .select("slug, title, speaker, scripture, description")
        .eq("status", "published")
        .or(like(["title", "speaker", "scripture", "description"], q))
        .order("sermon_date", { ascending: false })
        .limit(PER_TYPE),
      supabase
        .from("events")
        .select("slug, title, description")
        .eq("status", "published")
        .or(like(["title", "description"], q))
        .order("start_at", { ascending: false })
        .limit(PER_TYPE),
      supabase
        .from("stories")
        .select("slug, title, body_md")
        .eq("status", "published")
        .or(like(["title", "body_md"], q))
        .order("created_at", { ascending: false })
        .limit(PER_TYPE),
      supabase
        .from("ministries")
        .select("slug, name, summary")
        .eq("status", "published")
        .or(like(["name", "summary", "description_md"], q))
        .order("name")
        .limit(PER_TYPE),
      supabase
        .from("pages")
        .select("slug, title, body_md")
        .eq("status", "published")
        .or(like(["title", "body_md"], q))
        .order("title")
        .limit(PER_TYPE),
    ]);

    const results: SearchResult[] = [];

    for (const row of sermons.data ?? []) {
      results.push({
        kind: "Sermon",
        title: row.title,
        href: `/sermons/${row.slug}`,
        snippet: [row.speaker, row.scripture].filter(Boolean).join(" · ") ||
          excerpt(row.description ?? "", 120),
      });
    }
    for (const row of events.data ?? []) {
      results.push({
        kind: "Event",
        title: row.title,
        href: `/events/${row.slug}`,
        snippet: excerpt(row.description ?? "", 120),
      });
    }
    for (const row of stories.data ?? []) {
      results.push({
        kind: "Story",
        title: row.title,
        href: `/stories/${row.slug}`,
        snippet: excerpt(row.body_md, 120),
      });
    }
    for (const row of ministries.data ?? []) {
      results.push({
        kind: "Ministry",
        title: row.name,
        href: `/ministries/${row.slug}`,
        snippet: excerpt(row.summary, 120),
      });
    }
    for (const row of pages.data ?? []) {
      results.push({
        kind: "Page",
        title: row.title,
        href: `/pages/${row.slug}`,
        snippet: excerpt(row.body_md, 120),
      });
    }

    return results;
  } catch (err) {
    console.error("searchSite failed:", err);
    return [];
  }
}