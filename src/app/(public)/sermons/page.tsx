import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getSermons } from "@/lib/data/public";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch and listen to past sermons from Lafto Mekaneyesus.",
};

export default async function SermonsPage() {
  const sermons = await getSermons();

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Sermons</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Catch up on past messages, or revisit a favorite.
        </p>
      </Section>

      <Section>
        {sermons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <Card key={sermon.id}>
                <div className="aspect-video rounded-sm bg-line" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brass">
                  {formatDate(sermon.sermon_date)}
                </p>
                <h2 className="mt-1 font-serif text-lg font-semibold text-ink">
                  {sermon.title}
                </h2>
                <p className="mt-1 text-sm text-ink/70">
                  {sermon.speaker}
                  {sermon.scripture ? ` · ${sermon.scripture}` : ""}
                </p>
                <Link
                  href={`/sermons/${sermon.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-forest underline underline-offset-4"
                >
                  Watch →
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">No sermons published yet — check back soon.</p>
        )}
      </Section>
    </>
  );
}