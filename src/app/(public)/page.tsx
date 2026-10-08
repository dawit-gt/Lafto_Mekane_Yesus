import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  getAnnouncements,
  getFeaturedStory,
  getLatestSermon,
  getSiteSettings,
  getUpcomingEvents,
} from "@/lib/data/public";
import { formatEventDateTime } from "@/lib/utils/format";

export default async function HomePage() {
  const [announcements, sermon, events, story, settings] = await Promise.all([
    getAnnouncements(),
    getLatestSermon(),
    getUpcomingEvents(3),
    getFeaturedStory(),
    getSiteSettings(),
  ]);

  const serviceTimes =
    settings?.service_times_md?.trim() ||
    "Sunday Worship — 8:00 AM & 10:30 AM\nWednesday Prayer — 6:00 PM";

  return (
    <>
      {/* Hero */}
      <Section tone="forest">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              A place to belong, a place to grow in faith.
            </h1>
            <p className="mt-5 max-w-lg text-paper-raised/85">
              Lafto Mekaneyesus is a congregation of the Ethiopian Evangelical
              Church Mekane Yesus, welcoming everyone — near or far — into
              worship, community, and service.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                href="/visit"
                variant="primary"
                className="bg-brass hover:bg-brass-dim"
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

          <div className="rounded-sm border border-paper-raised/20 bg-paper-raised/5 p-6">
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
                <p className="mt-2 text-sm text-ink/75">{sermon.description}</p>
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
      </Section>

      {/* Upcoming events */}
      <Section tone="raised">
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
                    {event.description}
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
      </Section>

      {/* Featured story */}
      {story && (
        <Section>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="aspect-video rounded-sm bg-line" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                Story
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
                {story.title}
              </h2>
              <p className="prose-body mt-3 text-ink/80">
                {story.body_md.slice(0, 220)}
                {story.body_md.length > 220 ? "…" : ""}
              </p>
              <Button href={`/stories/${story.slug}`} variant="ghost" className="mt-2 px-0">
                Read the full story →
              </Button>
            </div>
          </div>
        </Section>
      )}

      {/* Closing CTA */}
      <Section tone="forest" className="text-center">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          New here? We&apos;d love to meet you.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-paper-raised/85">
          Find our service times, address, and what to expect on your first visit.
        </p>
        <Button
          href="/visit"
          variant="primary"
          className="mt-6 bg-brass hover:bg-brass-dim"
        >
          Plan Your Visit
        </Button>
      </Section>
    </>
  );
}