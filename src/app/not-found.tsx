import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { locale, dict } = await getDictionary();

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} dict={dict} />

      <main id="main-content" className="flex-1">
        <Section>
          <div className="mx-auto max-w-lg text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-brass">
              Error 404
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-forest">
              We could not find that page
            </h1>

            <p className="mt-3 text-ink/70">
              The link may be old, or the page may have moved. These pages might
              help:
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/" variant="primary">
                Go to the homepage
              </Button>

              <Button href="/visit" variant="secondary">
                Plan a visit
              </Button>

              <Button href="/contact" variant="secondary">
                Contact us
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}