"use client";

import { useActionState } from "react";
import { createLeader, updateLeader } from "@/lib/actions/admin-leaders";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { Leader } from "@/types/database";

export function LeaderForm({ leader }: { leader?: Leader }) {
  const isEdit = !!leader;
  const action = isEdit ? updateLeader.bind(null, leader.id) : createLeader;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          required
          defaultValue={leader?.full_name}
          errors={state.fieldErrors?.fullName}
        />
        <TextField
          label="Title / Role"
          name="title"
          required
          defaultValue={leader?.title}
          hint="e.g. Senior Pastor, Church Council Chair"
          errors={state.fieldErrors?.title}
        />
      </div>

      <TextAreaField
        label="Short Bio (optional)"
        name="bioMd"
        rows={5}
        defaultValue={leader?.bio_md ?? undefined}
        errors={state.fieldErrors?.bioMd}
      />

      <TextField
        label="Photo URL (optional)"
        name="photoUrl"
        defaultValue={leader?.photo_url ?? undefined}
        hint="Full link to an image, e.g. https://..."
        errors={state.fieldErrors?.photoUrl}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Display Order"
          name="displayOrder"
          required
          defaultValue={String(leader?.display_order ?? 0)}
          hint="Lower numbers appear first on the About page"
          errors={state.fieldErrors?.displayOrder}
        />
        <SelectField
          label="Status"
          name="status"
          required
          defaultValue={leader?.status ?? "published"}
          options={[
            { value: "draft", label: "Draft (not visible to the public)" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
          errors={state.fieldErrors?.status}
        />
      </div>

      <SubmitButton>{isEdit ? "Save Changes" : "Add Leader"}</SubmitButton>
    </form>
  );
}