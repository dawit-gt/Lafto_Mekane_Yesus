import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

// Called once a day by Vercel Cron so the free Supabase project never sits
// idle long enough to be paused. It reads one harmless public row.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "not configured" }, { status: 500 });
  }

  const { error } = await supabase.from("site_settings").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}