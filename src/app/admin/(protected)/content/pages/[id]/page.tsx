import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/PageForm";
import { getAdminPageById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Page",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await getAdminPageById(id);

  if (!page) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Page</h1>
      <div className="mt-6">
        <PageForm page={page} />
      </div>
    </div>
  );
}