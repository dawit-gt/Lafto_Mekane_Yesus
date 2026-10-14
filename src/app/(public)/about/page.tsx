import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { Markdown } from "@/components/ui/Markdown";
import { getLeaders, getSiteSettings } from "@/lib/data/public";
import { getLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/pick";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our mission, our denomination, and the people who lead Lafto Mekaneyesus.",
};

export default async function AboutPage() {
  const [leaders, settings, locale] = await Promise.all([
    getLeaders(),
    getSiteSettings(),
    getLocale(),
  ]);

  const intro =
    pickLocalized(locale, settings?.about_intro, settings?.about_intro_am) ||
    "Lafto Mekaneyesus is a congregation of the Ethiopian Evangelical Church Mekane Yesus (EECMY), rooted in Scripture and committed to worship, discipleship, and service to our community.";
  const mission =
    pickLocalized(locale, settings?.about_mission, settings?.about_mission_am) ||
    "We exist to glorify God by making disciples of Jesus Christ — gathering as a family of faith to worship together, grow in the Word, and serve our neighbors with love.";
  const denomination =
    pickLocalized(locale, settings?.about_denomination, settings?.about_denomination_am) ||
    "The Ethiopian Evangelical Church Mekane Yesus (“Place of Jesus”) is one of the largest Lutheran communions in the world, with a long history of evangelism, education, and community development across Ethiopia and beyond.";

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">About Us</h1>
        <p className="mt-4 max-w-2xl whitespace-pre-line text-paper-raised/85">{intro}</p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-forest">Our Mission</h2>
            <Markdown className="mt-4 text-ink/80">{mission}</Markdown>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-forest">
              Our Denomination
            </h2>
            <Markdown className="mt-4 text-ink/80">{denomination}</Markdown>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <h2 className="text-2xl font-bold text-forest">Our Leadership</h2>

        {leaders.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <Card key={leader.id}>
                <SiteImage
                  src={leader.photo_url}
                  className="h-32 w-32 rounded-full"
                />

                <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                  {leader.full_name}
                </h3>

                <p className="text-sm text-brass">{leader.title}</p>

                {leader.bio_md && (
                  <p className="prose-body mt-2 text-sm text-ink/75">
                    {leader.bio_md}
                  </p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink/60">
            Leadership profiles coming soon.
          </p>
        )}

        <p className="mt-8 text-sm">
          <Link
            href="/family"
            className="font-medium text-forest underline underline-offset-4"
          >
            Meet our church family
          </Link>
        </p>
      </Section>
    </>
  );
}