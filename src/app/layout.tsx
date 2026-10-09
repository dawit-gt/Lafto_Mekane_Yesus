import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans, Noto_Serif_Ethiopic, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";
import { getLocale } from "@/lib/i18n/server";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lafto Mekaneyesus | EECMY",
    template: "%s | Lafto Mekaneyesus",
  },
  description:
    "Lafto Mekaneyesus, a congregation of the Ethiopian Evangelical Church Mekane Yesus. Worship times, sermons, ministries, events and how to visit.",
  openGraph: {
    type: "website",
    siteName: "Lafto Mekaneyesus",
  },
};

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