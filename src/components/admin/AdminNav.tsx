"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {adminNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-sm px-2 py-2.5 text-sm font-medium ${
                active
                  ? "bg-forest/10 text-forest"
                  : "text-ink/80 hover:bg-paper hover:text-forest"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** The side menu shown on large screens. */
export function AdminSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-line bg-paper-raised p-6 lg:block">
      <div className="sticky top-6">
        <p className="font-serif text-lg font-bold text-forest">Admin</p>
        <nav aria-label="Admin" className="mt-6">
          <NavLinks />
        </nav>
      </div>
    </aside>
  );
}

/** The top bar with a menu button, shown on phones and tablets. */
export function AdminMobileBar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-paper-raised lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <p className="font-serif text-lg font-bold text-forest">Admin</p>
        <span className="w-10" aria-hidden="true" />
      </div>

      {open && (
        <nav
          id="admin-mobile-nav"
          aria-label="Admin"
          className="max-h-[75vh] overflow-y-auto border-t border-line px-4 py-3"
        >
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <p className="text-sm text-ink/70">
              Signed in as <span className="font-medium text-ink">{name}</span>
            </p>
            <SignOutButton />
          </div>
        </nav>
      )}
    </div>
  );
}