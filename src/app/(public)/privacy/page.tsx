import type { Metadata } from "next";
import { EditableLegalPage } from "@/components/sections/EditableLegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lafto Mekaneyesus handles the personal information you share through this website.",
};

export default function PrivacyPage() {
  return <EditableLegalPage kind="privacy" />;
}