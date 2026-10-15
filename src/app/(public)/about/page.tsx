import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SiteImage } from "@/components/ui/SiteImage";
import { Markdown } from "@/components/ui/Markdown";
import { getLeaders, getSiteSettings } from "@/lib/data/public";
import { getLocale } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/i18n/pick";

export const metadata: Metadata = {
  title: "About",
  description: "Our mission, our denomination, and the people who lead Lafto Mekaneyesus.",
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
        <p className="kicker">The church</p>
        <h1 className="mt-3 max-w-xl font-serif text-5xl font-bold">About Us</h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-paper-raised/85">{intro}</p>
      </Section>

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="kicker">01</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-forest">Our Mission</h2>
            <div className="dual-rule mt-4 max-w-[6rem]" />
            <Markdown className="mt-5 text-ink/80">{mission}</Markdown>
          </div>
          <div className="lg:pt-16">
            <p className="kicker">02</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-forest">Our Denomination</h2>
            <div className="dual-rule mt-4 max-w-[6rem]" />
            <Markdown className="mt-5 text-ink/80">{denomination}</Markdown>
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <p className="kicker">People</p>
        <h2 className="mt-2 font-serif text-4xl font-bold text-forest">Our Leadership</h2>
        {leaders.length > 0 ? (
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {leaders.map((leader) => (
              <li key={leader.id} className="grid gap-6 py-8 sm:grid-cols-[7rem_1fr] sm:items-start">
                <SiteImage src={leader.photo_url} className="h-24 w-24 rounded-[2px_2px_18px_2px]" />
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-ink">{leader.full_name}</h3>
                  <p className="kicker mt-1">{leader.title}</p>
                  {leader.bio_md && <p className="prose-body mt-3 text-sm text-ink/75">{leader.bio_md}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-ink/60">Leadership profiles coming soon.</p>
        )}
        <p className="mt-8 text-sm">
          <Link href="/members" className="font-medium text-forest underline underline-offset-4">
            See our members
          </Link>
        </p>
      </Section>
    </>
  );
}