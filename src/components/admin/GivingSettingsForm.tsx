"use client";

import { useActionState } from "react";
import { updateGivingSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextAreaField } from "@/components/ui/Field";
import { RepeatableRows } from "@/components/admin/RepeatableRows";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { toAccounts } from "@/lib/utils/contact-lists";
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
        hint="Explain how to give, e.g. in person after the service or by transferring to one of the accounts below."
        errors={state.fieldErrors?.informationalNote}
      />

      <RepeatableRows
        legend="Accounts"
        hint="Bank or mobile-money accounts where members can give. Add as many as you need."
        addLabel="Add account"
        emptyNote="No accounts yet."
        initial={toAccounts(settings.accounts).map((a) => ({
          accountProvider: a.provider,
          accountHolder: a.holder,
          accountNumber: a.number,
        }))}
        fields={[
          { name: "accountProvider", label: "Provider name", placeholder: "Commercial Bank of Ethiopia" },
          { name: "accountNumber", label: "Account number", placeholder: "1000123456789", inputMode: "text" },
          { name: "accountHolder", label: "Account name (optional)", placeholder: "EECMY Lafto Mekaneyesus" },
        ]}
        errors={state.fieldErrors?.accounts}
      />

      <p className="rounded-sm border border-line bg-paper p-3 text-xs text-ink/65">
        Only enter the church&apos;s own public account numbers. Never enter card numbers, PINs,
        passwords or other payment credentials here.
      </p>

      <SubmitButton>Save Giving Settings</SubmitButton>
    </form>
  );
}