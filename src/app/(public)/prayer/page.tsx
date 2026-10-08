import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PrayerForm } from "@/components/forms/PrayerForm";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description: "Share a prayer request with our church family — confidential and private.",
};

export default function PrayerPage() {
  return (
    <>
      <Section tone="forest">
        <h1 className="font-serif text-4xl font-bold">Prayer Requests</h1>
        <p className="mt-4 max-w-xl text-paper-raised/85">
          We believe in the power of prayer. Share what&apos;s on your heart, and
          our prayer team will lift it up.
        </p>
      </Section>

      <Section>
        <div className="mx-auto max-w-xl">
          <PrayerForm />
        </div>
      </Section>
    </>
  );
}