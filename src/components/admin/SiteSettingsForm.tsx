"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-settings";
import { initialFormState } from "@/lib/actions/state";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RepeatableRows } from "@/components/admin/RepeatableRows";
import { toPhones } from "@/lib/utils/contact-lists";
import { defaultLegalMarkdown } from "@/lib/legal-defaults";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import type { SiteSettings } from "@/types/database";

export type SiteTab = "general" | "home" | "about" | "legal" | "seo";

/**
 * One form with all the site settings, shown a tab at a time. Every tab's fields
 * stay in the page (the other tabs are only hidden), so Save always sends everything
 * and nothing is lost when you move between tabs.
 */
export function SiteSettingsForm({ settings, tab }: { settings: SiteSettings; tab: SiteTab }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialFormState);

  return (
    <form action={formAction} className="space-y-5">
      <FormStatusBanner state={state} />

      <div hidden={tab !== "general"} className="space-y-5">
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

        <RepeatableRows
          legend="Phone Numbers"
          hint="Shown on the public Contact page. The name is optional, e.g. Church Office or Pastor."
          addLabel="Add phone number"
          emptyNote="No phone numbers yet."
          initial={toPhones(settings.contact_phones).map((p) => ({
            phoneName: p.name,
            phoneNumber: p.number,
          }))}
          fields={[
            { name: "phoneName", label: "Name (optional)", placeholder: "Church Office" },
            { name: "phoneNumber", label: "Phone number", placeholder: "+251 91 123 4567", inputMode: "tel" },
          ]}
          errors={state.fieldErrors?.contactPhones}
        />
      </div>

      <div hidden={tab !== "home"} className="space-y-5">
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

        <div className="space-y-5 border-t border-line pt-5">
          <div>
            <p className="text-sm font-medium text-ink">Welcome message</p>
            <p className="mt-1 text-xs text-ink/60">
              A welcome note shown under the banner on the Home page, for example from the pastor.
              It is only shown when the English text below is filled in. You can use **bold**,
              *italic* and [links](https://example.org).
            </p>
          </div>

          <TextField
            label="Welcome Heading (English)"
            name="welcomeTitle"
            defaultValue={settings.welcome_title ?? undefined}
            hint="Leave empty to use: Welcome"
            errors={state.fieldErrors?.welcomeTitle}
          />
          <TextAreaField
            label="Welcome Message (English)"
            name="welcomeText"
            rows={7}
            defaultValue={settings.welcome_text ?? undefined}
            hint="Leave empty to hide the welcome section."
            errors={state.fieldErrors?.welcomeText}
          />
          <TextField
            label="Signed by (English)"
            name="welcomeSignature"
            defaultValue={settings.welcome_signature ?? undefined}
            hint="Optional, for example: Pastor Name, Senior Pastor"
            errors={state.fieldErrors?.welcomeSignature}
          />
          <ImageUploadField
            label="Welcome picture (optional)"
            name="welcomeImageUrl"
            defaultValue={settings.welcome_image_url}
            hint="For example a photo of the pastor or the congregation."
            errors={state.fieldErrors?.welcomeImageUrl}
          />

          <TextField
            label="Welcome Heading (Amharic)"
            name="welcomeTitleAm"
            defaultValue={settings.welcome_title_am ?? undefined}
            hint="Shown when a visitor switches to Amharic. If empty, the standard Amharic heading is used."
            errors={state.fieldErrors?.welcomeTitleAm}
          />
          <TextAreaField
            label="Welcome Message (Amharic)"
            name="welcomeTextAm"
            rows={7}
            defaultValue={settings.welcome_text_am ?? undefined}
            hint="If empty, the English message is shown."
            errors={state.fieldErrors?.welcomeTextAm}
          />
          <TextField
            label="Signed by (Amharic)"
            name="welcomeSignatureAm"
            defaultValue={settings.welcome_signature_am ?? undefined}
            hint="If empty, the English signature is shown."
            errors={state.fieldErrors?.welcomeSignatureAm}
          />
        </div>
      </div>

      <div hidden={tab !== "about"} className="space-y-5">
        <p className="text-xs text-ink/60">
          Leave a box empty to keep the standard text. You can use **bold**, *italic* and
          [links](https://example.org) in Mission and Denomination.
        </p>

        <TextAreaField
          label="About Us (English)"
          name="aboutIntro"
          rows={3}
          defaultValue={settings.about_intro ?? undefined}
          hint="The short introduction in the blue banner at the top."
          errors={state.fieldErrors?.aboutIntro}
        />
        <TextAreaField
          label="Our Mission (English)"
          name="aboutMission"
          rows={5}
          defaultValue={settings.about_mission ?? undefined}
          errors={state.fieldErrors?.aboutMission}
        />
        <TextAreaField
          label="Our Denomination (English)"
          name="aboutDenomination"
          rows={5}
          defaultValue={settings.about_denomination ?? undefined}
          errors={state.fieldErrors?.aboutDenomination}
        />

        <TextAreaField
          label="About Us (Amharic)"
          name="aboutIntroAm"
          rows={3}
          defaultValue={settings.about_intro_am ?? undefined}
          hint="Shown in Amharic. If empty, the English text is shown."
          errors={state.fieldErrors?.aboutIntroAm}
        />
        <TextAreaField
          label="Our Mission (Amharic)"
          name="aboutMissionAm"
          rows={5}
          defaultValue={settings.about_mission_am ?? undefined}
          errors={state.fieldErrors?.aboutMissionAm}
        />
        <TextAreaField
          label="Our Denomination (Amharic)"
          name="aboutDenominationAm"
          rows={5}
          defaultValue={settings.about_denomination_am ?? undefined}
          errors={state.fieldErrors?.aboutDenominationAm}
        />
      </div>

      <div className={tab === "legal" ? "space-y-5" : "hidden"}>
        <p className="text-xs text-ink/60">
          These are the Privacy, Terms and Accessibility pages linked in the footer. The standard
          wording is filled in so you can change it. You can use ## for headings, - for list
          items, **bold** and [links](https://example.org). Clear a box and save to go back to the
          standard wording.
        </p>

        <TextAreaField
          label="Privacy Policy"
          name="privacyMd"
          rows={14}
          defaultValue={settings.privacy_md ?? defaultLegalMarkdown("privacy")}
          errors={state.fieldErrors?.privacyMd}
        />
        <TextAreaField
          label="Terms of Use"
          name="termsMd"
          rows={14}
          defaultValue={settings.terms_md ?? defaultLegalMarkdown("terms")}
          errors={state.fieldErrors?.termsMd}
        />
        <TextAreaField
          label="Accessibility"
          name="accessibilityMd"
          rows={14}
          defaultValue={settings.accessibility_md ?? defaultLegalMarkdown("accessibility")}
          errors={state.fieldErrors?.accessibilityMd}
        />
        <TextField
          label="Last updated (shown on the pages)"
          name="legalLastUpdated"
          defaultValue={settings.legal_last_updated ?? undefined}
          hint="For example 15 October 2026. Update it whenever you change the wording."
          errors={state.fieldErrors?.legalLastUpdated}
        />
      </div>

      <div hidden={tab !== "seo"} className="space-y-5">
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
      </div>

      <SubmitButton>Save Site Settings</SubmitButton>
    </form>
  );
}