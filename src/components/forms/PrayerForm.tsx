"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitPrayerRequest } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, CheckboxField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { HoneypotField } from "@/components/forms/HoneypotField";

export function PrayerForm() {
  const [state, formAction] = useActionState(submitPrayerRequest, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <HoneypotField />
      <FormStatusBanner state={state} />
      <p className="text-sm text-ink/70">
        Your request is only ever seen by our prayer team — it is never shown
        publicly. Name and email are optional; you&apos;re welcome to submit
        anonymously.
      </p>
      <TextField label="Name (optional)" name="name" errors={state.fieldErrors?.name} />
      <TextField label="Email (optional)" name="email" type="email" errors={state.fieldErrors?.email} />
      <TextAreaField
        label="Your Prayer Request"
        name="requestText"
        required
        rows={6}
        errors={state.fieldErrors?.requestText}
      />
      <CheckboxField
        label="Keep this request confidential (shared only with the prayer team, not the wider congregation)"
        name="isConfidential"
        defaultChecked
      />
      <SubmitButton>Share Prayer Request</SubmitButton>
    </form>
  );
}