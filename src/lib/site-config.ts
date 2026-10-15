/**
 * Church-specific details used by the Privacy, Terms and Accessibility pages.
 * Fill these in before launch.
 */
export const siteConfig = {
  churchName: "Lafto Mekaneyesus",
  denominationName: "Ethiopian Evangelical Church Mekane Yesus (EECMY)",

  // Link to the church Telegram group, for example "https://t.me/+AbCdEfGh123".
  // Leave it as "" to hide the Telegram links on the website.
  telegramGroupUrl: "" as string,

  // REQUIRED before launch: the address people should write to about privacy,
  // terms and accessibility. While this placeholder is here, it shows on the pages.
  contactEmail: "privacy@example.org",

  // The church's real place on the map (taken from the church's Google Maps link).
  map: {
    latitude: 8.9515792,
    longitude: 38.7457497,
    shareUrl: "https://maps.app.goo.gl/EmWMNZbWEBn1owh4A",
  },

  // How long the team keeps submissions before deleting them.
  // These are suggestions. The church should decide the real periods.
  retentionMonths: {
    contactMessages: 12,
    volunteerRequests: 12,
    prayerRequests: 6,
  },

  // Update this whenever you change the wording of these pages.
  legalLastUpdated: "8 October 2026",
} as const;

/**
 * Returns the link if it is a Telegram address (https://t.me/... or
 * https://telegram.me/...), otherwise null.
 */
export function normalizeTelegramUrl(url: string | null | undefined): string | null {
  const trimmed = (url ?? "").trim();
  return /^https:\/\/(t|telegram)\.me\/\S+$/i.test(trimmed) ? trimmed : null;
}

/** The Telegram link written in this file (the fallback when Admin -> Settings has none). */
export function getTelegramGroupUrl(): string | null {
  return normalizeTelegramUrl(siteConfig.telegramGroupUrl);
}