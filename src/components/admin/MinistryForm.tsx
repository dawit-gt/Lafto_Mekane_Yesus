"use client";

import { useActionState } from "react";
import { createMinistry, updateMinistry } from "@/lib/actions/admin-ministries";
import { initialFormState } from "@/lib/actions/state";
import {
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/ui/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import type { Ministry } from "@/types/database";

function fillSlugFromName() {
  const nameInput = document.getElementById("name") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;
  if (nameInput && slugInput) {
    slugInput.value = slugify(nameInput.value);
  }
}

export function MinistryForm({ ministry }: { ministry?: Ministry }) {
  const isEdit = !!ministry;
  const action = isEdit ? updateMinistry.bind(null, ministry.id) : createMinistry;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Name"
        name="name"
        required
        defaultValue={ministry?.name}
        errors={state.fieldErrors?.name}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={ministry?.slug}
          hint="Used in the page URL, e.g. /ministries/your-slug"
          errors={state.fieldErrors?.slug}
        />
        <button
          type="button"
          onClick={fillSlugFromName}
          className="mb-[1px] h-fit rounded-sm border border-line px-3 py-2.5 text-xs font-medium text-ink/70 hover:bg-paper"
        >
          Generate from name
        </button>
      </div>

      <TextField
        label="Summary"
        name="summary"
        required
        defaultValue={ministry?.summary}
        hint="A short one-liner shown on the Ministries list page."
        errors={state.fieldErrors?.summary}
      />

      <TextAreaField
        label="Full Description"
        name="descriptionMd"
        hint="Formatting: **bold**, *italic*, [link text](https://example.org). Start lines with - for a bullet list."
        rows={6}
        defaultValue={ministry?.description_md ?? undefined}
        errors={state.fieldErrors?.descriptionMd}
      />

      <TextField
        label="Meeting Info (optional)"
        name="meetingInfo"
        defaultValue={ministry?.meeting_info ?? undefined}
        hint="e.g. Sundays, 9:00 AM, Fellowship Hall"
        errors={state.fieldErrors?.meetingInfo}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Contact Name (optional)"
          name="contactName"
          defaultValue={ministry?.contact_name ?? undefined}
          errors={state.fieldErrors?.contactName}
        />
        <TextField
          label="Contact Email (optional)"
          name="contactEmail"
          type="email"
          defaultValue={ministry?.contact_email ?? undefined}
          errors={state.fieldErrors?.contactEmail}
        />
        <TextField
          label="Contact Phone (optional)"
          name="contactPhone"
          type="tel"
          defaultValue={ministry?.contact_phone ?? undefined}
          errors={state.fieldErrors?.contactPhone}
        />
      </div>

      <ImageUploadField
        label="Picture (optional)"
        name="imageUrl"
        defaultValue={ministry?.image_url}
        errors={state.fieldErrors?.imageUrl}
      />

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={ministry?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Ministry"}</SubmitButton>
    </form>
  );
}