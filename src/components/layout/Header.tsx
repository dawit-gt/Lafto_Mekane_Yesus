"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav } from "@/lib/nav";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper-raised/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setMenuOpen(false)}>
          <span className="font-serif text-xl font-bold text-forest">Lafto Mekaneyesus</span>
          <span className="hidden text-xs text-clay sm:inline">EECMY</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-forest" : "text-ink/80 hover:text-forest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label="Switch language to Amharic"
            className="text-sm font-medium text-ink/70 hover:text-forest"
          >
            EN | አማ
          </button>
          <Button href="/contact" variant="primary" className="text-xs">
            Visit / Contact
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-paper-raised px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-2 py-2.5 text-base font-medium text-ink hover:bg-paper hover:text-forest"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-3 px-2 text-sm font-medium text-ink/70">
            EN | አማ
          </button>
        </nav>
      )}
    </header>
  );
}
