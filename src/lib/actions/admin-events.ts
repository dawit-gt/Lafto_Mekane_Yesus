"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { zonedDateTimeToUtcIso } from "@/lib/utils/timezone";
import type { FormState } from "@/lib/actions/state";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  startAtLocal: z.string().min(1, "Start date/time is required."),
  endAtLocal: z.string().optional().or(z.literal("")),
  timezone: z.string().min(1),
  locationId: z.string().uuid().optional().or(z.literal("")),
  ministryId: z.string().uuid().optional().or(z.literal("")),
  registrationUrl: z.string().trim().url("Enter a valid URL.").optional().or(z.literal("")),
  imageUrl: z.string().trim().url("Invalid picture link.").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

/** Records who changed what, for the Admin audit log (Sec. 11/14). */
async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  action: string,
  recordId: string | null,
  details?: Record<string, unknown>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action,
    table_name: "events",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseEventForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    startAtLocal: formData.get("startAtLocal"),
    endAtLocal: formData.get("endAtLocal"),
    timezone: formData.get("timezone"),
    locationId: formData.get("locationId"),
    ministryId: formData.get("ministryId"),
    registrationUrl: formData.get("registrationUrl"),
    imageUrl: formData.get("imageUrl") ?? "",
    status: formData.get("status"),
  });
}

export async function createEvent(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: d.title,
        slug: d.slug,
        description: d.description || null,
        start_at: zonedDateTimeToUtcIso(d.startAtLocal, d.timezone),
        end_at: d.endAtLocal ? zonedDateTimeToUtcIso(d.endAtLocal, d.timezone) : null,
        timezone: d.timezone,
        location_id: d.locationId || null,
        ministry_id: d.ministryId || null,
        registration_url: d.registrationUrl || null,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .select("id")
      .single();

    if (error) throw error;

    await logAudit(supabase, "create", data.id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("createEvent failed:", err);
    return { status: "error", message: "Something went wrong saving this event. Please try again." };
  }

  revalidatePath("/admin/content/events");
  revalidatePath("/events");
  redirect("/admin/content/events");
}

export async function updateEvent(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("events")
      .update({
        title: d.title,
        slug: d.slug,
        description: d.description || null,
        start_at: zonedDateTimeToUtcIso(d.startAtLocal, d.timezone),
        end_at: d.endAtLocal ? zonedDateTimeToUtcIso(d.endAtLocal, d.timezone) : null,
        timezone: d.timezone,
        location_id: d.locationId || null,
        ministry_id: d.ministryId || null,
        registration_url: d.registrationUrl || null,
        image_url: d.imageUrl || null,
        status: d.status,
      })
      .eq("id", id);

    if (error) throw error;

    await logAudit(supabase, "update", id, { title: d.title, status: d.status });
  } catch (err) {
    console.error("updateEvent failed:", err);
    return { status: "error", message: "Something went wrong saving this event. Please try again." };
  }

  revalidatePath("/admin/content/events");
  revalidatePath("/events");
  redirect("/admin/content/events");
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("deleteEvent failed:", error);
    return;
  }
  await logAudit(supabase, "delete", id);
  revalidatePath("/admin/content/events");
  revalidatePath("/events");
}