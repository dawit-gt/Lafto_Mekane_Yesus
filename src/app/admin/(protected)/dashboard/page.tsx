import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getContentCounts, getNewSubmissionCounts, getRecentSubmissions } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const contentLabels: Record<string, string> = {
  events: "Events",
  sermons: "Sermons",
  ministries: "Ministries",
  stories: "Stories",
  announcements: "Announcements",
  pages: "Pages",
};

const submissionLabels: Record<string, { label: string; href: string }> = {
  contact: { label: "New Contact Messages", href: "/admin/communication?tab=contact" },
  prayer: { label: "New Prayer Requests", href: "/admin/communication?tab=prayer" },
  volunteer: { label: "New Volunteer Interest", href: "/admin/communication?tab=volunteer" },
};

export default async function AdminDashboardPage() {
  const [contentCounts, submissionCounts, recentSubmissions] = await Promise.all([
    getContentCounts(),
    getNewSubmissionCounts(),
    getRecentSubmissions(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Dashboard</h1>

      {/* New submissions — the thing that needs the fastest response */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(Object.keys(submissionLabels) as Array<keyof typeof submissionLabels>).map((key) => (
          <Link key={key} href={submissionLabels[key].href}>
            <Card className="transition-colors hover:border-brass">
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                {submissionLabels[key].label}
              </p>
              <p className="mt-2 text-3xl font-bold text-forest">
                {submissionCounts[key as keyof typeof submissionCounts]}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content overview */}
      <h2 className="mt-10 text-lg font-semibold text-ink">Content Overview</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(contentLabels) as Array<keyof typeof contentCounts>).map((key) => (
          <Card key={key}>
            <p className="font-medium text-ink">{contentLabels[key]}</p>
            <p className="mt-1 text-sm text-ink/65">
              {contentCounts[key].published} published · {contentCounts[key].draft} draft
            </p>
          </Card>
        ))}
      </div>

      {/* Recent submissions */}
      <h2 className="mt-10 text-lg font-semibold text-ink">Recent Submissions</h2>
      {recentSubmissions.length > 0 ? (
        <div className="mt-4 divide-y divide-line rounded-sm border border-line bg-paper-raised">
          {recentSubmissions.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">
                  {item.type}
                </p>
                <p className="text-sm text-ink/85">{item.summary}</p>
              </div>
              <p className="text-xs text-ink/50">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/60">No submissions yet.</p>
      )}
    </div>
  );
}