import type { Metadata } from "next";
import Link from "next/link";
import { getAdminFaqs } from "@/lib/data/admin-content";
import { deleteFaq } from "@/lib/actions/admin-faqs";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "FAQs",
  robots: { index: false, follow: false },
};

const statusStyles: Record<string, string> = {
  published: "bg-forest/10 text-forest-deep",
  draft: "bg-brass/10 text-brass-dim",
  archived: "bg-line text-ink/60",
};

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">FAQs</h1>
        <Link
          href="/admin/content/faqs/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + Add FAQ
        </Link>
      </div>

      <p className="mt-2 text-sm text-ink/60">
        FAQs marked &quot;Visit Us page&quot; appear on the Visit page today. Other placements are
        stored but not displayed yet.
      </p>

      {faqs.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Shown On</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-4 py-3 font-medium text-ink">
                    <span className="line-clamp-1">{faq.question}</span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{faq.page_context}</td>
                  <td className="px-4 py-3 text-ink/70">{faq.display_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[faq.status]}`}
                    >
                      {faq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/content/faqs/${faq.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteFaq.bind(null, faq.id)}
                        confirmMessage="Delete this FAQ? This can't be undone."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No FAQs yet. Add the first one above.</p>
      )}
    </div>
  );
}