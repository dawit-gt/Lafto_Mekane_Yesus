import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { getPublicFamily } from "@/lib/data/public-family";

export const metadata: Metadata = {
  title: "Our Church Family",
  description: "Members of Lafto Mekaneyesus who chose to be shown here.",
  // Names and photos of real people: keep this page out of search engines.
  robots: { index: false, follow: false },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function FamilyPage() {
  const family = await getPublicFamily();

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Our Church Family</h1>
        <p className="mt-4 max-w-2xl text-paper-raised/85">
          Some of the people who worship and serve together at Lafto Mekaneyesus. Everyone shown
          here chose to be listed.
        </p>
      </Section>

      <Section>
        {family.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {family.map((person, index) => (
              <li key={`${person.name}-${index}`} className="text-center">
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    loading="lazy"
                    className="mx-auto h-24 w-24 rounded-full border border-line object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-forest/10 font-serif text-xl font-semibold text-forest"
                  >
                    {initials(person.name)}
                  </div>
                )}
                <p className="mt-3 text-sm font-medium text-ink">{person.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink/60">Nobody is shown here yet.</p>
        )}
      </Section>
    </>
  );
}