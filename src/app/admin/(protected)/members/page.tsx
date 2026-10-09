import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMembers, getMemberPhotoUrls } from "@/lib/data/admin-members";
import { deleteMember } from "@/lib/actions/admin-members";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export default async function AdminMembersPage() {
  const members = await getAdminMembers();
  const photoUrls = await getMemberPhotoUrls(
    members.map((m) => m.photo_path).filter((p): p is string => !!p)
  );
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
        {members.length} total, {activeCount} active. This list is private and only visible to
        website admins. Only members you tick &ldquo;show on the public page&rdquo; appear on the
        Church Family page, and only with their name and photo.
      </p>

      {members.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Work</th>
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Public</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((member) => {
                const photo = member.photo_path ? photoUrls[member.photo_path] : undefined;
                const family = [
                  member.marital_status === "married"
                    ? "Married"
                    : member.marital_status === "not_married"
                      ? "Not married"
                      : null,
                  member.children_count != null
                    ? `${member.children_count} ${member.children_count === 1 ? "child" : "children"}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <tr key={member.id}>
                    <td className="px-4 py-3">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-line" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{member.full_name}</td>
                    <td className="px-4 py-3 text-ink/70">{member.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-ink/70">{member.occupation ?? "—"}</td>
                    <td className="px-4 py-3 text-ink/70">{family || "—"}</td>
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
                    <td className="px-4 py-3 text-ink/70">
                      {member.directory_visible && member.membership_status === "active" ? "Yes" : "No"}
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink/60">No members yet. Add the first one above.</p>
      )}
    </div>
  );
}