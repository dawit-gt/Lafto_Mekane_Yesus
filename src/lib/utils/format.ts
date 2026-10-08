 /**
 * Formats an ISO timestamp as "Sun, Jan 4 · 10:30 AM" in the given timezone.
 * Falls back gracefully if the input is missing or invalid.
 */
export function formatEventDateTime(isoString: string, timeZone = "Africa/Addis_Ababa"): string {
  try {
    const date = new Date(isoString);
    const datePart = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone,
    }).format(date);
    const timePart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(date);
    return `${datePart} · ${timePart}`;
  } catch {
    return "";
  }
}

/** Formats a plain date (e.g. sermon_date "2026-01-04") as "Jan 4, 2026". */
export function formatDate(isoDateString: string): string {
  try {
    const date = new Date(`${isoDateString}T00:00:00`);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoDateString;
  }
}

/** Shortens text to roughly maxLength characters, cutting at a word boundary. */
export function excerpt(text: string, maxLength = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}