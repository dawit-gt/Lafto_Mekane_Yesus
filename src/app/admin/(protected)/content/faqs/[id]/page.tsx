import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqForm } from "@/components/admin/FaqForm";
import { getAdminFaqById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit FAQ",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const faq = await getAdminFaqById(id);

  if (!faq) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit FAQ</h1>
      <div className="mt-6">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}