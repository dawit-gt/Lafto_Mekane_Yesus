import type { Metadata } from "next";
import {
  Noto_Serif,
  Noto_Sans,
  Noto_Serif_Ethiopic,
  Noto_Sans_Ethiopic,
} from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
import { getLocale } from "@/lib/i18n/server";
import { getSiteSettings } from "@/lib/data/public";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  variable: "--font-noto-serif-ethiopic",
  subsets: ["ethiopic"],
  display: "swap",
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-sans-ethiopic",
  subsets: ["ethiopic"],
  display: "swap",
});

const fallbackTitle = "Lafto Mekaneyesus | EECMY";

const fallbackDescription =
  "Lafto Mekaneyesus, a congregation of the Ethiopian Evangelical Church Mekane Yesus. Worship times, sermons, ministries, events and how to visit.";

// The home page title and the description used on pages without their own
// come from Admin -> Settings. If they are empty, the texts above are used.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = settings?.seo_default_title?.trim() || fallbackTitle;
  const description =
    settings?.seo_default_description?.trim() || fallbackDescription;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | Lafto Mekaneyesus",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "Lafto Mekaneyesus",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${notoSerif.variable} ${notoSans.variable} ${notoSerifEthiopic.variable} ${notoSansEthiopic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}