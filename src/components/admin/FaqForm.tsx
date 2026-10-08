"use client";

import { useActionState } from "react";
import { createFaq, updateFaq } from "@/lib/actions/admin-faqs";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { Faq } from "@/types/database";

export function FaqForm({ faq }: { faq?: Faq }) {
  const isEdit = !!faq;
  const action = isEdit ? updateFaq.bind(null, faq.id) : createFaq;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Question"
        name="question"
        required
        defaultValue={faq?.question}
        errors={state.fieldErrors?.question}
      />

      <TextAreaField
        label="Answer"
        name="answerMd"
        required
        rows={6}
        defaultValue={faq?.answer_md}
        errors={state.fieldErrors?.answerMd}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Shown On"
          name="pageContext"
          required
          defaultValue={faq?.page_context ?? "visit"}
          options={[
            { value: "visit", label: "Visit Us page" },
            { value: "contact", label: "Contact page" },
            { value: "general", label: "General" },
          ]}
          errors={state.fieldErrors?.pageContext}
        />
        <TextField
          label="Display Order"
          name="displayOrder"
          required
          defaultValue={String(faq?.display_order ?? 0)}
          hint="Lower numbers appear first"
          errors={state.fieldErrors?.displayOrder}
        />
        <SelectField
          label="Status"
          name="status"
          required
          defaultValue={faq?.status ?? "published"}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
          errors={state.fieldErrors?.status}
        />
      </div>

      <SubmitButton>{isEdit ? "Save Changes" : "Add FAQ"}</SubmitButton>
    </form>
  );
}