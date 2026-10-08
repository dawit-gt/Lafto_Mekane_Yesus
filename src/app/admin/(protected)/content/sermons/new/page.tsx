import type { Metadata } from "next";
import { SermonForm } from "@/components/admin/SermonForm";
import { getSermonSeriesOptions } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "New Sermon",
  robots: { index: false, follow: false },
};

export default async function NewSermonPage() {
  const seriesOptions = await getSermonSeriesOptions();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Sermon</h1>
      <div className="mt-6">
        <SermonForm seriesOptions={seriesOptions} />
      </div>
    </div>
  );
}