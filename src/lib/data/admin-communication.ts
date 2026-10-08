import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Tables = Database["public"]["Tables"];
export type ContactMessage = Tables["contact_messages"]["Row"];
export type PrayerRequest = Tables["prayer_requests"]["Row"];
export type VolunteerRequest = Tables["volunteer_requests"]["Row"];

/**
 * Runs with the signed-in Admin's session. RLS only lets admins read these
 * tables (see 0001_init.sql), so a non-admin session would get nothing back
 * even if this file were imported somewhere it shouldn't be.
 */

export async function getContactMessages(limit = 100): Promise<ContactMessage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getContactMessages failed:", err);
    return [];
  }
}

export async function getPrayerRequests(limit = 100): Promise<PrayerRequest[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getPrayerRequests failed:", err);
    return [];
  }
}

export async function getVolunteerRequests(limit = 100): Promise<VolunteerRequest[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("volunteer_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getVolunteerRequests failed:", err);
    return [];
  }
}