/**
 * Converts a "datetime-local" input value (e.g. "2026-01-04T10:30", with no
 * timezone info) into a correct UTC ISO string, treating that naive
 * date/time as being in `timeZone` — not the server's timezone.
 *
 * Why this matters: an Admin typing "10:30" for a service in Addis Ababa
 * means 10:30 Africa/Addis_Ababa time. If we naively did
 * `new Date(input).toISOString()`, JavaScript would parse it as the
 * *server's* local time (often UTC on most hosts), silently shifting every
 * event by hours. This uses the Intl API to compute the real offset for the
 * given timezone at that date (correctly handling any DST rules the zone
 * has) with no extra dependency.
 */
export function zonedDateTimeToUtcIso(dateTimeLocal: string, timeZone: string): string {
  const [datePart, timePart] = dateTimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = (timePart ?? "00:00").split(":").map(Number);

  // A first guess, treating the naive values as UTC.
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Ask: "what time does the target timezone show at this UTC instant?"
  // The difference between that and our guess is the zone's offset.
  const offsetMinutes = getTimeZoneOffsetMinutes(utcGuess, timeZone);

  return new Date(utcGuess.getTime() - offsetMinutes * 60_000).toISOString();
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );

  return (asUtc - date.getTime()) / 60_000;
}

/** Inverse-ish helper: formats an ISO string for a datetime-local input, in a given timezone. */
export function isoToDateTimeLocal(isoString: string, timeZone: string): string {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** Small, practical list — covers the congregation and its diaspora. Any valid IANA name works even if not listed. */
export const commonTimeZones = [
  "Africa/Addis_Ababa",
  "UTC",
  "Europe/London",
  "Europe/Stockholm",
  "America/New_York",
  "America/Los_Angeles",
  "America/Toronto",
] as const;