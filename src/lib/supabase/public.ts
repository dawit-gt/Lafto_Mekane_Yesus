import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookie-free client for public, read-only data such as the sitemap. It uses
 * the anon key, so database security rules decide what it can see: published
 * content only. Returns null if Supabase isn't configured yet.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}