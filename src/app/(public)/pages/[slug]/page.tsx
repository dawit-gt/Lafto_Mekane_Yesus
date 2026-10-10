import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Markdown } from "@/components/ui/Markdown";
import { getPublishedPageBySlug } from "@/lib/data/public";
import { excerpt } from "@/lib/utils/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };
  return { title: page.title, description: excerpt(page.body_md, 155) };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) notFound();

  return (
    <>
      <Section tone="forest">
        <h1 className="max-w-3xl font-serif text-4xl font-bold">{page.title}</h1>
      </Section>

      <Section>
        <article className="max-w-2xl">
          <Markdown className="text-ink/85">{page.body_md}</Markdown>
        </article>
      </Section>
    </>
  );
}