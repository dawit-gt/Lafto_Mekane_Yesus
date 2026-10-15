import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { getPublicFamily } from "@/lib/data/public-family";

export const metadata: Metadata = {
  title: "Members",
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

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function MembersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim().slice(0, 60);
  const everyone = await getPublicFamily();
  const needle = query.toLocaleLowerCase();
  const members = needle
    ? everyone.filter((m) => m.name.toLocaleLowerCase().includes(needle))
    : everyone;

  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Our Members</h1>
        <p className="mt-4 max-w-2xl text-paper-raised/85">
          The people who worship and serve together at Lafto Mekaneyesus. Everyone shown here
          chose to be listed.
        </p>
      </Section>

      <Section>
        {everyone.length > 0 && (
          <form action="/members" method="get" role="search" className="flex max-w-md gap-3">
            <label htmlFor="member-search" className="sr-only">
              Find a member by name
            </label>
            <input
              id="member-search"
              name="q"
              type="search"
              defaultValue={query}
              maxLength={60}
              placeholder="Find a member by name…"
              className="w-full rounded-sm border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink/50 focus-visible:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-paper-raised transition-colors hover:bg-forest-deep"
            >
              Search
            </button>
          </form>
        )}

        {everyone.length > 0 && (
          <p className="mt-4 text-sm text-ink/60">
            {query
              ? `${members.length} of ${everyone.length} members match “${query}”`
              : `${everyone.length} ${everyone.length === 1 ? "member" : "members"}`}
          </p>
        )}

        {members.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {members.map((person, index) => (
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
          <p className="mt-8 text-ink/60">
            {query ? "No members match that name." : "Nobody is shown here yet."}
          </p>
        )}
      </Section>
    </>
  );
}