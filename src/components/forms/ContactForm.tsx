"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitContactMessage } from "@/lib/actions/forms";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { HoneypotField } from "@/components/forms/HoneypotField";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <HoneypotField />
      <FormStatusBanner state={state} />
      <TextField label="Name" name="name" required errors={state.fieldErrors?.name} />
      <TextField label="Phone" name="phone" type="tel" required errors={state.fieldErrors?.phone} />
      <TextAreaField label="Message" name="message" required errors={state.fieldErrors?.message} />
      <SubmitButton>Send Message</SubmitButton>
    </form>
  );
}