import type { Metadata } from "next";
import { LeaderForm } from "@/components/admin/LeaderForm";

export const metadata: Metadata = {
  title: "Add Leader",
  robots: { index: false, follow: false },
};

export default function NewLeaderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Add Leader</h1>
      <div className="mt-6">
        <LeaderForm />
      </div>
    </div>
  );
}