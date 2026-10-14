"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
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

      <fieldset className="space-y-5 rounded-sm border border-line p-4">
        <legend className="px-2 text-sm font-semibold text-forest">Home page banner</legend>

        <ImageUploadField
          label="Banner picture (optional)"
          name="heroImageUrl"
          defaultValue={settings.hero_image_url}
          hint="A wide photo of the church or congregation works best. It is shown behind the banner text with a blue tint so the words stay readable."
          errors={state.fieldErrors?.heroImageUrl}
        />

        <TextField
          label="Banner Heading (English)"
          name="heroTitle"
          defaultValue={settings.hero_title ?? undefined}
          hint="Leave empty to use: A place to belong, a place to grow in faith."
          errors={state.fieldErrors?.heroTitle}
        />

        <TextAreaField
          label="Banner Text (English)"
          name="heroText"
          rows={3}
          defaultValue={settings.hero_text ?? undefined}
          hint="One or two sentences under the heading. Leave empty to use the standard text."
          errors={state.fieldErrors?.heroText}
        />

        <TextField
          label="Banner Heading (Amharic)"
          name="heroTitleAm"
          defaultValue={settings.hero_title_am ?? undefined}
          hint="Shown when a visitor switches to Amharic. If empty, the English heading is shown."
          errors={state.fieldErrors?.heroTitleAm}
        />

        <TextAreaField
          label="Banner Text (Amharic)"
          name="heroTextAm"
          rows={3}
          defaultValue={settings.hero_text_am ?? undefined}
          hint="If empty, the English text is shown."
          errors={state.fieldErrors?.heroTextAm}
        />
      </fieldset>

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