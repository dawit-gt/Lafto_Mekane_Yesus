"use client";

import { useActionState } from "react";
import { createPage, updatePage } from "@/lib/actions/admin-pages";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { slugify } from "@/lib/utils/slug";
import type { Page } from "@/types/database";

function fillSlugFromTitle() {
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const slugInput = document.getElementById("slug") as HTMLInputElement | null;

  if (titleInput && slugInput) {
    slugInput.value = slugify(titleInput.value);
  }
}

export function PageForm({ page }: { page?: Page }) {
  const isEdit = !!page;
  const action = isEdit ? updatePage.bind(null, page.id) : createPage;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Title"
        name="title"
        required
        defaultValue={page?.title}
        errors={state.fieldErrors?.title}
      />

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <TextField
          label="Slug"
          name="slug"
          required
          defaultValue={page?.slug}
          hint="The page will be at /pages/your-slug. To link to it from other text, write [link text](/pages/your-slug)."
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
        label="Content"
        name="bodyMd"
        rows={14}
        defaultValue={page?.body_md}
        hint="Formatting: **bold**, *italic*, [link text](https://example.org). Start lines with - for a bullet list, ## for a heading."
        errors={state.fieldErrors?.bodyMd}
      />

      <SelectField
        label="Status"
        name="status"
        required
        defaultValue={page?.status ?? "draft"}
        options={[
          { value: "draft", label: "Draft (not visible to the public)" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ]}
        errors={state.fieldErrors?.status}
      />

      <SubmitButton>{isEdit ? "Save Changes" : "Create Page"}</SubmitButton>
    </form>
  );
}