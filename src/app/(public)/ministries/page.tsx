import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { getMinistries } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Find a ministry to get involved in at Lafto Mekaneyesus.",
};

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Ministries</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          There&apos;s a place for you to serve, grow, and belong. Explore our
          ministries below.
        </p>
      </Section>

      <Section>
        {ministries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry) => (
              <Card key={ministry.id}>
                <SiteImage
                  src={ministry.image_url}
                  className="aspect-video w-full rounded-sm"
                />

                <h2 className="mt-4 font-serif text-lg font-semibold text-ink">
                  {ministry.name}
                </h2>

                <p className="mt-2 text-sm text-ink/75">
                  {ministry.summary}
                </p>

                <Link
                  href={`/ministries/${ministry.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-forest underline underline-offset-4"
                >
                  Learn more →
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-ink/60">Ministries will be listed here soon.</p>
        )}
      </Section>
    </>
  );
}