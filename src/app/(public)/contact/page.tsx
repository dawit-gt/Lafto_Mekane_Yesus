import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "@/components/ui/CopyButton";
import { ContactForm } from "@/components/forms/ContactForm";
import { ChurchMap } from "@/components/ui/ChurchMap";
import { getGivingSettings, getPrimaryLocation, getSiteSettings, getTelegramUrl } from "@/lib/data/public";
import { telHref, toAccounts, toPhones } from "@/lib/utils/contact-lists";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch, find directions, or learn how to give to Lafto Mekaneyesus.",
};

export default async function ContactPage() {
  const [location, giving, telegramUrl] = await Promise.all([
    getPrimaryLocation(),
    getGivingSettings(),
    getTelegramUrl(),
  ]);

  const settings = await getSiteSettings();
  const phones = toPhones(settings?.contact_phones);
  const accounts = toAccounts(giving?.accounts);

  return (
    <>
      <Section tone="forest">
        <p className="kicker">Write or visit</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Contact Us</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">
          Questions, giving, or directions — everything is here in one place.
        </p>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="font-serif text-3xl font-bold text-forest">Send a Message</h2>
            <p className="mt-3 text-sm text-ink/70">We typically respond within a few business days.</p>
            {phones.length > 0 && (
              <div className="mt-8">
                <p className="kicker">Call us</p>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {phones.map((p, i) => (
                    <li key={`${p.number}-${i}`} className="py-3 text-sm">
                      {p.name && <span className="block text-xs text-ink/55">{p.name}</span>}
                      <a href={telHref(p.number)} className="font-serif text-xl text-forest hover:underline">
                        {p.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {telegramUrl && (
              <p className="mt-6 text-sm">
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-forest underline underline-offset-4">
                  Join the Telegram group →
                </a>
              </p>
            )}
          </div>
          <ContactForm />
        </div>
      </Section>

      <Section className="scroll-mt-20" id="give" tone="raised">
        <p className="kicker">Support</p>
        <h2 className="mt-2 font-serif text-4xl font-bold text-forest">Giving</h2>
        <p className="mt-4 max-w-2xl text-ink/85">
          {giving?.informational_note ??
            "Giving is currently informational only. Please see in-person or bank transfer options below."}
        </p>
        {accounts.length > 0 && (
          <ul className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            {accounts.map((a, i) => (
              <li key={`${a.number}-${i}`} className="border-t border-line pt-4">
                <p className="kicker">{a.provider}</p>
                {a.holder && <p className="mt-1 text-xs text-ink/55">{a.holder}</p>}
                <p className="mt-2 break-all font-mono text-lg text-ink">{a.number}</p>
                <div className="mt-3">
                  <CopyButton text={a.number} label="Copy number" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="kicker">Find us</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-forest">Directions</h2>
            {location ? (
              <div className="mt-4 text-ink/85">
                <p className="font-medium">{location.name}</p>
                <p>{location.address_line1}</p>
                <p>
                  {location.city}
                  {location.region ? `, ${location.region}` : ""}
                </p>
                {location.directions_note && (
                  <p className="mt-2 text-sm text-ink/65">{location.directions_note}</p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-ink/60">Address coming soon.</p>
            )}
          </div>
          <ChurchMap />
        </div>
      </Section>
    </>
  );
}