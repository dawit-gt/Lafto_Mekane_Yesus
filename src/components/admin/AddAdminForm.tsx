"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addAdmin } from "@/lib/actions/admin-users";
import { initialFormState } from "@/lib/actions/state";
import { TextField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { Card } from "@/components/ui/Card";

/** An "Add user" button that opens a small form to create an Admin account. */
export function AddAdminForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(addAdmin, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold tracking-wide text-paper-raised transition-colors hover:bg-forest-deep"
      >
        {open ? "Close" : "+ Add user"}
      </button>

      {/* Kept on the page while closed so the success message isn't lost. */}
      <div className={open ? "" : "hidden"}>
        <Card className="mt-4 max-w-xl">
          <form ref={formRef} action={formAction} className="space-y-5">
            <FormStatusBanner state={state} />
            <TextField
              label="Full Name"
              name="fullName"
              required
              hint="Shown in the Admin area and the audit log."
              errors={state.fieldErrors?.fullName}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              errors={state.fieldErrors?.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              hint="At least 10 characters. Share it with them privately and ask them to keep it safe. Leave empty only if this person already has a sign-in account."
              errors={state.fieldErrors?.password}
            />
            <SubmitButton>Add user</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}