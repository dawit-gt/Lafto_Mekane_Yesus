"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitVolunteerRequest } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { HoneypotField } from "@/components/forms/HoneypotField";

export function VolunteerForm() {
  const [state, formAction] = useActionState(submitVolunteerRequest, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <HoneypotField />
      <FormStatusBanner state={state} />
      <TextField label="Name" name="name" required errors={state.fieldErrors?.name} />
      <TextField label="Email" name="email" type="email" required errors={state.fieldErrors?.email} />
      <TextField label="Phone (optional)" name="phone" type="tel" errors={state.fieldErrors?.phone} />
      <TextField
        label="Ministry Interest (optional)"
        name="ministryInterest"
        hint="e.g. Youth, Choir, Welcome Team"
        errors={state.fieldErrors?.ministryInterest}
      />
      <TextAreaField
        label="Availability (optional)"
        name="availabilityNote"
        rows={3}
        errors={state.fieldErrors?.availabilityNote}
      />
      <SubmitButton>Send Volunteer Interest</SubmitButton>
    </form>
  );
}