import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
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
    description: event.description
      ? excerpt(event.description, 155)
      : undefined,
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
        <p className="text-xs font-semibold uppercase tracking-wide text-brass">
          {formatEventDateTime(event.start_at, event.timezone)}
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold">{event.title}</h1>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SiteImage
              src={event.image_url}
              hideIfEmpty
              className="mb-6 aspect-video w-full rounded-sm"
            />

            {event.description && (
              <Markdown className="text-ink/85">
                {event.description}
              </Markdown>
            )}
          </div>

          <Card className="h-fit">
            <h2 className="font-semibold text-forest">Details</h2>

            <dl className="mt-3 space-y-3 text-sm text-ink/80">
              <div>
                <dt className="font-medium">When</dt>
                <dd>{formatEventDateTime(event.start_at, event.timezone)}</dd>
              </div>

              {location && (
                <div>
                  <dt className="font-medium">Where</dt>
                  <dd>
                    {location.name}
                    <br />
                    {location.address_line1}, {location.city}
                  </dd>
                </div>
              )}
            </dl>

            {event.registration_url && (
              <Button
                href={event.registration_url}
                variant="primary"
                className="mt-4 w-full"
              >
                Register
              </Button>
            )}
          </Card>
        </div>
      </Section>

      {sermons.length > 0 && (
        <Section tone="raised">
          <h2 className="text-2xl font-bold text-forest">Messages from this event</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <Link key={sermon.id} href={`/sermons/${sermon.slug}`} className="block">
                <Card className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                    {formatDate(sermon.sermon_date)}
                  </p>
                  <p className="mt-1 font-serif text-lg font-semibold text-ink">{sermon.title}</p>
                  <p className="mt-1 text-sm text-ink/70">
                    {sermon.speaker}
                    {sermon.scripture ? ` · ${sermon.scripture}` : ""}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}