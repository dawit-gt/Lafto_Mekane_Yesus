import Link from "next/link";
import { secondaryNav, legalNav } from "@/lib/nav";
import { getSiteSettings } from "@/lib/data/public";

export async function Footer() {
  const settings = await getSiteSettings();
  const serviceTimes =
    settings?.service_times_md?.trim() ||
    "Sunday Worship — 8:00 AM & 10:30 AM\nWednesday Prayer — 6:00 PM";

  return (
    <footer className="border-t border-line bg-forest text-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-bold">Lafto Mekaneyesus</p>
          <p className="mt-1 text-sm text-paper-raised/70">
            Ethiopian Evangelical Church Mekane Yesus
          </p>
          <p className="mt-4 whitespace-pre-line text-sm text-paper-raised/85">
            {serviceTimes}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/85 hover:text-paper-raised">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">Get in Touch</p>
          <ul className="mt-3 space-y-2 text-sm text-paper-raised/85">
            <li>
              <Link href="/contact" className="hover:text-paper-raised">Contact &amp; Directions</Link>
            </li>
            <li>
              <Link href="/contact#volunteer" className="hover:text-paper-raised">Volunteer</Link>
            </li>
            <li>
              <Link href="/contact#give" className="hover:text-paper-raised">Giving</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-raised/85 hover:text-paper-raised">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper-raised/15">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-paper-raised/60">
          © {new Date().getFullYear()} Lafto Mekaneyesus. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
