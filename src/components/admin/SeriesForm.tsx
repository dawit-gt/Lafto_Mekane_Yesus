"use client";

import { useActionState } from "react";
import { createSeries, updateSeries } from "@/lib/actions/admin-series";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import type { SermonSeries } from "@/types/database";

function fillSlugFromTitle() {
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;
  if (titleInput && slugInput) {
    slugInput.value = slugify(titleInput.value);
  }
}

export function SeriesForm({ series }: { series?: SermonSeries }) {
  const isEdit = !!series;
  const action = isEdit ? updateSeries.bind(null, series.id) : createSeries;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={series?.title}
        hint="e.g. The Gospel of John"
        errors={state.fieldErrors?.title}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={series?.slug}
          hint="Used in the web address, e.g. gospel-of-john"
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
        label="Description (optional)"
        name="description"
        rows={5}
        defaultValue={series?.description ?? undefined}
        hint="Shown at the top of the Sermons page when visitors pick this series."
        errors={state.fieldErrors?.description}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Series"}</SubmitButton>
    </form>
  );
}
