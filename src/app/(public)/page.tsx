import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Markdown } from "@/components/ui/Markdown";
import { CrossMark } from "@/components/brand/CrossMark";
import {
  getAnnouncements,
  getLatestSermon,
  getSiteSettings,
  getUpcomingEvents,
} from "@/lib/data/public";
import { getLocale } from "@/lib/i18n/server";
import { excerpt, formatEventDateTime } from "@/lib/utils/format";

export default async function HomePage() {
  const [announcements, sermon, events, settings] = await Promise.all([
    getAnnouncements(),
    getLatestSermon(),
    getUpcomingEvents(3),
    getSiteSettings(),
  ]);

  const locale = await getLocale();
  const pick = (english: string | null | undefined, amharic: string | null | undefined) =>
    (locale === "am" ? amharic?.trim() : "") || english?.trim() || "";

  const heroImage = settings?.hero_image_url || null;
  const heroTitle =
    pick(settings?.hero_title, settings?.hero_title_am) ||
    "A place to belong, a place to grow in faith.";
  const heroText =
    pick(settings?.hero_text, settings?.hero_text_am) ||
    "Lafto Mekaneyesus is a congregation of the Ethiopian Evangelical Church Mekane Yesus, welcoming everyone — near or far — into worship, community, and service.";

  const welcomeText = pick(settings?.welcome_text, settings?.welcome_text_am);
  const welcomeTitle =
    pick(settings?.welcome_title, settings?.welcome_title_am) ||
    (locale === "am" ? "እንኳን ደህና መጡ" : "Welcome");
  const welcomeSignature = pick(settings?.welcome_signature, settings?.welcome_signature_am);
  const welcomeImage = settings?.welcome_image_url || null;

  const serviceTimes =
    settings?.service_times_md?.trim() ||
    "Sunday Worship — 8:00 AM & 10:30 AM\nWednesday Prayer — 6:00 PM";

  return (
    <>
      {/* Hero */}
      <Section tone="forest" className="relative overflow-hidden">
        {heroImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt=""
              fetchPriority="high"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/80 to-forest/55"
            />
          </>
        ) : (
          <CrossMark
            animated
            color="#ffffff"
            inner="#0059b5"
            className="pointer-events-none absolute -right-16 top-1/2 hidden h-[130%] -translate-y-1/2 opacity-[0.07] lg:block"
          />
        )}
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-paper-raised/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass">
              EECMY · Lafto Mekaneyesus Congregation
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-lg whitespace-pre-line text-paper-raised/85">
              {heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                href="/visit"
                variant="primary"
                className="bg-brass! text-forest-deep! hover:bg-paper-raised!"
              >
                Plan a Visit
              </Button>
              <Button
                href="/sermons"
                variant="secondary"
                className="border-paper-raised text-paper-raised hover:bg-paper-raised hover:text-forest"
              >
                Watch Sermons
              </Button>
            </div>
          </div>

          <div className="rounded-sm border border-paper-raised/25 bg-paper-raised/10 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-paper-raised/15">
            <p className="text-xs font-semibold uppercase tracking-wide text-brass">
              This Week
            </p>
            <p className="mt-3 whitespace-pre-line text-lg">{serviceTimes}</p>
            <Link
              href="/visit"
              className="mt-4 inline-block text-sm font-medium text-paper-raised underline underline-offset-4"
            >
              Get directions →
            </Link>
          </div>
        </div>
      </Section>

      {/* Welcome message (written in Admin -> Settings -> Home page) */}
      {welcomeText && (
        <Section>
          <Reveal>
            <div
              className={
                welcomeImage ? "grid items-center gap-10 lg:grid-cols-[2fr_3fr]" : "mx-auto max-w-3xl"
              }
            >
              {welcomeImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={welcomeImage}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-sm border border-line object-cover"
                />
              )}
              <div>
                <h2 className="font-serif text-3xl font-bold text-forest">{welcomeTitle}</h2>
                <Markdown className="mt-4 text-ink/85">{welcomeText}</Markdown>
                {welcomeSignature && (
                  <p className="mt-2 font-serif text-lg italic text-brass-dim">{welcomeSignature}</p>
                )}
              </div>
            </div>
          </Reveal>
        </Section>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <Section tone="raised" className="!py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-brass">
              Announcements
            </span>
            <p className="text-sm text-ink/85">{announcements[0].title}</p>
            <Link
              href="/announcements"
              className="text-sm font-medium text-forest underline underline-offset-4 sm:ml-auto"
            >
              See all announcements →
            </Link>
          </div>
        </Section>
      )}

      {/* Latest sermon */}
      <Section>
        <Reveal>
        <h2 className="text-2xl font-bold text-forest">Latest Message</h2>
        {sermon ? (
          <Card className="mt-6 grid gap-6 sm:grid-cols-[200px_1fr] sm:items-center">
            <div className="aspect-video rounded-sm bg-line sm:aspect-square" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                {sermon.speaker}
                {sermon.scripture ? ` · ${sermon.scripture}` : ""}
              </p>
              <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                {sermon.title}
              </h3>
              {sermon.description && (
                <p className="mt-2 text-sm text-ink/75">{excerpt(sermon.description, 160)}</p>
              )}
              <Button href={`/sermons/${sermon.slug}`} variant="ghost" className="mt-3 px-0">
                Watch this message →
              </Button>
            </div>
          </Card>
        ) : (
          <p className="mt-4 text-ink/60">
            No sermons published yet — check back soon.
          </p>
        )}
        </Reveal>
      </Section>

      {/* Upcoming events */}
      <Section tone="raised">
        <Reveal>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-forest">Upcoming Events</h2>
          <Link href="/events" className="text-sm font-medium text-forest underline underline-offset-4">
            View all →
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                  {formatEventDateTime(event.start_at)}
                </p>
                <h3 className="mt-2 font-serif text-lg font-semibold text-ink">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink/70">
                    {excerpt(event.description, 140)}
                  </p>
                )}
                <Link
                  href={`/events/${event.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-forest underline underline-offset-4"
                >
                  Details →
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-ink/60">
            No upcoming events posted right now — check back soon.
          </p>
        )}
        </Reveal>
      </Section>

      {/* Closing CTA */}
      <Section tone="forest" className="text-center">
        <Reveal>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          New here? We&apos;d love to meet you.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-paper-raised/85">
          Find our service times, address, and what to expect on your first visit.
        </p>
        <Button
          href="/visit"
          variant="primary"
          className="mt-6 bg-brass! text-forest-deep! hover:bg-paper-raised!"
        >
          Plan Your Visit
        </Button>
        </Reveal>
      </Section>
    </>
  );
}