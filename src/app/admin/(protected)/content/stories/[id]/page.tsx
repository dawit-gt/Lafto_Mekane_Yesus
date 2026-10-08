import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryForm } from "@/components/admin/StoryForm";
import { getAdminStoryById } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Story",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getAdminStoryById(id);

  if (!story) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Story</h1>
      <div className="mt-6">
        <StoryForm story={story} />
      </div>
    </div>
  );
}