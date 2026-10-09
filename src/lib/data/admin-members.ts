import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/types/database";

export const MEMBER_PHOTO_BUCKET = "member-photos";

export async function getAdminMembers(): Promise<Member[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("full_name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("getAdminMembers failed:", err);
    return [];
  }
}

export async function getAdminMemberById(id: string): Promise<Member | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("members").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("getAdminMemberById failed:", err);
    return null;
  }
}

/** Temporary (1 hour) links so admins can see the private photos. */
export async function getMemberPhotoUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(MEMBER_PHOTO_BUCKET)
      .createSignedUrls(unique, 3600);
    if (error) throw error;
    const result: Record<string, string> = {};
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) result[item.path] = item.signedUrl;
    }
    return result;
  } catch (err) {
    console.error("getMemberPhotoUrls failed:", err);
    return {};
  }
}