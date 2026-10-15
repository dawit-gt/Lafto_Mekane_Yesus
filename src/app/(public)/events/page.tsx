import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SiteImage } from "@/components/ui/SiteImage";
import { getEvents } from "@/lib/data/public";
import { excerpt, formatEventDateTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at Lafto Mekaneyesus.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const [lead, ...rest] = events;

  return (
    <>
      <Section tone="forest">
        <p className="kicker">The calendar</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Events</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">
          Join us for worship, fellowship, and special gatherings throughout the year.
        </p>
      </Section>

      <Section>
        {lead ? (
          <>
            <Link href={`/events/${lead.slug}`} className="grid gap-6 border-b border-line pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <SiteImage src={lead.image_url} hideIfEmpty className="aspect-[16/10] w-full" />
              <div>
                <p className="kicker">{formatEventDateTime(lead.start_at)}</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">{lead.title}</h2>
                {lead.description && (
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{excerpt(lead.description, 200)}</p>
                )}
                <p className="mt-4 text-sm font-medium text-forest">Details →</p>
              </div>
            </Link>
            {rest.length > 0 && (
              <ul className="divide-y divide-line">
                {rest.map((event) => (
                  <li key={event.id}>
                    <Link href={`/events/${event.slug}`} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:items-baseline">
                      <span className="kicker">{formatEventDateTime(event.start_at)}</span>
                      <span>
                        <span className="font-serif text-2xl text-ink">{event.title}</span>
                        {event.description && (
                          <span className="mt-1 line-clamp-2 block text-sm text-ink/65">
                            {excerpt(event.description, 140)}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-ink/60">No events posted right now — check back soon.</p>
        )}
      </Section>
    </>
  );
}