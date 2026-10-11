import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import {
  getAdminEventById,
  getEventSermonIds,
  getLocationOptions,
  getMinistryOptions,
  getSermonPickerOptions,
} from "@/lib/data/admin-content";

export const metadata: Metadata = {
  title: "Edit Event",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const [event, locationOptions, ministryOptions, sermonOptions, selectedSermonIds] = await Promise.all([
    getAdminEventById(id),
    getLocationOptions(),
    getMinistryOptions(),
    getSermonPickerOptions(),
    getEventSermonIds(id),
  ]);

  if (!event) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Edit Event</h1>
      <div className="mt-6">
        <EventForm
          event={event}
          locationOptions={locationOptions}
          ministryOptions={ministryOptions}
          sermonOptions={sermonOptions}
          selectedSermonIds={selectedSermonIds}
        />
      </div>
    </div>
  );
}