import type { Metadata } from "next";
import { MemberForm } from "@/components/admin/MemberForm";
import { getMinistryOptions } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Add Member",
  robots: { index: false, follow: false },
};

export default async function NewMemberPage() {
  const ministries = await getMinistryOptions();
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Add Member</h1>
      <div className="mt-6">
        <MemberForm ministries={ministries} />
      </div>
    </div>
  );
}