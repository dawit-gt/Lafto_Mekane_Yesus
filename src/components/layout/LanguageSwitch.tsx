"use client";

import { useTransition } from "react";
import { setLocale } from "@/lib/actions/locale";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitch({
  locale,
  label,
  className = "",
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      void setLocale(next);
    });
  }

  const base = "px-1 text-sm hover:text-forest disabled:opacity-60";
  return (
    <div role="group" aria-label={label} className={`flex items-center ${className}`}>
      <button
        type="button"
        lang="en"
        onClick={() => choose("en")}
        disabled={pending}
        aria-pressed={locale === "en"}
        className={`${base} ${locale === "en" ? "font-bold text-forest" : "font-medium text-ink/70"}`}
      >
        EN
      </button>
      <span aria-hidden="true" className="text-ink/40">|</span>
      <button
        type="button"
        lang="am"
        onClick={() => choose("am")}
        disabled={pending}
        aria-pressed={locale === "am"}
        className={`${base} ${locale === "am" ? "font-bold text-forest" : "font-medium text-ink/70"}`}
      >
        አማ
      </button>
    </div>
  );
}