import Link from "next/link";
import { secondaryNav, legalNav } from "@/lib/nav";
import { getSiteSettings } from "@/lib/data/public";
import { getDictionary } from "@/lib/i18n/server";

export async function Footer() {
  const { dict } = await getDictionary();
  const settings = await getSiteSettings();
  const serviceTimes =
    settings?.service_times_md?.trim() || dict.footer.defaultServiceTimes;

  return (
    <footer className="border-t border-line bg-forest text-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-bold">{dict.site.name}</p>
          <p className="mt-1 text-sm text-paper-raised/70">
            {dict.site.denomination}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm text-paper-raised/85">
            {serviceTimes}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">{dict.footer.explore}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/85 hover:text-paper-raised">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">{dict.footer.getInTouch}</p>
          <ul className="mt-3 space-y-2 text-sm text-paper-raised/85">
            <li>
              <Link href="/contact" className="hover:text-paper-raised">{dict.footer.contactDirections}</Link>
            </li>
            <li>
              <Link href="/contact#volunteer" className="hover:text-paper-raised">{dict.footer.volunteer}</Link>
            </li>
            <li>
              <Link href="/contact#give" className="hover:text-paper-raised">{dict.footer.giving}</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">{dict.footer.legal}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/85 hover:text-paper-raised">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper-raised/15">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-paper-raised/60">
          © {new Date().getFullYear()} {dict.site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}