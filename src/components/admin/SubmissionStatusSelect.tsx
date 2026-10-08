"use client";

import { useTransition } from "react";
import { setSubmissionStatus } from "@/lib/actions/admin-communication";

interface Props {
  table: "contact_messages" | "prayer_requests" | "volunteer_requests";
  id: string;
  status: string;
}

export function SubmissionStatusSelect({ table, id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Status"
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          setSubmissionStatus(table, id, next);
        });
      }}
      className="rounded-sm border border-line bg-paper-raised px-2 py-1.5 text-xs font-medium text-ink focus-visible:outline-none disabled:opacity-50"
    >
      <option value="new">New</option>
      <option value="in_progress">In progress</option>
      <option value="resolved">Resolved</option>
      <option value="archived">Archived</option>
    </select>
  );
}