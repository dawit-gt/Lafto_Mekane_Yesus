"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { SiteSettings } from "@/types/database";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialFormState);

  return (
    <form action={formAction} className="space-y-5">
      <FormStatusBanner state={state} />

      <TextAreaField
        label="Service Times"
        name="serviceTimesMd"
        rows={4}
        defaultValue={settings.service_times_md}
        hint="Each line appears on its own line, e.g. Sunday Worship — 8:00 AM & 10:30 AM"
        errors={state.fieldErrors?.serviceTimesMd}
      />

      <TextField
        label="Default Page Title (SEO)"
        name="seoDefaultTitle"
        defaultValue={settings.seo_default_title ?? undefined}
        errors={state.fieldErrors?.seoDefaultTitle}
      />

      <TextAreaField
        label="Default Description (SEO)"
        name="seoDefaultDescription"
        rows={3}
        defaultValue={settings.seo_default_description ?? undefined}
        hint="Shown by search engines under the site name."
        errors={state.fieldErrors?.seoDefaultDescription}
      />

      <SubmitButton>Save Site Settings</SubmitButton>
    </form>
  );
}