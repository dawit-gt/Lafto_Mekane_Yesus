"use client";

import { useActionState } from "react";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions/admin-announcements";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { isoToDateTimeLocal } from "@/lib/utils/timezone";
import type { Announcement } from "@/types/database";

const SITE_TIMEZONE = "Africa/Addis_Ababa";

export function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const isEdit = !!announcement;
  const action = isEdit ? updateAnnouncement.bind(null, announcement.id) : createAnnouncement;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={announcement?.title}
        errors={state.fieldErrors?.title}
      />

      <TextAreaField
        label="Announcement"
        name="bodyMd"
        required
        rows={5}
        defaultValue={announcement?.body_md}
        errors={state.fieldErrors?.bodyMd}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Publish From"
          name="publishAtLocal"
          required
          defaultValue={
            announcement ? isoToDateTimeLocal(announcement.publish_at, SITE_TIMEZONE) : undefined
          }
          hint="YYYY-MM-DDTHH:MM — Addis Ababa time"
          errors={state.fieldErrors?.publishAtLocal}
        />
        <TextField
          label="Expires (optional)"
          name="expiresAtLocal"
          defaultValue={
            announcement?.expires_at ? isoToDateTimeLocal(announcement.expires_at, SITE_TIMEZONE) : undefined
          }
          hint="Disappears automatically after this time"
          errors={state.fieldErrors?.expiresAtLocal}
        />
      </div>

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={announcement?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Announcement"}</SubmitButton>
    </form>
  );
}