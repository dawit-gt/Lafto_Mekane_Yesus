import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/lib/i18n/server";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { locale, dict } = await getDictionary();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-forest focus:px-4 focus:py-2 focus:text-paper-raised"
      >
        {dict.site.skipToContent}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}