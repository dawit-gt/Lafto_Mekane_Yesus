"use client";

import { useActionState } from "react";
import { createEvent, updateEvent } from "@/lib/actions/admin-events";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import { commonTimeZones, isoToDateTimeLocal } from "@/lib/utils/timezone";
import type { Event } from "@/types/database";
import type { SelectOption } from "@/lib/data/admin-content";

interface EventFormProps {
  event?: Event;
  locationOptions: SelectOption[];
  ministryOptions: SelectOption[];
}

/** Fills the Slug field from whatever is currently in the Title field. */
function fillSlugFromTitle() {
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;
  if (titleInput && slugInput) {
    slugInput.value = slugify(titleInput.value);
  }
}

export function EventForm({ event, locationOptions, ministryOptions }: EventFormProps) {
  const isEdit = !!event;
  const action = isEdit ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction] = useActionState(action, initialFormState);

  const timezone = event?.timezone ?? "Africa/Addis_Ababa";

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={event?.title}
        errors={state.fieldErrors?.title}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={event?.slug}
          hint="Used in the page URL, e.g. /events/your-slug"
          errors={state.fieldErrors?.slug}
        />
        <button
          type="button"
          onClick={fillSlugFromTitle}
          className="mb-[1px] h-fit rounded-sm border border-line px-3 py-2.5 text-xs font-medium text-ink/70 hover:bg-paper"
        >
          Generate from title
        </button>
      </div>

      <TextAreaField
        label="Description"
        name="description"
        defaultValue={event?.description ?? undefined}
        errors={state.fieldErrors?.description}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Starts"
          name="startAtLocal"
          defaultValue={event ? isoToDateTimeLocal(event.start_at, timezone) : undefined}
          hint="YYYY-MM-DDTHH:MM, e.g. 2026-06-14T10:30"
          required
          errors={state.fieldErrors?.startAtLocal}
        />
        <TextField
          label="Ends (optional)"
          name="endAtLocal"
          defaultValue={event?.end_at ? isoToDateTimeLocal(event.end_at, timezone) : undefined}
          hint="Same format as above"
          errors={state.fieldErrors?.endAtLocal}
        />
      </div>

      <SelectField
        label="Timezone"
        name="timezone"
        required
        defaultValue={timezone}
        options={commonTimeZones.map((tz) => ({ value: tz, label: tz }))}
        errors={state.fieldErrors?.timezone}
      />

      <SelectField
        label="Location"
        name="locationId"
        defaultValue={event?.location_id ?? ""}
        emptyOptionLabel="No location set"
        options={locationOptions.map((o) => ({ value: o.id, label: o.label }))}
        errors={state.fieldErrors?.locationId}
      />

      <SelectField
        label="Related Ministry"
        name="ministryId"
        defaultValue={event?.ministry_id ?? ""}
        emptyOptionLabel="None"
        options={ministryOptions.map((o) => ({ value: o.id, label: o.label }))}
        errors={state.fieldErrors?.ministryId}
      />

      <TextField
        label="Registration Link (optional)"
        name="registrationUrl"
        defaultValue={event?.registration_url ?? undefined}
        hint="Full URL, e.g. https://forms.gle/..."
        errors={state.fieldErrors?.registrationUrl}
      />

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={event?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Event"}</SubmitButton>
    </form>
  );
}