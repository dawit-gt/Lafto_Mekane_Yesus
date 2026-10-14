"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeTelegramUrl } from "@/lib/site-config";
import type { FormState } from "@/lib/actions/state";

const siteSettingsSchema = z.object({
  serviceTimesMd: z.string().trim().max(1000).optional().or(z.literal("")),
  seoDefaultTitle: z.string().trim().max(120).optional().or(z.literal("")),
  seoDefaultDescription: z.string().trim().max(300).optional().or(z.literal("")),
  aboutIntro: z.string().trim().max(800).optional().or(z.literal("")),
  aboutMission: z.string().trim().max(4000).optional().or(z.literal("")),
  aboutDenomination: z.string().trim().max(4000).optional().or(z.literal("")),
  aboutIntroAm: z.string().trim().max(800).optional().or(z.literal("")),
  aboutMissionAm: z.string().trim().max(4000).optional().or(z.literal("")),
  aboutDenominationAm: z.string().trim().max(4000).optional().or(z.literal("")),
  heroImageUrl: z.string().trim().url("Invalid picture link.").optional().or(z.literal("")),
  heroTitle: z.string().trim().max(120).optional().or(z.literal("")),
  heroText: z.string().trim().max(400).optional().or(z.literal("")),
  heroTitleAm: z.string().trim().max(120).optional().or(z.literal("")),
  heroTextAm: z.string().trim().max(400).optional().or(z.literal("")),
  churchName: z.string().trim().max(80).optional().or(z.literal("")),
  churchNameAm: z.string().trim().max(80).optional().or(z.literal("")),
  telegramGroupUrl: z
    .string()
    .trim()
    .max(300)
    .refine(
      (v) => v === "" || normalizeTelegramUrl(v) !== null,
      "Enter a Telegram link that starts with https://t.me/"
    )
    .optional(),
});

const givingSettingsSchema = z
  .object({
    isOnlineGivingEnabled: z.boolean(),
    providerName: z.string().trim().max(100).optional().or(z.literal("")),
    providerUrl: z
      .string()
      .trim()
      .url("Enter a valid URL.")
      .refine((v) => v.startsWith("https://"), "The link must start with https://")
      .optional()
      .or(z.literal("")),
    informationalNote: z.string().trim().min(1, "Please enter a note for visitors.").max(1000),
  })
  .superRefine((d, ctx) => {
    if (d.isOnlineGivingEnabled && !d.providerUrl) {
      ctx.addIssue({
        code: "custom",
        message: "Add the giving link before turning online giving on.",
        path: ["providerUrl"],
      });
    }
  });

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  tableName: string,
  details: Record<string, unknown>
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action: "update",
    table_name: tableName,
    record_id: null, // these tables use a fixed integer id, not a UUID
    details,
  });
}

export async function updateSiteSettings(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = siteSettingsSchema.safeParse({
    serviceTimesMd: formData.get("serviceTimesMd"),
    seoDefaultTitle: formData.get("seoDefaultTitle"),
    seoDefaultDescription: formData.get("seoDefaultDescription"),
    aboutIntro: formData.get("aboutIntro"),
    aboutMission: formData.get("aboutMission"),
    aboutDenomination: formData.get("aboutDenomination"),
    aboutIntroAm: formData.get("aboutIntroAm"),
    aboutMissionAm: formData.get("aboutMissionAm"),
    aboutDenominationAm: formData.get("aboutDenominationAm"),
    heroImageUrl: formData.get("heroImageUrl") ?? "",
    heroTitle: formData.get("heroTitle"),
    heroText: formData.get("heroText"),
    heroTitleAm: formData.get("heroTitleAm"),
    heroTextAm: formData.get("heroTextAm"),
    churchName: formData.get("churchName"),
    churchNameAm: formData.get("churchNameAm"),
    telegramGroupUrl: formData.get("telegramGroupUrl") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    // .select() lets us detect "0 rows updated" (row missing, or not an admin).
    const { data, error } = await supabase
      .from("site_settings")
      .update({
        service_times_md: d.serviceTimesMd || "",
        seo_default_title: d.seoDefaultTitle || null,
        seo_default_description: d.seoDefaultDescription || null,
        about_intro: d.aboutIntro || null,
        about_mission: d.aboutMission || null,
        about_denomination: d.aboutDenomination || null,
        about_intro_am: d.aboutIntroAm || null,
        about_mission_am: d.aboutMissionAm || null,
        about_denomination_am: d.aboutDenominationAm || null,
        hero_image_url: d.heroImageUrl || null,
        hero_title: d.heroTitle || null,
        hero_text: d.heroText || null,
        hero_title_am: d.heroTitleAm || null,
        hero_text_am: d.heroTextAm || null,
        church_name: d.churchName || null,
        church_name_am: d.churchNameAm || null,
        telegram_group_url: d.telegramGroupUrl || null,
      })
      .eq("id", 1)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No settings row was updated");

    await logAudit(supabase, user.id, "site_settings", { fields: Object.keys(d) });
  } catch (err) {
    console.error("updateSiteSettings failed:", err);
    return { status: "error", message: "Something went wrong saving these settings. Please try again." };
  }

  // Service times appear in the Footer (every page), Home, and Visit.
  revalidatePath("/", "layout");
  return { status: "success", message: "Site settings saved." };
}

export async function updateGivingSettings(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = givingSettingsSchema.safeParse({
    isOnlineGivingEnabled: formData.get("isOnlineGivingEnabled") === "on",
    providerName: formData.get("providerName"),
    providerUrl: formData.get("providerUrl"),
    informationalNote: formData.get("informationalNote"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { data, error } = await supabase
      .from("giving_settings")
      .update({
        is_online_giving_enabled: d.isOnlineGivingEnabled,
        provider_name: d.providerName || null,
        provider_url: d.providerUrl || null,
        informational_note: d.informationalNote,
      })
      .eq("id", 1)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No settings row was updated");

    await logAudit(supabase, user.id, "giving_settings", {
      online_giving_enabled: d.isOnlineGivingEnabled,
    });
  } catch (err) {
    console.error("updateGivingSettings failed:", err);
    return { status: "error", message: "Something went wrong saving these settings. Please try again." };
  }

  revalidatePath("/contact");
  return { status: "success", message: "Giving settings saved." };
}