import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/forms/SignOutButton";

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Content", href: "/admin/content" },
  { label: "Communication", href: "/admin/communication" },
  { label: "Members", href: "/admin/members" },
  { label: "Media", href: "/admin/media" },
  { label: "Users", href: "/admin/users" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "Settings", href: "/admin/settings" },
] as const;

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    // Signed in, but not an Admin — proxy.ts only checks "is anyone logged
    // in", so this is the real gate. Sign them out rather than leaving a
    // half-authenticated session sitting around.
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-line bg-paper-raised p-6 lg:block">
        <p className="font-serif text-lg font-bold text-forest">Admin</p>
        <nav aria-label="Admin" className="mt-6 flex flex-col gap-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-2 text-sm font-medium text-ink/80 hover:bg-paper hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-paper-raised px-6 py-4">
          <p className="text-sm text-ink/70">
            Signed in as <span className="font-medium text-ink">{adminRow.full_name}</span>
          </p>
          <SignOutButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}