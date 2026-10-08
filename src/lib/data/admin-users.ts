import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAdmin } from "@/lib/auth/admin";

export interface AdminListItem {
  id: string;
  fullName: string;
  email: string | null;
  createdAt: string;
}

export async function getAdminUsers(): Promise<AdminListItem[]> {
  // Emails live in Supabase Auth, which needs the service-role key. Confirm
  // the caller is an admin before touching it.
  const current = await getCurrentAdmin();
  if (!current) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, full_name, created_at")
      .order("created_at", { ascending: true });
    if (error) throw error;

    const emailById = new Map<string, string>();
    try {
      const admin = createAdminClient();
      const { data: list, error: listError } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listError) throw listError;
      for (const u of list.users) {
        if (u.email) emailById.set(u.id, u.email);
      }
    } catch (err) {
      // Names still show; emails just appear as "—".
      console.error("Could not load admin emails:", err);
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: emailById.get(row.id) ?? null,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("getAdminUsers failed:", err);
    return [];
  }
}