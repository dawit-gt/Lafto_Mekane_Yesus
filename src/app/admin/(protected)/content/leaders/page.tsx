import type { Metadata } from "next";
import Link from "next/link";
import { getAdminLeaders } from "@/lib/data/admin-content";
import { deleteLeader } from "@/lib/actions/admin-leaders";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Leaders",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminLeadersPage() {
  const leaders = await getAdminLeaders();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Leaders</h1>
        <Link
          href="/admin/content/leaders/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + Add Leader
        </Link>
      </div>

      {leaders.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leaders.map((leader) => (
                <tr key={leader.id}>
                  <td className="px-4 py-3 text-ink/70">{leader.display_order}</td>
                  <td className="px-4 py-3 font-medium text-ink">{leader.full_name}</td>
                  <td className="px-4 py-3 text-ink/70">{leader.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[leader.status]}`}
                    >
                      {leader.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/leaders/${leader.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteLeader.bind(null, leader.id)}
                        confirmMessage={`Delete "${leader.full_name}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No leaders yet. Add the first one above.</p>
      )}
    </div>
  );
}