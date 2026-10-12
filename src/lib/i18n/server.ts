import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { getSiteSettings } from "@/lib/data/public";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDictionary() {
  const locale = await getLocale();
  const base = getDictionaryFor(locale);

  // The church name can be changed in Admin -> Settings. Empty means "use the built-in name".
  const settings = await getSiteSettings();
  const customName = (locale === "am" ? settings?.church_name_am : settings?.church_name)?.trim();
  const dict = customName ? { ...base, site: { ...base.site, name: customName } } : base;

  return { locale, dict };
}