import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
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
        <h1 className="font-serif text-4xl font-bold">Announcements</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          What is happening in our church family right now.
        </p>
      </Section>

      <Section>
        {announcements.length > 0 ? (
          <div className="max-w-2xl space-y-5">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                  {formatDate(announcement.publish_at.slice(0, 10))}
                </p>
                <h2 className="mt-1 font-serif text-lg font-semibold text-ink">
                  {announcement.title}
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink/80">
                  {announcement.body_md}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">There are no announcements right now.</p>
        )}
      </Section>
    </>
  );
}