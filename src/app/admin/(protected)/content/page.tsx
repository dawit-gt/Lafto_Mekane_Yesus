import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Content",
  robots: { index: false, follow: false },
};

const sections = [
  { label: "Events", href: "/admin/content/events", blurb: "Services, gatherings, and special days." },
  { label: "Sermons", href: "/admin/content/sermons", blurb: "Messages with video or audio." },
  { label: "Ministries", href: "/admin/content/ministries", blurb: "Groups people can join or serve in." },
  { label: "Stories", href: "/admin/content/stories", blurb: "Testimonies and community highlights." },
  { label: "Announcements", href: "/admin/content/announcements", blurb: "Time-limited notices." },
  { label: "Pages", href: "/admin/content/pages", blurb: "General written pages." },
  { label: "Leaders", href: "/admin/content/leaders", blurb: "People shown on the About page." },
  { label: "Locations", href: "/admin/content/locations", blurb: "Addresses used for services and events." },
  { label: "FAQs", href: "/admin/content/faqs", blurb: "Common questions shown on the Visit page." },
] as const;

export default function AdminContentHubPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Content</h1>
      <p className="mt-2 text-sm text-ink/70">Choose what you want to manage.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:border-brass">
              <p className="font-serif text-lg font-semibold text-ink">{section.label}</p>
              <p className="mt-1 text-sm text-ink/65">{section.blurb}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}