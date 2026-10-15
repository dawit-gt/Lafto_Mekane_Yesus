import Link from "next/link";
import { secondaryNav, legalNav } from "@/lib/nav";
import { getSiteSettings, getTelegramUrl } from "@/lib/data/public";
import { getDictionary } from "@/lib/i18n/server";
import { Logo } from "@/components/brand/Logo";

export async function Footer() {
  const { dict } = await getDictionary();
  const telegramUrl = await getTelegramUrl();
  const settings = await getSiteSettings();
  const serviceTimes =
    settings?.service_times_md?.trim() || dict.footer.defaultServiceTimes;

  return (
    <footer className="tone-dark bg-forest-deep text-paper-raised">
      <div className="dual-rule" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Logo size={52} />
            <div className="leading-tight">
              <p className="font-serif text-2xl font-bold">{dict.site.name}</p>
              <p className="kicker mt-1">{dict.site.tagline}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-paper-raised/70">{dict.site.denomination}</p>
          <p className="mt-5 whitespace-pre-line font-serif text-lg leading-snug text-paper-raised/90">
            {serviceTimes}
          </p>
        </div>

        <div className="md:pt-3">
          <p className="kicker">{dict.footer.explore}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/80 hover:text-paper-raised">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <p className="kicker mt-8">{dict.footer.legal}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/80 hover:text-paper-raised">
                  {dict.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:pt-10">
          <p className="kicker">{dict.footer.getInTouch}</p>
          <ul className="mt-4 space-y-2 text-sm text-paper-raised/80">
            <li>
              <Link href="/contact" className="hover:text-paper-raised">{dict.footer.contactDirections}</Link>
            </li>
            <li>
              <Link href="/contact#give" className="hover:text-paper-raised">{dict.footer.giving}</Link>
            </li>
            {telegramUrl && (
              <li>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper-raised">
                  {dict.footer.telegram}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-6xl px-6 pb-8 text-[11px] tracking-wide text-paper-raised/50">
        © {new Date().getFullYear()} {dict.site.name}. {dict.footer.rights}
      </p>
    </footer>
  );
}