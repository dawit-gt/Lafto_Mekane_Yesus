import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { cleanQuery, searchSite } from "@/lib/data/search";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = cleanQuery(q);
  const results = await searchSite(query);
  const tooShort = query.length > 0 && query.length < 2;

  return (
    <>
      <Section tone="forest">
        <p className="kicker">Look up</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Search</h1>
        <form action="/search" method="get" role="search" className="mt-8 flex max-w-xl gap-3">
          <label htmlFor="site-search" className="sr-only">Search sermons, events and ministries</label>
          <input
            id="site-search"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={60}
            placeholder="Search sermons, events, ministries…"
            className="w-full rounded-[2px] border border-paper-raised/30 bg-paper-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink/50 focus-visible:outline-none"
          />
          <button type="submit" className="rounded-[2px] bg-brass px-5 py-2.5 text-sm font-semibold text-forest-deep hover:bg-paper-raised">
            Search
          </button>
        </form>
      </Section>

      <Section>
        {query.length === 0 && <p className="text-ink/60">Type a word or a name to search the whole website.</p>}
        {tooShort && <p className="text-ink/60">Please type at least 2 letters.</p>}
        {query.length >= 2 && results.length === 0 && (
          <p className="text-ink/70">
            Nothing found for &ldquo;{query}&rdquo;. Try a shorter word, or{" "}
            <Link href="/contact" className="text-forest underline underline-offset-4">ask us</Link>.
          </p>
        )}
        {results.length > 0 && (
          <>
            <p className="kicker">
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
            </p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {results.map((result) => (
                <li key={result.href}>
                  <Link href={result.href} className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr]">
                    <span className="kicker">{result.kind}</span>
                    <span>
                      <span className="font-serif text-2xl text-ink">{result.title}</span>
                      {result.snippet && (
                        <span className="mt-1 line-clamp-2 block text-sm text-ink/65">{result.snippet}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </>
  );
}