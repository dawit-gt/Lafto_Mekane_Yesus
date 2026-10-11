import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesForm } from "@/components/admin/SeriesForm";
import { getAdminSeriesById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Series",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSeriesPage({ params }: Props) {
  const { id } = await params;
  const series = await getAdminSeriesById(id);

  if (!series) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Sermon Series</h1>
      <div className="mt-6">
        <SeriesForm series={series} />
      </div>
    </div>
  );
}
