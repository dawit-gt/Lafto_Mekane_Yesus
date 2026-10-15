import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { Markdown } from "@/components/ui/Markdown";
import { getMinistryBySlug } from "@/lib/data/public";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ministry = await getMinistryBySlug(slug);
  if (!ministry) return { title: "Ministry Not Found" };
  return { title: ministry.name, description: ministry.summary };
}

export default async function MinistryDetailPage({ params }: Props) {
  const { slug } = await params;
  const ministry = await getMinistryBySlug(slug);
  if (!ministry) notFound();

  return (
    <>
      <Section tone="forest">
        <p className="kicker">Ministry</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold">{ministry.name}</h1>
        <p className="mt-5 max-w-xl text-lg text-paper-raised/85">{ministry.summary}</p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr] lg:items-start">
          <div>
            <SiteImage src={ministry.image_url} hideIfEmpty className="mb-8 aspect-[16/10] w-full" />
            {ministry.description_md && <Markdown className="text-ink/85">{ministry.description_md}</Markdown>}
          </div>
          <aside className="folio lg:sticky lg:top-24">
            <p className="kicker">Join</p>
            <h2 className="mt-2 font-serif text-2xl text-forest">Get Involved</h2>
            {ministry.meeting_info && (
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{ministry.meeting_info}</p>
            )}
            {ministry.contact_name && (
              <p className="mt-3 text-sm text-ink/80">
                <span className="font-medium">Contact: </span>
                {ministry.contact_name}
              </p>
            )}
            {(ministry.contact_email || ministry.contact_phone) && (
              <div className="mt-5 flex flex-col items-start gap-3">
                {ministry.contact_email && (
                  <Button href={`mailto:${ministry.contact_email}`} variant="secondary">Email</Button>
                )}
                {ministry.contact_phone && (
                  <Button href={`tel:${ministry.contact_phone}`} variant="ghost">
                    Call {ministry.contact_phone}
                  </Button>
                )}
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}