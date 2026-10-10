import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { ChurchMap } from "@/components/ui/ChurchMap";
import { getGivingSettings, getPrimaryLocation } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch, volunteer, find directions, or learn how to give to Lafto Mekaneyesus.",
};

export default async function ContactPage() {
  const [location, giving] = await Promise.all([getPrimaryLocation(), getGivingSettings()]);

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Questions, volunteering, giving, or directions — everything is
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
          </div>
          <ContactForm />
        </div>
      </Section>

      {/* Volunteer */}
      <Section tone="raised" className="scroll-mt-20" id="volunteer">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-forest">Volunteer</h2>
            <p className="mt-3 text-sm text-ink/70">
              Tell us where you&apos;d like to serve, and a ministry leader will
              follow up with you.
            </p>
          </div>
          <VolunteerForm />
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
          {giving?.is_online_giving_enabled && giving.provider_url && (
            <Button href={giving.provider_url} variant="primary" className="mt-4">
              Give Online via {giving.provider_name ?? "our giving partner"}
            </Button>
          )}
        </Card>
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