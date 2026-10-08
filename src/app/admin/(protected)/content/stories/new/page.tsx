import type { Metadata } from "next";
import { StoryForm } from "@/components/admin/StoryForm";

export const metadata: Metadata = {
  title: "New Story",
  robots: { index: false, follow: false },
};

export default function NewStoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Story</h1>
      <div className="mt-6">
        <StoryForm />
      </div>
    </div>
  );
}