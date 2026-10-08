import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationForm } from "@/components/admin/LocationForm";
import { getAdminLocationById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Location",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const location = await getAdminLocationById(id);

  if (!location) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Location</h1>
      <div className="mt-6">
        <LocationForm location={location} />
      </div>
    </div>
  );
}