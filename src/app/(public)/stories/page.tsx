import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { getStories } from "@/lib/data/public";
import { excerpt, formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Testimonies and highlights from the Lafto Mekaneyesus community.",
};

const categoryLabels: Record<string, string> = {
  testimony: "Testimony",
  ministry: "Ministry",
  community: "Community",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Stories</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          Testimonies and highlights from across our congregation and ministries.
        </p>
      </Section>

      <Section>
        {stories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id}>
                <SiteImage
                  src={story.image_url}
                  hideIfEmpty
                  className="mb-4 aspect-video w-full rounded-sm"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                  {story.category ? `${categoryLabels[story.category]} · ` : ""}
                  {formatDate(story.created_at.slice(0, 10))}
                </p>

                <h2 className="mt-2 font-serif text-lg font-semibold text-ink">
                  {story.title}
                </h2>

                <p className="mt-2 text-sm text-ink/70">
                  {excerpt(story.body_md)}
                </p>

                <Link
                  href={`/stories/${story.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-forest underline underline-offset-4"
                >
                  Read the story →
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">
            No stories published yet. Check back soon.
          </p>
        )}
      </Section>
    </>
  );
}