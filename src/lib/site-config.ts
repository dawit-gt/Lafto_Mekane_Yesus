/**
 * Church-specific details used by the Privacy, Terms and Accessibility pages.
 * Fill these in before launch.
 */
export const siteConfig = {
  churchName: "Lafto Mekaneyesus",
  denominationName: "Ethiopian Evangelical Church Mekane Yesus (EECMY)",

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