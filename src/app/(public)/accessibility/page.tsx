import type { Metadata } from "next";
import { EditableLegalPage } from "@/components/sections/EditableLegalPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our commitment to making the Lafto Mekaneyesus website usable by everyone.",
};

export default function AccessibilityPage() {
  return <EditableLegalPage kind="accessibility" />;
}