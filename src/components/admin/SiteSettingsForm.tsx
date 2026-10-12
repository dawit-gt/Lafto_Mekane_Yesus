"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { SiteSettings } from "@/types/database";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(
    updateSiteSettings,
    initialFormState
  );

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
        label="Church Name (English)"
        name="churchName"
        defaultValue={settings.church_name ?? undefined}
        hint="Shown in the header, footer and browser tab. Leave empty to use the standard name, Lafto Mekaneyesus."
        errors={state.fieldErrors?.churchName}
      />

      <TextField
        label="Church Name (Amharic)"
        name="churchNameAm"
        defaultValue={settings.church_name_am ?? undefined}
        hint="Shown instead when a visitor switches the site to Amharic. Leave empty to use the standard Amharic name."
        errors={state.fieldErrors?.churchNameAm}
      />

      <TextField
        label="Telegram Group Link"
        name="telegramGroupUrl"
        defaultValue={settings.telegram_group_url ?? undefined}
        hint="For example https://t.me/+AbCdEfGh123. It appears in the footer and on the Contact page. Leave empty to hide the Telegram links."
        errors={state.fieldErrors?.telegramGroupUrl}
      />

      <TextField
        label="Default Page Title (SEO)"
        name="seoDefaultTitle"
        defaultValue={settings.seo_default_title ?? undefined}
        hint="The home page title in browser tabs and Google. About 60 characters works best. Leave empty to use the standard title."
        errors={state.fieldErrors?.seoDefaultTitle}
      />

      <TextAreaField
        label="Default Description (SEO)"
        name="seoDefaultDescription"
        rows={3}
        defaultValue={settings.seo_default_description ?? undefined}
        hint="Shown by search engines and in link previews on Telegram and WhatsApp. About 150 characters works best. Leave empty to use the standard text."
        errors={state.fieldErrors?.seoDefaultDescription}
      />

      <SubmitButton>Save Site Settings</SubmitButton>
    </form>
  );
}