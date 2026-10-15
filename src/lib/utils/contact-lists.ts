/** Phone numbers and giving accounts are stored as small JSON lists in the settings rows. */

export interface PhoneEntry {
  name: string;
  number: string;
}

export interface AccountEntry {
  provider: string;
  holder: string;
  number: string;
}

function asRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null);
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export function toPhones(value: unknown): PhoneEntry[] {
  return asRecords(value)
    .map((r) => ({ name: str(r.name), number: str(r.number) }))
    .filter((p) => p.number.trim() !== "");
}

export function toAccounts(value: unknown): AccountEntry[] {
  return asRecords(value)
    .map((r) => ({ provider: str(r.provider), holder: str(r.holder), number: str(r.number) }))
    .filter((a) => a.number.trim() !== "");
}

/** "+251 91 123 4567" -> "tel:+251911234567" */
export function telHref(number: string): string {
  const cleaned = number.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}