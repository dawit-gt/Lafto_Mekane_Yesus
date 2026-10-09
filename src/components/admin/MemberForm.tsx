"use client";

import { useActionState } from "react";
import { createMember, updateMember } from "@/lib/actions/admin-members";
import { initialFormState } from "@/lib/actions/state";
import { TextField, SelectField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { Member } from "@/types/database";

export function MemberForm({
  member,
  ministries,
}: {
  member?: Member;
  ministries: Array<{ id: string; label: string }>;
}) {
  const isEdit = !!member;
  const action = isEdit ? updateMember.bind(null, member.id) : createMember;
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <TextField
        label="Full Name"
        name="fullName"
        required
        defaultValue={member?.full_name}
        errors={state.fieldErrors?.fullName}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Email (optional)"
          name="email"
          type="email"
          defaultValue={member?.email ?? undefined}
          errors={state.fieldErrors?.email}
        />
        <TextField
          label="Phone (optional)"
          name="phone"
          type="tel"
          defaultValue={member?.phone ?? undefined}
          errors={state.fieldErrors?.phone}
        />
      </div>

      <SelectField
        label="Membership Status"
        name="membershipStatus"
        required
        defaultValue={member?.membership_status ?? "active"}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        errors={state.fieldErrors?.membershipStatus}
      />

      <fieldset>
        <legend className="text-sm font-medium text-ink">Ministries (optional)</legend>
        {ministries.length > 0 ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ministries.map((m) => (
              <label key={m.id} className="flex items-start gap-2 text-sm text-ink/85">
                <input
                  type="checkbox"
                  name="ministryIds"
                  value={m.id}
                  defaultChecked={member?.ministry_ids?.includes(m.id)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-line accent-forest"
                />
                {m.label}
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink/60">No ministries yet. Add them under Content → Ministries.</p>
        )}
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-ink/85">
        <input
          type="checkbox"
          name="directoryVisible"
          defaultChecked={member?.directory_visible}
          className="mt-0.5 h-4 w-4 rounded-sm border-line accent-forest"
        />
        This person agreed to be listed in a members directory (no directory exists yet)
      </label>

      <SubmitButton>{isEdit ? "Save Changes" : "Add Member"}</SubmitButton>
    </form>
  );
}