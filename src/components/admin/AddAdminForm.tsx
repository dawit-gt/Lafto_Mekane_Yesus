"use client";

import { useActionState, useEffect, useRef } from "react";
import { addAdmin } from "@/lib/actions/admin-users";
import { initialFormState } from "@/lib/actions/state";
import { TextField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";

export function AddAdminForm() {
  const [state, formAction] = useActionState(addAdmin, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <FormStatusBanner state={state} />
      <TextField
        label="Account Email"
        name="email"
        type="email"
        required
        hint="Must already have an account (see the note above)."
        errors={state.fieldErrors?.email}
      />
      <TextField
        label="Full Name"
        name="fullName"
        required
        hint="Shown in the Admin area and the audit log."
        errors={state.fieldErrors?.fullName}
      />
      <SubmitButton>Grant Admin Access</SubmitButton>
    </form>
  );
}