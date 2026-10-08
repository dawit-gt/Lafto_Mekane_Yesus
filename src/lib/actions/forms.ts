"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/actions/state";

/**
 * Honeypot check: every form below has a hidden "company" field that a real
 * visitor never sees or fills in (see forms/HoneypotField.tsx). If it comes
 * back non-empty, a bot filled it in — we silently report success without
 * writing to the database. This is a zero-cost first line of defense;
 * swapping in Cloudflare Turnstile later just means checking a token here
 * instead of this field.
 */
function isBot(formData: FormData): boolean {
  return String(formData.get("company") ?? "").trim().length > 0;
}

// ---------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------
const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please enter a message.").max(4000),
});

export async function submitContactMessage(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) {
    return { status: "success", message: "Thanks — your message has been sent." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    if (error) throw error;
    return { status: "success", message: "Thanks — your message has been sent. We'll be in touch soon." };
  } catch (err) {
    console.error("submitContactMessage failed:", err);
    return { status: "error", message: "Something went wrong on our end. Please try again in a moment." };
  }
}

// ---------------------------------------------------------------------
// Prayer requests
// ---------------------------------------------------------------------
const prayerSchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
  isConfidential: z.boolean(),
  requestText: z.string().trim().min(1, "Please share your prayer request.").max(4000),
});

export async function submitPrayerRequest(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) {
    return { status: "success", message: "Thank you — your request has been shared with our prayer team." };
  }

  const parsed = prayerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    isConfidential: formData.get("isConfidential") === "on",
    requestText: formData.get("requestText"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("prayer_requests").insert({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      is_confidential: parsed.data.isConfidential,
      request_text: parsed.data.requestText,
    });
    if (error) throw error;
    return { status: "success", message: "Thank you — your request has been shared with our prayer team." };
  } catch (err) {
    console.error("submitPrayerRequest failed:", err);
    return { status: "error", message: "Something went wrong on our end. Please try again in a moment." };
  }
}

// ---------------------------------------------------------------------
// Volunteer interest
// ---------------------------------------------------------------------
const volunteerSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  ministryInterest: z.string().trim().max(200).optional().or(z.literal("")),
  availabilityNote: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function submitVolunteerRequest(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (isBot(formData)) {
    return { status: "success", message: "Thanks for your interest — someone will follow up with you soon." };
  }

  const parsed = volunteerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    ministryInterest: formData.get("ministryInterest"),
    availabilityNote: formData.get("availabilityNote"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("volunteer_requests").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      ministry_interest: parsed.data.ministryInterest || null,
      availability_note: parsed.data.availabilityNote || null,
    });
    if (error) throw error;
    return { status: "success", message: "Thanks for your interest — someone will follow up with you soon." };
  } catch (err) {
    console.error("submitVolunteerRequest failed:", err);
    return { status: "error", message: "Something went wrong on our end. Please try again in a moment." };
  }
}