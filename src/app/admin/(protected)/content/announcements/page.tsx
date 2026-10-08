import type { Metadata } from "next";
import Link from "next/link";
import { getAdminAnnouncements } from "@/lib/data/admin-content";
import { deleteAnnouncement } from "@/lib/actions/admin-announcements";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatEventDateTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Announcements",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAdminAnnouncements();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Announcements</h1>
        <Link
          href="/admin/content/announcements/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + New Announcement
        </Link>
      </div>

      {announcements.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Publishes</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td className="px-4 py-3 font-medium text-ink">{announcement.title}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {formatEventDateTime(announcement.publish_at)}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {announcement.expires_at ? formatEventDateTime(announcement.expires_at) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[announcement.status]}`}
                    >
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/announcements/${announcement.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteAnnouncement.bind(null, announcement.id)}
                        confirmMessage={`Delete "${announcement.title}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No announcements yet. Create the first one above.</p>
      )}
    </div>
  );
}