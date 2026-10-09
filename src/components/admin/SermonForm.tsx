
"use client";

import { useActionState } from "react";
import { createSermon, updateSermon } from "@/lib/actions/admin-sermons";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import type { Sermon } from "@/types/database";
import type { SelectOption } from "@/lib/data/admin-content";

interface SermonFormProps {
  sermon?: Sermon;
  seriesOptions: SelectOption[];
}

function fillSlugFromTitle() {
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;
  if (titleInput && slugInput) {
    slugInput.value = slugify(titleInput.value);
  }
}

export function SermonForm({ sermon, seriesOptions }: SermonFormProps) {
  const isEdit = !!sermon;
  const action = isEdit ? updateSermon.bind(null, sermon.id) : createSermon;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={sermon?.title}
        errors={state.fieldErrors?.title}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={sermon?.slug}
          hint="Used in the page URL, e.g. /sermons/your-slug"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Speaker"
          name="speaker"
          required
          defaultValue={sermon?.speaker}
          errors={state.fieldErrors?.speaker}
        />
        <TextField
          label="Scripture (optional)"
          name="scripture"
          defaultValue={sermon?.scripture ?? undefined}
          hint="e.g. John 3:16-21"
          errors={state.fieldErrors?.scripture}
        />
      </div>

      <TextAreaField
        label="Description"
        name="description"
        defaultValue={sermon?.description ?? undefined}
        errors={state.fieldErrors?.description}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Date"
          name="sermonDate"
          defaultValue={sermon?.sermon_date}
          hint="YYYY-MM-DD"
          required
          errors={state.fieldErrors?.sermonDate}
        />
        <SelectField
          label="Series (optional)"
          name="seriesId"
          defaultValue={sermon?.series_id ?? ""}
          emptyOptionLabel="No series"
          options={seriesOptions.map((o) => ({ value: o.id, label: o.label }))}
          errors={state.fieldErrors?.seriesId}
        />
      </div>

      <TextField
        label="Video URL (optional)"
        name="videoUrl"
        defaultValue={sermon?.video_url ?? undefined}
        hint="A YouTube link works best — it embeds automatically."
        errors={state.fieldErrors?.videoUrl}
      />

      <TextField
        label="Audio URL (optional)"
        name="audioUrl"
        defaultValue={sermon?.audio_url ?? undefined}
        hint="Used only if no video is available."
        errors={state.fieldErrors?.audioUrl}
      />

      <ImageUploadField
        label="Thumbnail (optional)"
        name="imageUrl"
        defaultValue={sermon?.thumbnail_url}
        errors={state.fieldErrors?.imageUrl}
      />

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={sermon?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Sermon"}</SubmitButton>
    </form>
  );
}
