import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSermons } from "@/lib/data/admin-content";
import { deleteSermon } from "@/lib/actions/admin-sermons";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Sermons",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminSermonsPage() {
  const sermons = await getAdminSermons();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Sermons</h1>
        <Link
          href="/admin/content/sermons/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + New Sermon
        </Link>
      </div>

      {sermons.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Speaker</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sermons.map((sermon) => (
                <tr key={sermon.id}>
                  <td className="px-4 py-3 font-medium text-ink">{sermon.title}</td>
                  <td className="px-4 py-3 text-ink/70">{sermon.speaker}</td>
                  <td className="px-4 py-3 text-ink/70">{formatDate(sermon.sermon_date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[sermon.status]}`}
                    >
                      {sermon.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/sermons/${sermon.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteSermon.bind(null, sermon.id)}
                        confirmMessage={`Delete "${sermon.title}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No sermons yet. Create the first one above.</p>
      )}
    </div>
  );
}