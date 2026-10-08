import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/forms/SignOutButton";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already redirects unauthenticated visitors away from /members,
  // but checking again here means this page is safe even if it's ever
  // reached a different way (e.g. a future route added outside the
  // middleware matcher).
  if (!user) {
    redirect("/members/login");
  }

  return (
    <Section>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-forest">Members Area</h1>
        <SignOutButton />
      </div>
      <Card className="mt-6 max-w-xl">
        <p className="text-ink/80">
          Welcome, {user.email}. Member-only resources and announcements will
          appear here as they&apos;re added.
        </p>
      </Card>
    </Section>
  );
}