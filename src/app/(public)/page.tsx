import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Markdown } from "@/components/ui/Markdown";
import { SiteImage } from "@/components/ui/SiteImage";
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

  const [leadEvent, ...restEvents] = events;

  return (
    <>
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
            <div aria-hidden="true" className="absolute inset-0 bg-forest-deep/80" />
          </>
        ) : (
          <CrossMark
            animated
            color="#ffffff"
            inner="#0059b5"
            className="pointer-events-none absolute -right-24 top-6 hidden h-[120%] opacity-[0.08] lg:block"
          />
        )}
        <div className="relative">
          <p className="kicker">EECMY · Lafto Mekaneyesus</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] sm:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-paper-raised/85">
            {heroText}
          </p>
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <Button href="/visit" variant="brass">Plan a Visit</Button>
            <Button
              href="/sermons"
              variant="secondary"
              className="border-paper-raised/50 text-paper-raised hover:bg-paper-raised hover:text-forest"
            >
              Watch Sermons
            </Button>
          </div>

          <div className="relative mt-14 max-w-sm border border-paper-raised/20 bg-forest-deep/40 p-5 backdrop-blur-sm lg:ml-auto lg:-mt-6">
            <div className="dual-rule absolute left-0 right-0 top-0" />
            <p className="kicker">This Week</p>
            <p className="mt-3 whitespace-pre-line font-serif text-xl leading-snug">{serviceTimes}</p>
            <Link href="/visit" className="mt-4 inline-block text-sm text-brass underline underline-offset-4">
              Get directions →
            </Link>
          </div>
        </div>
      </Section>

      {announcements.length > 0 && (
        <div className="bg-paper-raised">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="kicker shrink-0">Announcements</span>
            <p className="min-w-0 flex-1 truncate text-sm text-ink/85">{announcements[0].title}</p>
            <Link href="/announcements" className="shrink-0 text-sm text-forest underline underline-offset-4">
              All notices →
            </Link>
          </div>
          <div className="dual-rule" />
        </div>
      )}

      {welcomeText && (
        <Section>
          <Reveal>
            <div className={welcomeImage ? "grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]" : "max-w-2xl"}>
              {welcomeImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={welcomeImage}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover lg:-mt-8 lg:rotate-[-1.25deg]"
                />
              )}
              <div className={welcomeImage ? "lg:pt-10" : ""}>
                <p className="kicker">From the church</p>
                <h2 className="mt-2 font-serif text-4xl font-bold text-forest">{welcomeTitle}</h2>
                <div className="dual-rule mt-4 max-w-[8rem]" />
                <Markdown className="mt-5 text-ink/85">{welcomeText}</Markdown>
                {welcomeSignature && (
                  <p className="mt-4 font-serif text-lg italic text-brass-dim">{welcomeSignature}</p>
                )}
              </div>
            </div>
          </Reveal>
        </Section>
      )}

      <Section tone="raised">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="kicker">Listen</p>
              <h2 className="mt-2 font-serif text-4xl font-bold text-forest">Latest Message</h2>
            </div>
            {sermon ? (
              <article>
                <SiteImage src={sermon.thumbnail_url} hideIfEmpty className="mb-4 aspect-video w-full" />
                <p className="kicker">
                  {sermon.speaker}
                  {sermon.scripture ? ` · ${sermon.scripture}` : ""}
                </p>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-ink">{sermon.title}</h3>
                {sermon.description && (
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink/75">
                    {excerpt(sermon.description, 180)}
                  </p>
                )}
                <Button href={`/sermons/${sermon.slug}`} variant="ghost" className="mt-4">
                  Watch this message →
                </Button>
              </article>
            ) : (
              <p className="text-ink/60">No sermons published yet — check back soon.</p>
            )}
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="kicker">Gather</p>
              <h2 className="mt-2 font-serif text-4xl font-bold text-forest">Upcoming</h2>
            </div>
            <Link href="/events" className="text-sm text-forest underline underline-offset-4">
              View all →
            </Link>
          </div>
          {leadEvent ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
              <Link href={`/events/${leadEvent.slug}`} className="folio block">
                <p className="kicker">{formatEventDateTime(leadEvent.start_at)}</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold text-ink">{leadEvent.title}</h3>
                {leadEvent.description && (
                  <p className="mt-3 max-w-prose text-sm text-ink/70">{excerpt(leadEvent.description, 160)}</p>
                )}
                <p className="mt-5 text-sm font-medium text-forest">Details →</p>
              </Link>
              <div className="divide-y divide-line border-t border-line">
                {restEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`} className="block py-4">
                    <p className="kicker">{formatEventDateTime(event.start_at)}</p>
                    <p className="mt-1 font-serif text-xl text-ink">{event.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-ink/60">No upcoming events posted right now — check back soon.</p>
          )}
        </Reveal>
      </Section>

      <Section tone="forest">
        <Reveal>
          <div className="max-w-xl">
            <p className="kicker">First time</p>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-tight">
              New here? We&apos;d love to meet you.
            </h2>
            <p className="mt-4 text-paper-raised/80">
              Find our service times, address, and what to expect on your first visit.
            </p>
            <Button href="/visit" variant="brass" className="mt-8">
              Plan Your Visit
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}