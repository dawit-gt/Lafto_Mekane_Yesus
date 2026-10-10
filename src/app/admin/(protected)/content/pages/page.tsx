import type { Metadata } from "next";
import Link from "next/link";
import { getAdminPages } from "@/lib/data/admin-content";
import { deletePage } from "@/lib/actions/admin-pages";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Pages",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminPagesPage() {
  const pages = await getAdminPages();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Pages</h1>
        <Link
          href="/admin/content/pages/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + New Page
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-4 py-3 font-medium text-ink">{page.title}</td>
                  <td className="px-4 py-3 text-ink/70">{page.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[page.status]}`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      {page.status === "published" && (
                        <Link
                          href={`/pages/${page.slug}`}
                          target="_blank"
                          className="text-sm font-medium text-forest underline underline-offset-4"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/content/pages/${page.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deletePage.bind(null, page.id)}
                        confirmMessage={`Delete "${page.title}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No pages yet. Create the first one above.</p>
      )}
    </div>
  );
}