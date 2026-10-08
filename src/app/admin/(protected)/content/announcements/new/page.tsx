import type { Metadata } from "next";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export const metadata: Metadata = {
  title: "New Announcement",
  robots: { index: false, follow: false },
};

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Announcement</h1>
      <div className="mt-6">
        <AnnouncementForm />
      </div>
    </div>
  );
}