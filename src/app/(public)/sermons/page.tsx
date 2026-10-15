import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
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
  const [lead, ...rest] = sermons;

  return (
    <>
      <Section tone="forest">
        <p className="kicker">The word</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Sermons</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">Catch up on past messages, or revisit a favorite.</p>
      </Section>

      <Section>
        {allSeries.length > 0 && (
          <nav aria-label="Sermon series" className="mb-10 flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-4">
            <Link href="/sermons" aria-current={activeSeries ? undefined : "page"} className={`nav-link text-sm ${activeSeries ? "text-ink/70" : "text-forest"}`}>
              All sermons
            </Link>
            {allSeries.map((item) => (
              <Link
                key={item.id}
                href={`/sermons?series=${item.slug}`}
                aria-current={activeSeries?.id === item.id ? "page" : undefined}
                className={`nav-link text-sm ${activeSeries?.id === item.id ? "text-forest" : "text-ink/70"}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        {activeSeries && (
          <div className="mb-10 max-w-2xl">
            <h2 className="font-serif text-3xl font-bold text-forest">{activeSeries.title}</h2>
            {activeSeries.description && (
              <p className="mt-3 whitespace-pre-line text-ink/80">{activeSeries.description}</p>
            )}
          </div>
        )}

        {lead ? (
          <>
            <Link href={`/sermons/${lead.slug}`} className="grid gap-6 border-b border-line pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <SiteImage src={lead.thumbnail_url} className="aspect-video w-full" />
              <div>
                <p className="kicker">{formatDate(lead.sermon_date)}</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold text-ink">{lead.title}</h2>
                <p className="mt-2 text-sm text-ink/70">
                  {lead.speaker}
                  {lead.scripture ? ` · ${lead.scripture}` : ""}
                </p>
                <p className="mt-4 text-sm font-medium text-forest">Watch →</p>
              </div>
            </Link>
            {rest.length > 0 && (
              <ul className="mt-2 divide-y divide-line">
                {rest.map((sermon) => (
                  <li key={sermon.id}>
                    <Link href={`/sermons/${sermon.slug}`} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline">
                      <span className="kicker">{formatDate(sermon.sermon_date)}</span>
                      <span>
                        <span className="font-serif text-xl text-ink">{sermon.title}</span>
                        <span className="mt-0.5 block text-sm text-ink/60">
                          {sermon.speaker}
                          {sermon.scripture ? ` · ${sermon.scripture}` : ""}
                        </span>
                      </span>
                      <span className="text-sm text-forest">Watch →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-ink/60">No sermons published yet — check back soon.</p>
        )}
      </Section>
    </>
  );
}