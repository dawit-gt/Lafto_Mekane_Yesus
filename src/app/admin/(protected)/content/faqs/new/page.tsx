import type { Metadata } from "next";
import { FaqForm } from "@/components/admin/FaqForm";

export const metadata: Metadata = {
  title: "Add FAQ",
  robots: { index: false, follow: false },
};

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Add FAQ</h1>
      <div className="mt-6">
        <FaqForm />
      </div>
    </div>
  );
}