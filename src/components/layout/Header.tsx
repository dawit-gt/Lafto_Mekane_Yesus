"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/lib/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper-raised/95 backdrop-blur ${
        scrolled ? "shadow-[0_10px_30px_-24px_rgba(7,59,120,0.65)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 pb-3 pt-4">
        <Link href="/" className="group flex items-center gap-3 pb-1" onClick={() => setMenuOpen(false)}>
          <Logo size={44} className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-3" />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-bold text-forest sm:text-xl">{dict.site.name}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">
              {dict.site.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-x-4 pb-1 lg:flex xl:gap-x-5">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link text-[13px] font-medium ${
                  active ? "text-forest" : "text-ink/75 hover:text-forest"
                }`}
              >
                {dict.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 pb-1 lg:flex">
          <Link
            href="/search"
            aria-label={dict.header.search}
            className="nav-link text-[13px] font-medium text-ink/70 hover:text-forest"
          >
            {dict.header.search}
          </Link>
          <LanguageSwitch locale={locale} label={dict.header.switchLanguage} />
          <Button href="/contact" variant="primary" className="px-3 py-2 text-xs">
            {dict.header.visitContact}
          </Button>
        </div>

        <button
          type="button"
          className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-line lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">{menuOpen ? dict.header.closeMenu : dict.header.openMenu}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      <div className="dual-rule" />

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-paper-raised px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[2px] px-2 py-2.5 text-base font-medium text-ink hover:bg-paper hover:text-forest"
                >
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/search"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-[2px] px-2 py-2.5 text-base font-medium text-ink hover:bg-paper hover:text-forest"
          >
            {dict.header.search}
          </Link>
          <LanguageSwitch locale={locale} label={dict.header.switchLanguage} className="mt-3 px-2" />
        </nav>
      )}
    </header>
  );
}