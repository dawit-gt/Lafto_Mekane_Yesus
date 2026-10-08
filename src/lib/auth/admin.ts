import { createClient } from "@/lib/supabase/server";

export interface CurrentAdmin {
  id: string;
  fullName: string;
}

/** Returns the signed-in user only if they have a row in admin_users, otherwise null. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // RLS only lets admins read admin_users, so non-admins get no row back.
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (error || !data) return null;

    return { id: data.id, fullName: data.full_name };
  } catch (err) {
    console.error("getCurrentAdmin failed:", err);
    return null;
  }
}