import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMinistries } from "@/lib/data/admin-content";
import { deleteMinistry } from "@/lib/actions/admin-ministries";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Ministries",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminMinistriesPage() {
  const ministries = await getAdminMinistries();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Ministries</h1>
        <Link
          href="/admin/content/ministries/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + New Ministry
        </Link>
      </div>

      {ministries.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ministries.map((ministry) => (
                <tr key={ministry.id}>
                  <td className="px-4 py-3 font-medium text-ink">{ministry.name}</td>
                  <td className="px-4 py-3 text-ink/70">
                    <span className="line-clamp-1">{ministry.summary}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[ministry.status]}`}
                    >
                      {ministry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/ministries/${ministry.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteMinistry.bind(null, ministry.id)}
                        confirmMessage={`Delete "${ministry.name}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No ministries yet. Create the first one above.</p>
      )}
    </div>
  );
}