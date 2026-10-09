import { createClient } from "@/lib/supabase/server";
import type { Media } from "@/types/database";

export async function getAdminMedia(): Promise<Media[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminMedia failed:", err);
    return [];
  }
}