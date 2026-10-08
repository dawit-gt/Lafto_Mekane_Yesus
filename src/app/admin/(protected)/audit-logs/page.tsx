import type { Metadata } from "next";
import Link from "next/link";
import { getAuditLogs } from "@/lib/data/admin-audit";
import { formatEventDateTime } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Audit Logs",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function summarize(details: Record<string, unknown> | null): string {
  if (!details) return "—";
  const text = JSON.stringify(details);
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export default async function AdminAuditLogsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const { entries, hasMore } = await getAuditLogs(page);

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Audit Logs</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        A read-only record of changes made in the Admin area, newest first. Entries can&apos;t be
        edited or deleted from here.
      </p>

      {entries.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Who</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">What</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                    {formatEventDateTime(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{entry.actorName}</td>
                  <td className="px-4 py-3 text-ink/80">{entry.action.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {entry.tableName.replace(/_/g, " ")}
                    {entry.recordId && (
                      <span className="block text-xs text-ink/40">{entry.recordId.slice(0, 8)}</span>
                    )}
                  </td>
                  <td className="max-w-xs break-words px-4 py-3 text-xs text-ink/60">
                    {summarize(entry.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No activity recorded yet.</p>
      )}

      <div className="mt-6 flex items-center gap-6 text-sm">
        {page > 1 && (
          <Link
            href={`/admin/audit-logs?page=${page - 1}`}
            className="font-medium text-forest underline underline-offset-4"
          >
            ← Newer
          </Link>
        )}
        {hasMore && (
          <Link
            href={`/admin/audit-logs?page=${page + 1}`}
            className="font-medium text-forest underline underline-offset-4"
          >
            Older →
          </Link>
        )}
      </div>
    </div>
  );
}