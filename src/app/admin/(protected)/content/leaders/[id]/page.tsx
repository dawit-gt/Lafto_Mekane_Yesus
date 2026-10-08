import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeaderForm } from "@/components/admin/LeaderForm";
import { getAdminLeaderById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Leader",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeaderPage({ params }: Props) {
  const { id } = await params;
  const leader = await getAdminLeaderById(id);

  if (!leader) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Leader</h1>
      <div className="mt-6">
        <LeaderForm leader={leader} />
      </div>
    </div>
  );
}