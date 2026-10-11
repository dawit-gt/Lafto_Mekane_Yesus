import { getEventBySlug, getLocationById } from "@/lib/data/public";
import { buildEventIcs } from "@/lib/utils/ics";
import { stripMarkdown } from "@/lib/utils/format";
import { siteUrl } from "@/lib/site-url";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return new Response("Event not found", { status: 404 });

  const location = await getLocationById(event.location_id);
  const eventUrl = `${siteUrl}/events/${event.slug}`;

  const body = buildEventIcs({
    id: event.id,
    title: event.title,
    description: [event.description ? stripMarkdown(event.description) : "", eventUrl]
      .filter(Boolean)
      .join("\n\n"),
    startAt: event.start_at,
    endAt: event.end_at,
    location: location
      ? [location.name, location.address_line1, location.city].filter(Boolean).join(", ")
      : null,
    url: eventUrl,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}