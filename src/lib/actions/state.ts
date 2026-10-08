// Plain types and initial values shared by Server Actions and the client
// components that call them via useActionState.
//
// This file deliberately does NOT have a "use server" directive: Next.js
// requires every export of a "use server" file to be an async function, so
// the actual action functions live in auth.ts / forms.ts while the state
// shapes they operate on live here, importable from both server and client.

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialFormState: FormState = { status: "idle", message: "" };

export interface AuthFormState {
  status: "idle" | "error";
  message: string;
}

export const initialAuthState: AuthFormState = { status: "idle", message: "" };