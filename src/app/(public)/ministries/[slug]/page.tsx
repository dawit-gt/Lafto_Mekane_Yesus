import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
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
        <h1 className="font-serif text-4xl font-bold">{ministry.name}</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          {ministry.summary}
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SiteImage
              src={ministry.image_url}
              hideIfEmpty
              className="mb-6 aspect-video w-full rounded-sm"
            />

            {ministry.description_md && (
              <p className="prose-body whitespace-pre-line text-ink/85">
                {ministry.description_md}
              </p>
            )}
          </div>

          <Card className="h-fit">
            <h2 className="font-semibold text-forest">Get Involved</h2>

            {ministry.meeting_info && (
              <p className="mt-3 text-sm text-ink/80">
                <span className="font-medium">When/Where: </span>
                {ministry.meeting_info}
              </p>
            )}

            {ministry.contact_name && (
              <p className="mt-2 text-sm text-ink/80">
                <span className="font-medium">Contact: </span>
                {ministry.contact_name}
              </p>
            )}

            {(ministry.contact_email || ministry.contact_phone) && (
              <div className="mt-4 flex flex-col gap-2">
                {ministry.contact_email && (
                  <Button
                    href={`mailto:${ministry.contact_email}`}
                    variant="secondary"
                  >
                    Email
                  </Button>
                )}

                {ministry.contact_phone && (
                  <Button
                    href={`tel:${ministry.contact_phone}`}
                    variant="secondary"
                  >
                    Call
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </Section>
    </>
  );
}