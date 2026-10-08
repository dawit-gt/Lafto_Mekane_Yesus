import type { Metadata } from "next";
import { PageForm } from "@/components/admin/PageForm";

export const metadata: Metadata = {
  title: "New Page",
  robots: { index: false, follow: false },
};

export default function NewPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Page</h1>
      <div className="mt-6">
        <PageForm />
      </div>
    </div>
  );
}