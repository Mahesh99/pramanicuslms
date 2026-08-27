"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

function siteOriginFromHeaders(headerList: Headers): string | null {
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return null;

  const proto = headerList.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host.split(",")[0].trim()}`;
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: "Auth is not configured on this site." };
  }

  const origin = siteOriginFromHeaders(await headers());
  if (!origin) {
    return { error: "Could not determine site URL for the reset link." };
  }

  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}

export async function changePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to change your password." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true as const };
}
