import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { AdminLoginForm } from "@/components/forms/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-lg font-bold text-forest">
          Lafto Mekaneyesus
        </p>
        <h1 className="mt-1 text-center text-sm text-ink/60">Admin Sign In</h1>
        <Card className="mt-6">
          <AdminLoginForm />
        </Card>
      </div>
    </div>
  );
}