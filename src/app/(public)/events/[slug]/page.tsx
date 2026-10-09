import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { getEventBySlug, getLocationById } from "@/lib/data/public";
import { formatEventDateTime } from "@/lib/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event Not Found" };

  return { title: event.title, description: event.description ?? undefined };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const location = await getLocationById(event.location_id);

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
              <p className="prose-body whitespace-pre-line text-ink/85">
                {event.description}
              </p>
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
    </>
  );
}