"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-paper-raised transition-colors hover:bg-forest-deep disabled:opacity-60"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}