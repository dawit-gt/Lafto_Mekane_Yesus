import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSeries } from "@/lib/data/admin-content";
import { deleteSeries } from "@/lib/actions/admin-series";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Sermon Series",
  robots: { index: false, follow: false },
};

export default async function AdminSeriesPage() {
  const series = await getAdminSeries();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Sermon Series</h1>
        <Link
          href="/admin/content/series/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + New Series
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        A series groups sermons, for example a book of the Bible. After creating one, choose it
        in the &quot;Series&quot; box when you add or edit a sermon.
      </p>

      {series.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {series.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-ink">{item.title}</td>
                  <td className="px-4 py-3 text-ink/70">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/sermons?series=${item.slug}`}
                        target="_blank"
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/content/series/${item.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteSeries.bind(null, item.id)}
                        confirmMessage={`Delete the series "${item.title}"? Its sermons are kept, they just won't belong to a series. This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No series yet. Create the first one above.</p>
      )}
    </div>
  );
}
