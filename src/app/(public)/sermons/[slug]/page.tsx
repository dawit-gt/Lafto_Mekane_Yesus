import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Markdown } from "@/components/ui/Markdown";
import { Button } from "@/components/ui/Button";
import { getSeriesById, getSermonBySlug, getSermons } from "@/lib/data/public";
import { excerpt, formatDate } from "@/lib/utils/format";
import { getYouTubeEmbedUrl } from "@/lib/utils/video";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) return { title: "Sermon Not Found" };
  return { title: sermon.title, description: sermon.description ? excerpt(sermon.description, 155) : undefined };
}

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);
  if (!sermon) notFound();

  const embedUrl = getYouTubeEmbedUrl(sermon.video_url);
  const series = await getSeriesById(sermon.series_id);
  const moreInSeries = series
    ? (await getSermons(12, series.id)).filter((item) => item.id !== sermon.id).slice(0, 4)
    : [];

  return (
    <>
      <Section tone="forest">
        <p className="kicker">
          {formatDate(sermon.sermon_date)}
          {sermon.scripture ? ` · ${sermon.scripture}` : ""}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold">{sermon.title}</h1>
        <p className="mt-3 text-paper-raised/85">{sermon.speaker}</p>
        {series && (
          <Link href={`/sermons?series=${series.slug}`} className="mt-6 inline-block text-sm text-brass underline underline-offset-4">
            Series: {series.title} →
          </Link>
        )}
      </Section>

      <Section>
        {embedUrl ? (
          <div className="aspect-video w-full overflow-hidden border border-line">
            <iframe
              src={embedUrl}
              title={sermon.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : sermon.video_url ? (
          <Button href={sermon.video_url} variant="primary">Watch this message</Button>
        ) : sermon.audio_url ? (
          <audio controls className="w-full">
            <source src={sermon.audio_url} />
          </audio>
        ) : (
          <p className="text-ink/60">Media for this sermon isn&apos;t available yet.</p>
        )}
        {sermon.description && <Markdown className="mt-8 max-w-2xl text-ink/85">{sermon.description}</Markdown>}
      </Section>

      {series && moreInSeries.length > 0 && (
        <Section tone="raised">
          <h2 className="font-serif text-3xl font-bold text-forest">More from {series.title}</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {moreInSeries.map((item) => (
              <li key={item.id}>
                <Link href={`/sermons/${item.slug}`} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]">
                  <span className="kicker">{formatDate(item.sermon_date)}</span>
                  <span>
                    <span className="font-serif text-xl text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-sm text-ink/65">{item.speaker}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Button href={`/sermons?series=${series.slug}`} variant="ghost" className="mt-6">
            See the whole series →
          </Button>
        </Section>
      )}
    </>
  );
}