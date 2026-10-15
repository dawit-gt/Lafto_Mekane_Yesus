import type { Dictionary } from "@/lib/i18n/dictionaries";

type NavKey = keyof Dictionary["nav"];
export type NavItem = { key: NavKey; href: string };

export const primaryNav: readonly NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "visit", href: "/visit" },
  { key: "ministries", href: "/ministries" },
  { key: "members", href: "/members" },
  { key: "sermons", href: "/sermons" },
  { key: "events", href: "/events" },
  { key: "contact", href: "/contact" },
];

export const secondaryNav: readonly NavItem[] = [
  { key: "announcements", href: "/announcements" },
  { key: "prayer", href: "/prayer" },
];

export const legalNav: readonly NavItem[] = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "accessibility", href: "/accessibility" },
];