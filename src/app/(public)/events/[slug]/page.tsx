import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { Markdown } from "@/components/ui/Markdown";
import { getEventBySlug, getEventSermons, getLocationById } from "@/lib/data/public";
import { excerpt, formatDate, formatEventDateTime } from "@/lib/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description ? excerpt(event.description, 155) : undefined,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const [location, sermons] = await Promise.all([
    getLocationById(event.location_id),
    getEventSermons(event.id),
  ]);

  return (
    <>
      <Section tone="forest">
        <p className="kicker">{formatEventDateTime(event.start_at, event.timezone)}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold">{event.title}</h1>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr] lg:items-start">
          <div>
            <SiteImage src={event.image_url} hideIfEmpty className="mb-8 aspect-[16/10] w-full" />
            {event.description && <Markdown className="text-ink/85">{event.description}</Markdown>}
          </div>
          <aside className="folio lg:sticky lg:top-24">
            <p className="kicker">Details</p>
            <dl className="mt-4 space-y-4 text-sm text-ink/80">
              <div>
                <dt className="kicker">When</dt>
                <dd className="mt-1 font-serif text-lg text-ink">{formatEventDateTime(event.start_at, event.timezone)}</dd>
              </div>
              {location && (
                <div>
                  <dt className="kicker">Where</dt>
                  <dd className="mt-1">
                    {location.name}
                    <br />
                    {location.address_line1}, {location.city}
                  </dd>
                </div>
              )}
            </dl>
            <Button href={`/events/${event.slug}/calendar.ics`} variant="secondary" className="mt-6 w-full">
              Add to calendar
            </Button>
            {event.registration_url && (
              <Button href={event.registration_url} variant="primary" className="mt-3 w-full">
                Register
              </Button>
            )}
          </aside>
        </div>
      </Section>

      {sermons.length > 0 && (
        <Section tone="raised">
          <h2 className="font-serif text-3xl font-bold text-forest">Messages from this event</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {sermons.map((sermon) => (
              <li key={sermon.id}>
                <Link href={`/sermons/${sermon.slug}`} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]">
                  <span className="kicker">{formatDate(sermon.sermon_date)}</span>
                  <span>
                    <span className="font-serif text-xl text-ink">{sermon.title}</span>
                    <span className="mt-0.5 block text-sm text-ink/65">
                      {sermon.speaker}
                      {sermon.scripture ? ` · ${sermon.scripture}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}