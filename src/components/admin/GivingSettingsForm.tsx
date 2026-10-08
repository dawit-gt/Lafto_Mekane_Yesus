"use client";

import { useActionState } from "react";
import { updateGivingSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField, CheckboxField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { GivingSettings } from "@/types/database";

export function GivingSettingsForm({ settings }: { settings: GivingSettings }) {
  const [state, formAction] = useActionState(updateGivingSettings, initialFormState);

  return (
    <form action={formAction} className="space-y-5">
      <FormStatusBanner state={state} />

      <TextAreaField
        label="Note Shown to Visitors"
        name="informationalNote"
        required
        rows={4}
        defaultValue={settings.informational_note}
        hint="Explain how to give: in person, bank transfer details, or what the online link does."
        errors={state.fieldErrors?.informationalNote}
      />

      <CheckboxField
        label="Show an online giving button"
        name="isOnlineGivingEnabled"
        defaultChecked={settings.is_online_giving_enabled}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Provider Name"
          name="providerName"
          defaultValue={settings.provider_name ?? undefined}
          hint="Shown on the button, e.g. the payment provider's name"
          errors={state.fieldErrors?.providerName}
        />
        <TextField
          label="Giving Link"
          name="providerUrl"
          defaultValue={settings.provider_url ?? undefined}
          hint="Must start with https://"
          errors={state.fieldErrors?.providerUrl}
        />
      </div>

      <p className="rounded-sm border border-line bg-paper p-3 text-xs text-ink/65">
        Never enter card numbers, bank passwords or other payment credentials here. The button
        should only point to a giving page run by an approved payment provider.
      </p>

      <SubmitButton>Save Giving Settings</SubmitButton>
    </form>
  );
}