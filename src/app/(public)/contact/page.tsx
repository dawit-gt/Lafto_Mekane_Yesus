import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
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
        <h1 className="font-serif text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Questions, giving, or directions — everything is
          here in one place.
        </p>
      </Section>

      {/* General contact */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-forest">Send a Message</h2>
            <p className="mt-3 text-sm text-ink/70">
              We typically respond within a few business days.
            </p>

            {phones.length > 0 && (
              <Card className="mt-6">
                <h3 className="font-semibold text-forest">Call us</h3>
                <ul className="mt-3 space-y-2">
                  {phones.map((p, i) => (
                    <li key={`${p.number}-${i}`} className="text-sm text-ink/85">
                      {p.name && <span className="block text-xs text-ink/60">{p.name}</span>}
                      <a
                        href={telHref(p.number)}
                        className="font-semibold text-forest hover:underline"
                      >
                        {p.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {telegramUrl && (
              <Card className="mt-6">
                <h3 className="font-semibold text-forest">Join our Telegram group</h3>
                <p className="mt-2 text-sm text-ink/75">
                  For news, announcements and fellowship, join the church Telegram group.
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold tracking-wide text-paper-raised transition-colors hover:bg-forest-deep"
                >
                  Open Telegram group
                </a>
              </Card>
            )}
          </div>
          <ContactForm />
        </div>
      </Section>

      {/* Giving */}
      <Section className="scroll-mt-20" id="give">
        <h2 className="text-2xl font-bold text-forest">Giving</h2>
        <Card className="mt-6 max-w-2xl">
          <p className="text-ink/85">
            {giving?.informational_note ??
              "Giving is currently informational only. Please see in-person or bank transfer options below."}
          </p>
        </Card>

        {accounts.length > 0 && (
          <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
            {accounts.map((a, i) => (
              <Card key={`${a.number}-${i}`}>
                <p className="text-sm font-semibold text-forest">{a.provider}</p>
                {a.holder && <p className="mt-1 text-xs text-ink/60">{a.holder}</p>}
                <p className="mt-3 break-all font-mono text-base text-ink">{a.number}</p>
                <div className="mt-3">
                  <CopyButton text={a.number} label="Copy number" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Directions */}
      <Section tone="raised">
        <h2 className="text-2xl font-bold text-forest">Directions & Office Hours</h2>
        {location ? (
          <Card className="mt-6 max-w-xl">
            <p className="text-ink/85">{location.name}</p>
            <p className="text-ink/85">{location.address_line1}</p>
            <p className="text-ink/85">
              {location.city}
              {location.region ? `, ${location.region}` : ""}
            </p>
            {location.directions_note && (
              <p className="mt-2 text-sm text-ink/65">{location.directions_note}</p>
            )}
          </Card>
        ) : (
          <p className="mt-4 text-ink/60">Address coming soon.</p>
        )}

        <ChurchMap className="mt-6 max-w-3xl" />
      </Section>
    </>
  );
}