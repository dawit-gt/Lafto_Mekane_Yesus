import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberForm } from "@/components/admin/MemberForm";
import { getAdminMemberById } from "@/lib/data/admin-members";
import { getMinistryOptions } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Member",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const [member, ministries] = await Promise.all([getAdminMemberById(id), getMinistryOptions()]);

  if (!member) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Member</h1>
      <div className="mt-6">
        <MemberForm member={member} ministries={ministries} />
      </div>
    </div>
  );
}