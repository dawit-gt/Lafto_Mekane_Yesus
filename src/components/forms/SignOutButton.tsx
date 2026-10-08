"use client";

import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm font-medium text-ink/70 underline underline-offset-4 hover:text-forest"
      >
        Sign Out
      </button>
    </form>
  );
}