import { createClient } from "@/lib/supabase/server";
import type { Announcement, Event, Faq, Leader, Location, Ministry, Sermon, Story } from "@/types/database";

export async function getUpcomingEvents(limit = 4): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events").select("*").eq("status", "published")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true }).limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getUpcomingEvents failed:", err);
    return [];
  }
}

export async function getLatestSermon(): Promise<Sermon | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons").select("*").eq("status", "published")
      .order("sermon_date", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getLatestSermon failed:", err);
    return null;
  }
}

export async function getSermons(limit = 24): Promise<Sermon[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons").select("*").eq("status", "published")
      .order("sermon_date", { ascending: false }).limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getSermons failed:", err);
    return [];
  }
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getSermonBySlug failed:", err);
    return null;
  }
}

export async function getMinistries(): Promise<Ministry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries").select("*").eq("status", "published")
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getMinistries failed:", err);
    return [];
  }
}

export async function getMinistryBySlug(slug: string): Promise<Ministry | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getMinistryBySlug failed:", err);
    return null;
  }
}

export async function getEvents(limit = 50): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events").select("*").eq("status", "published")
      .order("start_at", { ascending: true }).limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getEvents failed:", err);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getEventBySlug failed:", err);
    return null;
  }
}

export async function getStories(limit = 24): Promise<Story[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories").select("*").eq("status", "published")
      .order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getStories failed:", err);
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getStoryBySlug failed:", err);
    return null;
  }
}

export async function getFeaturedStory(): Promise<Story | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories").select("*").eq("status", "published").eq("featured", true)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getFeaturedStory failed:", err);
    return null;
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("announcements").select("*").eq("status", "published")
      .lte("publish_at", nowIso)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("publish_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAnnouncements failed:", err);
    return [];
  }
}

export async function getSiteSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getSiteSettings failed:", err);
    return null;
  }
}

export async function getLeaders(): Promise<Leader[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getLeaders failed:", err);
    return [];
  }
}

export async function getPrimaryLocation(): Promise<Location | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getPrimaryLocation failed:", err);
    return null;
  }
}

export async function getLocationById(id: string | null): Promise<Location | null> {
  if (!id) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getLocationById failed:", err);
    return null;
  }
}

export async function getFaqs(pageContext = "general"): Promise<Faq[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("status", "published")
      .eq("page_context", pageContext)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getFaqs failed:", err);
    return [];
  }
}

export async function getGivingSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("giving_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getGivingSettings failed:", err);
    return null;
  }
}