import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/forms/SignOutButton";
import { AdminMobileBar, AdminSidebar } from "@/components/admin/AdminNav";

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
      <AdminSidebar />

      {/* min-w-0 lets wide tables scroll inside the page instead of stretching it */}
      <div className="min-w-0 flex-1">
        <AdminMobileBar name={adminRow.full_name} />
        <header className="hidden items-center justify-between border-b border-line bg-paper-raised px-6 py-4 lg:flex">
          <p className="text-sm text-ink/70">
            Signed in as <span className="font-medium text-ink">{adminRow.full_name}</span>
          </p>
          <SignOutButton />
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}