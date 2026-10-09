import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMembers } from "@/lib/data/admin-members";
import { deleteMember } from "@/lib/actions/admin-members";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export default async function AdminMembersPage() {
  const members = await getAdminMembers();
  const activeCount = members.filter((m) => m.membership_status === "active").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest">Members</h1>
        <Link
          href="/admin/members/new"
          className="rounded-sm bg-forest px-4 py-2 text-sm font-semibold text-paper-raised hover:bg-forest-deep"
        >
          + Add Member
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        {members.length} total, {activeCount} active. This list is private. It is only visible to
        website admins.
      </p>

      {members.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-medium text-ink">{member.full_name}</td>
                  <td className="px-4 py-3 text-ink/70">{member.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/70">{member.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        member.membership_status === "active"
                          ? "bg-forest/10 text-forest-deep"
                          : "bg-line text-ink/60"
                      }`}
                    >
                      {member.membership_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-sm font-medium text-forest underline underline-offset-4"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteMember.bind(null, member.id)}
                        confirmMessage={`Delete "${member.full_name}"? This can't be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No members yet. Add the first one above.</p>
      )}
    </div>
  );
}