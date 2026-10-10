
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
 * The Telegram group link, or null if it is empty or is not a Telegram address.
 * Only https://t.me/... and https://telegram.me/... links are accepted.
 */
export function getTelegramGroupUrl(): string | null {
  const url = siteConfig.telegramGroupUrl.trim();
  return /^https:\/\/(t|telegram)\.me\/\S+$/i.test(url) ? url : null;
}
