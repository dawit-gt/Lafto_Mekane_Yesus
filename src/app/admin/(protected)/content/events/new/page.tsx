import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";
import { getLocationOptions, getMinistryOptions } from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "New Event",
  robots: { index: false, follow: false },
};

export default async function NewEventPage() {
  const [locationOptions, ministryOptions] = await Promise.all([
    getLocationOptions(),
    getMinistryOptions(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">New Event</h1>
      <div className="mt-6">
        <EventForm locationOptions={locationOptions} ministryOptions={ministryOptions} />
      </div>
    </div>
  );
}