import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ChurchMap } from "@/components/ui/ChurchMap";
import { siteConfig } from "@/lib/site-config";
import { getFaqs, getPrimaryLocation, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Visit Us",
  description: "Service times, directions, and what to expect on your first visit to Lafto Mekaneyesus.",
};

const expect = [
  {
    n: "01",
    title: "Arrival",
    body: "Come as you are. Greeters will help you find a seat and answer any questions.",
  },
  {
    n: "02",
    title: "Worship",
    body: "Services include singing, prayer, and a message from Scripture, typically lasting about 90 minutes.",
  },
  {
    n: "03",
    title: "Families",
    body: "Children are always welcome in the main service; age-appropriate programs are also available.",
  },
];

export default async function VisitPage() {
  const [location, settings, faqs] = await Promise.all([
    getPrimaryLocation(),
    getSiteSettings(),
    getFaqs("visit"),
  ]);

  const serviceTimes =
    settings?.service_times_md?.trim() ||
    "Sunday Worship — 8:00 AM & 10:30 AM\nWednesday Prayer — 6:00 PM";

  return (
    <>
      <Section tone="forest">
        <p className="kicker">Come this Sunday</p>
        <h1 className="mt-3 max-w-lg font-serif text-5xl font-bold">Plan Your Visit</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">
          We&apos;d love to welcome you. Here&apos;s everything you need before your first Sunday with us.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="kicker">When</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-forest">Service Times</h2>
            <p className="mt-5 whitespace-pre-line font-serif text-2xl leading-snug text-ink">{serviceTimes}</p>
          </div>
          <div className="folio">
            <p className="kicker">Where</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-forest">Location</h2>
            {location ? (
              <div className="mt-4 text-ink/85">
                <p className="font-medium">{location.name}</p>
                <p>{location.address_line1}</p>
                {location.address_line2 && <p>{location.address_line2}</p>}
                <p>
                  {location.city}
                  {location.region ? `, ${location.region}` : ""}
                </p>
                {location.directions_note && (
                  <p className="mt-2 text-sm text-ink/65">{location.directions_note}</p>
                )}
                <Button href={siteConfig.map.shareUrl} variant="ghost" className="mt-4">
                  Get directions →
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-ink/60">Address coming soon.</p>
            )}
          </div>
        </div>
        <ChurchMap className="mt-12" />
      </Section>

      <Section tone="raised">
        <p className="kicker">A first Sunday</p>
        <h2 className="mt-2 font-serif text-4xl font-bold text-forest">What to Expect</h2>
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {expect.map((item) => (
            <li key={item.n} className="grid gap-3 py-6 sm:grid-cols-[4rem_12rem_1fr] sm:items-baseline">
              <span className="kicker">{item.n}</span>
              <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink/75">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {faqs.length > 0 && (
        <Section>
          <h2 className="font-serif text-3xl font-bold text-forest">Common Questions</h2>
          <div className="mt-8 max-w-2xl divide-y divide-line border-t border-line">
            {faqs.map((faq) => (
              <article key={faq.id} className="py-5">
                <h3 className="font-serif text-xl text-ink">{faq.question}</h3>
                <p className="prose-body mt-2 text-sm text-ink/75">{faq.answer_md}</p>
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}