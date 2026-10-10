import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChurchMap } from "@/components/ui/ChurchMap";
import { siteConfig } from "@/lib/site-config";
import { getFaqs, getPrimaryLocation, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Visit Us",
  description: "Service times, directions, and what to expect on your first visit to Lafto Mekaneyesus.",
};

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
        <h1 className="font-serif text-4xl font-bold">Plan Your Visit</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          We&apos;d love to welcome you. Here&apos;s everything you need to know before
          your first Sunday with us.
        </p>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-bold text-forest">Service Times</h2>
            <p className="mt-3 whitespace-pre-line text-ink/85">{serviceTimes}</p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-forest">Location</h2>
            {location ? (
              <div className="mt-3 text-ink/85">
                <p>{location.name}</p>
                <p>{location.address_line1}</p>
                {location.address_line2 && <p>{location.address_line2}</p>}
                <p>
                  {location.city}
                  {location.region ? `, ${location.region}` : ""}
                </p>
                {location.directions_note && (
                  <p className="mt-2 text-sm text-ink/65">{location.directions_note}</p>
                )}
                <Button
                  href={siteConfig.map.shareUrl}
                  variant="ghost"
                  className="mt-3 px-0"
                >
                  Get directions →
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-ink/60">Address coming soon.</p>
            )}
          </Card>
        </div>

        <ChurchMap className="mt-8" />
      </Section>

      <Section tone="raised">
        <h2 className="text-2xl font-bold text-forest">What to Expect</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Card>
            <h3 className="font-serif text-lg font-semibold text-ink">Arrival</h3>
            <p className="mt-2 text-sm text-ink/75">
              Come as you are. Greeters will help you find a seat and answer
              any questions.
            </p>
          </Card>
          <Card>
            <h3 className="font-serif text-lg font-semibold text-ink">Worship</h3>
            <p className="mt-2 text-sm text-ink/75">
              Services include singing, prayer, and a message from Scripture,
              typically lasting about 90 minutes.
            </p>
          </Card>
          <Card>
            <h3 className="font-serif text-lg font-semibold text-ink">Families</h3>
            <p className="mt-2 text-sm text-ink/75">
              Children are always welcome in the main service; age-appropriate
              programs are also available.
            </p>
          </Card>
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section>
          <h2 className="text-2xl font-bold text-forest">Common Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <h3 className="font-semibold text-ink">{faq.question}</h3>
                <p className="prose-body mt-2 text-sm text-ink/75">{faq.answer_md}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}