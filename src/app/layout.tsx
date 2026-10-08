import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

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

export const metadata: Metadata = {
      metadataBase: new URL(siteUrl),  title: {
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${notoSerif.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
