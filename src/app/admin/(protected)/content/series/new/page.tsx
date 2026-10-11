import type { Metadata } from "next";
import { SeriesForm } from "@/components/admin/SeriesForm";

export const metadata: Metadata = {
  title: "New Series",
  robots: { index: false, follow: false },
};

export default function NewSeriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Sermon Series</h1>
      <div className="mt-6">
        <SeriesForm />
      </div>
    </div>
  );
}
