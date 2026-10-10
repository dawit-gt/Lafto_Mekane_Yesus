"use client";

import { useActionState } from "react";
import { createStory, updateStory } from "@/lib/actions/admin-stories";
import { initialFormState } from "@/lib/actions/state";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from "@/components/ui/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import type { Story } from "@/types/database";

function fillSlugFromTitle() {
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;
  if (titleInput && slugInput) {
    slugInput.value = slugify(titleInput.value);
  }
}

export function StoryForm({ story }: { story?: Story }) {
  const isEdit = !!story;
  const action = isEdit ? updateStory.bind(null, story.id) : createStory;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={story?.title}
        errors={state.fieldErrors?.title}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={story?.slug}
          hint="Used in the page URL, e.g. /stories/your-slug"
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

      <SelectField
        label="Category"
        name="category"
        defaultValue={story?.category ?? ""}
        emptyOptionLabel="No category"
        options={[
          { value: "testimony", label: "Testimony" },
          { value: "ministry", label: "Ministry" },
          { value: "community", label: "Community" },
        ]}
        errors={state.fieldErrors?.category}
      />

      <TextAreaField
        label="Story"
        name="bodyMd"
        hint="Formatting: **bold**, *italic*, [link text](https://example.org). Start lines with - for a bullet list."
        required
        rows={10}
        defaultValue={story?.body_md}
        errors={state.fieldErrors?.bodyMd}
      />

      <CheckboxField
        label="Feature this story on the homepage"
        name="featured"
        defaultChecked={story?.featured}
      />

      <ImageUploadField
        label="Picture (optional)"
        name="imageUrl"
        defaultValue={story?.image_url}
        errors={state.fieldErrors?.imageUrl}
      />

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={story?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Story"}</SubmitButton>
    </form>
  );
}