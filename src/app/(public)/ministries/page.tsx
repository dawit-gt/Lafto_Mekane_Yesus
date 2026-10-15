import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
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
        <p className="kicker">Serve</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Ministries</h1>
        <p className="mt-5 max-w-xl text-paper-raised/85">
          There&apos;s a place for you to serve, grow, and belong.
        </p>
      </Section>

      <Section>
        {ministries.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">
            {ministries.map((ministry, index) => (
              <li key={ministry.id}>
                <Link
                  href={`/ministries/${ministry.slug}`}
                  className="grid gap-6 py-8 sm:grid-cols-[11rem_1fr] sm:items-center"
                >
                  <SiteImage
                    src={ministry.image_url}
                    className={`aspect-[5/4] w-full ${index % 2 ? "sm:translate-y-3" : ""}`}
                  />
                  <div>
                    <p className="kicker">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-1 font-serif text-3xl font-semibold text-ink">{ministry.name}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/75">{ministry.summary}</p>
                    <p className="mt-3 text-sm font-medium text-forest">Learn more →</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink/60">Ministries will be listed here soon.</p>
        )}
      </Section>
    </>
  );
}