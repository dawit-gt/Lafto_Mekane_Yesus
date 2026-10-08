import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinistryForm } from "@/components/admin/MinistryForm";
import { getAdminMinistryById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Ministry",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMinistryPage({ params }: Props) {
  const { id } = await params;
  const ministry = await getAdminMinistryById(id);

  if (!ministry) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Ministry</h1>
      <div className="mt-6">
        <MinistryForm ministry={ministry} />
      </div>
    </div>
  );
}