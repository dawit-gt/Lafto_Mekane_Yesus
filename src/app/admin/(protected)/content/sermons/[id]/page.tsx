import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SermonForm } from "@/components/admin/SermonForm";
import { getAdminSermonById, getSermonSeriesOptions } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Sermon",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSermonPage({ params }: Props) {
  const { id } = await params;
  const [sermon, seriesOptions] = await Promise.all([
    getAdminSermonById(id),
    getSermonSeriesOptions(),
  ]);

  if (!sermon) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Sermon</h1>
      <div className="mt-6">
        <SermonForm sermon={sermon} seriesOptions={seriesOptions} />
      </div>
    </div>
  );
}