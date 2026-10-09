import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { MEMBER_PHOTO_BUCKET } from "@/lib/data/admin-members";

export interface FamilyMember {
  name: string;
  photoUrl: string | null;
}

/**
 * Public "church family" list. Only active members who agreed to be listed,
 * and only their name and photo. Reads with the server-side admin client and
 * selects exactly two columns, so nothing else can leak to the public page.
 */
export async function getPublicFamily(): Promise<FamilyMember[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("members")
      .select("full_name, photo_path")
      .eq("membership_status", "active")
      .eq("directory_visible", true)
      .order("full_name", { ascending: true });
    if (error) throw error;
    const rows = data ?? [];

    const paths = rows.map((r) => r.photo_path).filter((p): p is string => !!p);
    const urls: Record<string, string> = {};
    if (paths.length > 0) {
      const { data: signed, error: signError } = await supabase.storage
        .from(MEMBER_PHOTO_BUCKET)
        .createSignedUrls(paths, 3600);
      if (signError) throw signError;
      for (const item of signed ?? []) {
        if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
      }
    }

    return rows.map((r) => ({
      name: r.full_name,
      photoUrl: r.photo_path ? urls[r.photo_path] ?? null : null,
    }));
  } catch (err) {
    console.error("getPublicFamily failed:", err);
    return [];
  }
}