import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

interface LegalPageProps {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, intro, updated, children }: LegalPageProps) {
  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">{title}</h1>
        <p className="mt-4 max-w-2xl text-paper-raised/85">{intro}</p>
        <p className="mt-3 text-xs text-paper-raised/60">Last updated: {updated}</p>
      </Section>

      <Section>
        <div className="max-w-2xl text-ink/85 [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-4 [&_h2:first-child]:mt-0 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forest [&_p]:mt-3 [&_p]:leading-7 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:leading-7">
          {children}
        </div>
      </Section>
    </>
  );
}