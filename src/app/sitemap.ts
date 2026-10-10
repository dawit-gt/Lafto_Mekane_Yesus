import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { createPublicClient } from "@/lib/supabase/public";

// Built fresh on each request, so newly published content appears without a redeploy.
export const dynamic = "force-dynamic";

const staticPaths = [
  "",
  "/about",
  "/visit",
  "/ministries",
  "/sermons",
  "/events",
  "/stories",
  "/announcements",
  "/prayer",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const supabase = createPublicClient();
  if (!supabase) return entries;

  try {
    const [sermons, events, ministries, stories, pages] = await Promise.all([
      supabase.from("sermons").select("slug, updated_at").eq("status", "published"),
      supabase.from("events").select("slug, updated_at").eq("status", "published"),
      supabase.from("ministries").select("slug, updated_at").eq("status", "published"),
      supabase.from("stories").select("slug, updated_at").eq("status", "published"),
      supabase.from("pages").select("slug, updated_at").eq("status", "published"),
    ]);

    const add = (
      prefix: string,
      rows: Array<{ slug: string; updated_at: string }> | null,
    ) => {
      for (const row of rows ?? []) {
        entries.push({
          url: `${siteUrl}${prefix}/${row.slug}`,
          lastModified: new Date(row.updated_at),
        });
      }
    };

    add("/sermons", sermons.data);
    add("/events", events.data);
    add("/ministries", ministries.data);
    add("/stories", stories.data);
    add("/pages", pages.data);
  } catch (err) {
    console.error("sitemap: could not load published pages:", err);
  }

  return entries;
}