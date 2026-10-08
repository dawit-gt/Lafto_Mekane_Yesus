import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { getAdminAnnouncementById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Announcement",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const announcement = await getAdminAnnouncementById(id);

  if (!announcement) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Announcement</h1>
      <div className="mt-6">
        <AnnouncementForm announcement={announcement} />
      </div>
    </div>
  );
}