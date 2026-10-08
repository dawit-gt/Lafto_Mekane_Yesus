import { createClient } from "@/lib/supabase/server";
import type {
  Announcement,
  Event,
  Faq,
  Leader,
  Location,
  Ministry,
  Page,
  Sermon,
  Story,
} from "@/types/database";

/**
 * Unlike the public data-access layer (lib/data/public.ts), these don't
 * filter by status="published" — Admins need to see and edit drafts too.
 * RLS still applies underneath ("... or is_admin()"), so a non-admin
 * session could never actually get real rows back even if this file were
 * imported somewhere it shouldn't be.
 */

export async function getAdminEvents(): Promise<Event[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminEvents failed:", err);
    return [];
  }
}

export async function getAdminEventById(id: string): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminEventById failed:", err);
    return null;
  }
}

export interface SelectOption {
  id: string;
  label: string;
}

export async function getLocationOptions(): Promise<SelectOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("id, name")
      .order("name");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, label: row.name }));
  } catch (err) {
    console.error("getLocationOptions failed:", err);
    return [];
  }
}

export async function getMinistryOptions(): Promise<SelectOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries")
      .select("id, name")
      .order("name");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, label: row.name }));
  } catch (err) {
    console.error("getMinistryOptions failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------
// Sermons
// ---------------------------------------------------------------------
export async function getAdminSermons(): Promise<Sermon[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("sermon_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminSermons failed:", err);
    return [];
  }
}

export async function getAdminSermonById(id: string): Promise<Sermon | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminSermonById failed:", err);
    return null;
  }
}

export async function getSermonSeriesOptions(): Promise<SelectOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sermon_series")
      .select("id, title")
      .order("title");
    if (error) throw error;
    return (data ?? []).map((row) => ({ id: row.id, label: row.title }));
  } catch (err) {
    console.error("getSermonSeriesOptions failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------
// Ministries
// ---------------------------------------------------------------------
export async function getAdminMinistries(): Promise<Ministry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries")
      .select("*")
      .order("name");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminMinistries failed:", err);
    return [];
  }
}

export async function getAdminMinistryById(id: string): Promise<Ministry | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ministries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminMinistryById failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------
export async function getAdminStories(): Promise<Story[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminStories failed:", err);
    return [];
  }
}

export async function getAdminStoryById(id: string): Promise<Story | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminStoryById failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------
export async function getAdminAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("publish_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminAnnouncements failed:", err);
    return [];
  }
}

export async function getAdminAnnouncementById(
  id: string
): Promise<Announcement | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminAnnouncementById failed:", err);
    return null;
  }
}


// ---------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------
export async function getAdminPages(): Promise<Page[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("pages").select("*").order("title");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminPages failed:", err);
    return [];
  }
}

export async function getAdminPageById(id: string): Promise<Page | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminPageById failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// Leaders
// ---------------------------------------------------------------------
export async function getAdminLeaders(): Promise<Leader[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminLeaders failed:", err);
    return [];
  }
}

export async function getAdminLeaderById(id: string): Promise<Leader | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("leaders").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminLeaderById failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------
export async function getAdminLocations(): Promise<Location[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("locations").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminLocations failed:", err);
    return [];
  }
}

export async function getAdminLocationById(id: string): Promise<Location | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("locations").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminLocationById failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------
export async function getAdminFaqs(): Promise<Faq[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("page_context")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminFaqs failed:", err);
    return [];
  }
}

export async function getAdminFaqById(id: string): Promise<Faq | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminFaqById failed:", err);
    return null;
  }
}