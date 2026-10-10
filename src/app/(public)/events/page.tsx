import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { getEvents } from "@/lib/data/public";
import { excerpt, formatEventDateTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at Lafto Mekaneyesus.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Events</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Join us for worship, fellowship, and special gatherings throughout
          the year.
        </p>
      </Section>

      <Section>
        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id}>
                <SiteImage
                  src={event.image_url}
                  hideIfEmpty
                  className="mb-4 aspect-video w-full rounded-sm"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                  {formatEventDateTime(event.start_at)}
                </p>

                <h2 className="mt-2 font-serif text-lg font-semibold text-ink">
                  {event.title}
                </h2>

                {event.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                    {excerpt(event.description, 200)}
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
          <p className="text-ink/60">
            No events posted right now — check back soon.
          </p>
        )}
      </Section>
    </>
  );
}