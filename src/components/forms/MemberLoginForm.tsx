"use client";

import { useActionState } from "react";
import { signInMember } from "@/lib/actions/auth";
import { initialAuthState } from "@/lib/actions/state";
import { TextField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";

export function MemberLoginForm() {
  const [state, formAction] = useActionState(signInMember, initialAuthState);

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <FormStatusBanner state={{ status: "error", message: state.message }} />
      )}
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Password" name="password" type="password" required />
      <SubmitButton>Sign In</SubmitButton>
    </form>
  );
}