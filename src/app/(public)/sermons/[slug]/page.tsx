import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/ui/Markdown";
import { getSermonBySlug } from "@/lib/data/public";
import { excerpt, formatDate } from "@/lib/utils/format";
import { getYouTubeEmbedUrl } from "@/lib/utils/video";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) return { title: "Sermon Not Found" };

  return {
    title: sermon.title,
    description: sermon.description
      ? excerpt(sermon.description, 155)
      : undefined,
  };
}

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) notFound();

  const embedUrl = getYouTubeEmbedUrl(sermon.video_url);

  return (
    <>
      <Section tone="forest">
        <p className="text-xs font-semibold uppercase tracking-wide text-brass">
          {formatDate(sermon.sermon_date)}
          {sermon.scripture ? ` · ${sermon.scripture}` : ""}
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold">{sermon.title}</h1>

        <p className="mt-2 text-paper-raised/85">{sermon.speaker}</p>
      </Section>

      <Section>
        {embedUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-sm">
            <iframe
              src={embedUrl}
              title={sermon.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : sermon.video_url ? (
          <Button href={sermon.video_url} variant="primary">
            Watch this message
          </Button>
        ) : sermon.audio_url ? (
          <audio controls className="w-full">
            <source src={sermon.audio_url} />
          </audio>
        ) : (
          <p className="text-ink/60">
            Media for this sermon isn&apos;t available yet.
          </p>
        )}

        {sermon.description && (
          <Markdown className="mt-6 text-ink/85">
            {sermon.description}
          </Markdown>
        )}
      </Section>
    </>
  );
}