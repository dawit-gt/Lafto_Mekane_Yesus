import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { getPublicFamily } from "@/lib/data/public-family";

export const metadata: Metadata = {
  title: "Members",
  description: "Members of Lafto Mekaneyesus who chose to be shown here.",
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
        <p className="kicker">The congregation</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Our Members</h1>
        <p className="mt-5 max-w-2xl text-paper-raised/85">
          The people who worship and serve together at Lafto Mekaneyesus. Everyone shown here chose to be listed.
        </p>
      </Section>

      <Section>
        {everyone.length > 0 && (
          <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-ink/60">
              {query
                ? `${members.length} of ${everyone.length} members match “${query}”`
                : `${everyone.length} ${everyone.length === 1 ? "member" : "members"}`}
            </p>
            <form action="/members" method="get" role="search" className="flex w-full max-w-sm gap-2">
              <label htmlFor="member-search" className="sr-only">Find a member by name</label>
              <input
                id="member-search"
                name="q"
                type="search"
                defaultValue={query}
                maxLength={60}
                placeholder="Find a member by name…"
                className="w-full rounded-[2px] border border-line bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink/50 focus-visible:outline-none"
              />
              <button type="submit" className="rounded-[2px] bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep">
                Search
              </button>
            </form>
          </div>
        )}

        {members.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((person, index) => (
              <li key={`${person.name}-${index}`} className={index % 5 === 2 ? "lg:mt-8" : ""}>
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div aria-hidden="true" className="flex aspect-[4/5] w-full items-center justify-center bg-forest/10 font-serif text-3xl text-forest">
                    {initials(person.name)}
                  </div>
                )}
                <p className="mt-3 font-serif text-lg leading-tight text-ink">{person.name}</p>
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