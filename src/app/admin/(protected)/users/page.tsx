import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminUsers } from "@/lib/data/admin-users";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { removeAdmin } from "@/lib/actions/admin-users";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Users",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const [admins, current] = await Promise.all([getAdminUsers(), getCurrentAdmin()]);
  const canRemoveAnyone = admins.length > 1;

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Users</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        People listed here can sign in at /admin/login and manage everything on the site. Only
        grant access to people who need it, and remove it as soon as their role changes.
      </p>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper-raised">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Admin since</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {admins.map((admin) => {
              const isYou = admin.id === current?.id;
              return (
                <tr key={admin.id}>
                  <td className="px-4 py-3 font-medium text-ink">
                    {admin.fullName}
                    {isYou && (
                      <span className="ml-2 rounded-full bg-forest/10 px-2 py-0.5 text-xs font-medium text-forest-deep">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{admin.email ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/70">{formatDate(admin.createdAt.slice(0, 10))}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {!isYou && canRemoveAnyone && (
                        <DeleteButton
                          action={removeAdmin.bind(null, admin.id)}
                          confirmMessage={`Remove Admin access for ${admin.fullName}? They will no longer be able to use the Admin area. Their account is kept.`}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Grant Admin Access</h2>
      <Card className="mt-3 max-w-xl">
        <p className="mb-5 text-sm text-ink/70">
          This page grants and removes Admin rights, but it doesn&apos;t create sign-in accounts. To
          add a new person: in Supabase go to <strong>Authentication → Users → Add user</strong>
          (tick &quot;Auto Confirm User&quot;), share their password with them privately, then enter
          their email below.
        </p>
        <AddAdminForm />
      </Card>
    </div>
  );
}