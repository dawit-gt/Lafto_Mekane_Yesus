import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { getSeriesWithSermons, getSermons } from "@/lib/data/public";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch and listen to past sermons from Lafto Mekaneyesus.",
};

interface Props {
  searchParams: Promise<{ series?: string }>;
}

export default async function SermonsPage({ searchParams }: Props) {
  const { series: seriesSlug } = await searchParams;
  const allSeries = await getSeriesWithSermons();
  const activeSeries = allSeries.find((item) => item.slug === seriesSlug) ?? null;
  const sermons = await getSermons(48, activeSeries?.id);

  const chipBase = "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
  const chipOn = "border-forest bg-forest text-paper-raised";
  const chipOff = "border-line bg-paper-raised text-ink/80 hover:border-forest hover:text-forest";

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Sermons</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Catch up on past messages, or revisit a favorite.
        </p>
      </Section>

      <Section>
        {allSeries.length > 0 && (
          <nav aria-label="Sermon series" className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/sermons"
              aria-current={activeSeries ? undefined : "page"}
              className={`${chipBase} ${activeSeries ? chipOff : chipOn}`}
            >
              All sermons
            </Link>
            {allSeries.map((item) => (
              <Link
                key={item.id}
                href={`/sermons?series=${item.slug}`}
                aria-current={activeSeries?.id === item.id ? "page" : undefined}
                className={`${chipBase} ${activeSeries?.id === item.id ? chipOn : chipOff}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        {activeSeries && (
          <div className="mb-8 max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-forest">{activeSeries.title}</h2>
            {activeSeries.description && (
              <p className="mt-2 whitespace-pre-line text-ink/80">{activeSeries.description}</p>
            )}
          </div>
        )}

        {sermons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <Card key={sermon.id}>
                <SiteImage src={sermon.thumbnail_url} className="aspect-video w-full rounded-sm" />
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