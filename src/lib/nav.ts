import type { Dictionary } from "@/lib/i18n/dictionaries";

type NavKey = keyof Dictionary["nav"];
export type NavItem = { key: NavKey; href: string };

export const primaryNav: readonly NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "visit", href: "/visit" },
  { key: "ministries", href: "/ministries" },
  { key: "sermons", href: "/sermons" },
  { key: "events", href: "/events" },
  { key: "contact", href: "/contact" },
];

export const secondaryNav: readonly NavItem[] = [
  { key: "stories", href: "/stories" },
  { key: "announcements", href: "/announcements" },
  { key: "prayer", href: "/prayer" },
  { key: "members", href: "/members" },
];

export const legalNav: readonly NavItem[] = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "accessibility", href: "/accessibility" },
];