"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

/** An optional numeric field that arrives from the form as a string ("" when left empty). */
function optionalCoordinate(min: number, max: number, label: string) {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max),
      `${label} must be a number between ${min} and ${max}.`
    );
}

const locationSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  addressLine1: z.string().trim().min(1, "Address is required.").max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required.").max(100),
  region: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().min(1, "Country is required.").max(100),
  latitude: optionalCoordinate(-90, 90, "Latitude"),
  longitude: optionalCoordinate(-180, 180, "Longitude"),
  directionsNote: z.string().trim().max(1000).optional().or(z.literal("")),
});

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  recordId: string | null,
  details?: Record<string, unknown>
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    table_name: "locations",
    record_id: recordId,
    details: details ?? null,
  });
}

function parseLocationForm(formData: FormData) {
  return locationSchema.safeParse({
    name: formData.get("name"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    directionsNote: formData.get("directionsNote"),
  });
}

function toRow(d: z.infer<typeof locationSchema>) {
  return {
    name: d.name,
    address_line1: d.addressLine1,
    address_line2: d.addressLine2 || null,
    city: d.city,
    region: d.region || null,
    postal_code: d.postalCode || null,
    country: d.country,
    latitude: d.latitude ? Number(d.latitude) : null,
    longitude: d.longitude ? Number(d.longitude) : null,
    directions_note: d.directionsNote || null,
  };
}

function revalidateLocationPages() {
  revalidatePath("/admin/content/locations");
  revalidatePath("/visit");
  revalidatePath("/contact");
}

export async function createLocation(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseLocationForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { data, error } = await supabase.from("locations").insert(toRow(d)).select("id").single();
    if (error) throw error;

    await logAudit(supabase, user.id, "create", data.id, { name: d.name });
  } catch (err) {
    console.error("createLocation failed:", err);
    return { status: "error", message: "Something went wrong saving this location. Please try again." };
  }

  revalidateLocationPages();
  redirect("/admin/content/locations");
}

export async function updateLocation(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseLocationForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const { error } = await supabase.from("locations").update(toRow(d)).eq("id", id);
    if (error) throw error;

    await logAudit(supabase, user.id, "update", id, { name: d.name });
  } catch (err) {
    console.error("updateLocation failed:", err);
    return { status: "error", message: "Something went wrong saving this location. Please try again." };
  }

  revalidateLocationPages();
  redirect("/admin/content/locations");
}

export async function deleteLocation(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) {
    console.error("deleteLocation failed:", error);
    return;
  }
  await logAudit(supabase, user.id, "delete", id);
  revalidateLocationPages();
}