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
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number so we can reach you.")
    .max(40)
    .regex(/^[0-9+()\-\s]+$/, "Use only digits, spaces, + ( ) and -."),
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
    phone: formData.get("phone"),
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
      phone: parsed.data.phone,
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