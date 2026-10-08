import type { Metadata } from "next";
import { MinistryForm } from "@/components/admin/MinistryForm";

export const metadata: Metadata = {
  title: "New Ministry",
  robots: { index: false, follow: false },
};

export default function NewMinistryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Ministry</h1>
      <div className="mt-6">
        <MinistryForm />
      </div>
    </div>
  );
}