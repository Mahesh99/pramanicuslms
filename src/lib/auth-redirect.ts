export function authCallbackUrl(next = "/dashboard") {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
