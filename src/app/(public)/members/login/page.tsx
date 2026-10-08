import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { MemberLoginForm } from "@/components/forms/MemberLoginForm";

export const metadata: Metadata = {
  title: "Member Sign In",
  robots: { index: false, follow: false },
};

export default function MemberLoginPage() {
  return (
    <Section>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-center font-serif text-2xl font-bold text-forest">
          Member Sign In
        </h1>
        <p className="mt-2 text-center text-sm text-ink/60">
          For approved members of Lafto Mekaneyesus.
        </p>
        <Card className="mt-6">
          <MemberLoginForm />
        </Card>
      </div>
    </Section>
  );
}