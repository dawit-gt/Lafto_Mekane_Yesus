import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getStoryBySlug } from "@/lib/data/public";
import { excerpt, formatDate } from "@/lib/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryLabels: Record<string, string> = {
  testimony: "Testimony",
  ministry: "Ministry",
  community: "Community",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found" };
  return { title: story.title, description: excerpt(story.body_md, 155) };
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  return (
    <>
      <Section tone="forest">
        <p className="text-xs font-semibold uppercase tracking-wide text-brass">
          {story.category ? `${categoryLabels[story.category]} · ` : ""}
          {formatDate(story.created_at.slice(0, 10))}
        </p>
        <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold">{story.title}</h1>
      </Section>

      <Section>
        <article className="max-w-2xl">
          <p className="whitespace-pre-line leading-7 text-ink/85">{story.body_md}</p>
          <Button href="/stories" variant="ghost" className="mt-8 px-0">
            ← All stories
          </Button>
        </article>
      </Section>
    </>
  );
}