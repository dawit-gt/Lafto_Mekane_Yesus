"use client";

import { useActionState } from "react";
import { createLocation, updateLocation } from "@/lib/actions/admin-locations";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { Location } from "@/types/database";

export function LocationForm({ location }: { location?: Location }) {
  const isEdit = !!location;
  const action = isEdit ? updateLocation.bind(null, location.id) : createLocation;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Name"
        name="name"
        required
        defaultValue={location?.name}
        hint="e.g. Lafto Mekaneyesus Main Sanctuary"
        errors={state.fieldErrors?.name}
      />

      <TextField
        label="Address Line 1"
        name="addressLine1"
        required
        defaultValue={location?.address_line1}
        errors={state.fieldErrors?.addressLine1}
      />

      <TextField
        label="Address Line 2 (optional)"
        name="addressLine2"
        defaultValue={location?.address_line2 ?? undefined}
        errors={state.fieldErrors?.addressLine2}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="City"
          name="city"
          required
          defaultValue={location?.city ?? "Addis Ababa"}
          errors={state.fieldErrors?.city}
        />
        <TextField
          label="Region (optional)"
          name="region"
          defaultValue={location?.region ?? undefined}
          errors={state.fieldErrors?.region}
        />
        <TextField
          label="Postal Code (optional)"
          name="postalCode"
          defaultValue={location?.postal_code ?? undefined}
          errors={state.fieldErrors?.postalCode}
        />
      </div>

      <TextField
        label="Country"
        name="country"
        required
        defaultValue={location?.country ?? "Ethiopia"}
        errors={state.fieldErrors?.country}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Latitude (optional)"
          name="latitude"
          defaultValue={location?.latitude != null ? String(location.latitude) : undefined}
          hint="e.g. 8.980603"
          errors={state.fieldErrors?.latitude}
        />
        <TextField
          label="Longitude (optional)"
          name="longitude"
          defaultValue={location?.longitude != null ? String(location.longitude) : undefined}
          hint="e.g. 38.757761"
          errors={state.fieldErrors?.longitude}
        />
      </div>

      <TextAreaField
        label="Directions Note (optional)"
        name="directionsNote"
        rows={3}
        defaultValue={location?.directions_note ?? undefined}
        hint="Landmarks, parking, which entrance to use."
        errors={state.fieldErrors?.directionsNote}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Add Location"}</SubmitButton>
    </form>
  );
}