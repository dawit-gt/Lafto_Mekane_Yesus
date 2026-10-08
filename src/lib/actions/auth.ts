"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "@/lib/actions/state";

const credentialsSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

/**
 * Signs in, then checks for an admin_users row. Both admins and regular
 * members are just Supabase Auth users under the hood (Sec. 3) — the
 * admin_users table is what actually grants Admin access, so a member
 * account that mistakenly tries this form is signed back out with a clear
 * message instead of landing in the Admin area.
 */
export async function signInAdmin(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please enter a valid email and password.",
    };
  }

  const supabase = await createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword(parsed.data);

  if (signInError || !signInData.user) {
    return {
      status: "error",
      message: "Incorrect email or password.",
    };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", signInData.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This account doesn't have Admin access.",
    };
  }

  redirect("/admin/dashboard");
}

/** Members only need a valid Supabase Auth session — no extra role check. */
export async function signInMember(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please enter a valid email and password.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: "Incorrect email or password.",
    };
  }

  redirect("/members");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}