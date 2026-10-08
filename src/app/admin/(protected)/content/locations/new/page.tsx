import type { Metadata } from "next";
import { LocationForm } from "@/components/admin/LocationForm";

export const metadata: Metadata = {
  title: "Add Location",
  robots: { index: false, follow: false },
};

export default function NewLocationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Add Location</h1>
      <div className="mt-6">
        <LocationForm />
      </div>
    </div>
  );
}