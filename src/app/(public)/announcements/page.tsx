import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Markdown } from "@/components/ui/Markdown";
import { getAnnouncements } from "@/lib/data/public";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Current notices from Lafto Mekaneyesus.",
};

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <Section tone="forest">
        <p className="kicker">Right now</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Announcements</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">What is happening in our church family right now.</p>
      </Section>

      <Section>
        {announcements.length > 0 ? (
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="grid gap-3 py-8 sm:grid-cols-[9rem_1fr]">
                <p className="kicker">{formatDate(announcement.publish_at.slice(0, 10))}</p>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-ink">{announcement.title}</h2>
                  <Markdown className="mt-3 text-sm text-ink/80">{announcement.body_md}</Markdown>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">There are no announcements right now.</p>
        )}
      </Section>
    </>
  );
}