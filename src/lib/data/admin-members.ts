import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/types/database";

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