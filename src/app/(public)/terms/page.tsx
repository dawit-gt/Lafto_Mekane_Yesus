import type { Metadata } from "next";
import { EditableLegalPage } from "@/components/sections/EditableLegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the Lafto Mekaneyesus website.",
};

export default function TermsPage() {
  return <EditableLegalPage kind="terms" />;
}