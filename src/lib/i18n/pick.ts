import type { Locale } from "@/lib/i18n/config";

/**
 * Chooses the text for the visitor's language. In Amharic it uses the Amharic
 * text if the church wrote one, otherwise the English text (or "" if neither).
 */
export function pickLocalized(
  locale: Locale,
  english: string | null | undefined,
  amharic: string | null | undefined
): string {
  return (locale === "am" ? amharic?.trim() : "") || english?.trim() || "";
}