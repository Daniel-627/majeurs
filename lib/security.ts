import { createHmac } from "crypto";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

// Vercel sets x-forwarded-for itself, so the first entry can be trusted there.
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// We never store raw IP addresses — only a keyed hash, which is enough to
// count "how many requests came from the same place" without being able to
// recover who it was.
export function hashIp(ip: string): string {
  const key = process.env.SUPABASE_SECRET_KEY ?? "majeurs-fallback-key";
  return createHmac("sha256", key).update(ip).digest("hex").slice(0, 32);
}

// Trims, strips control characters, and caps length. Returns null if empty.
export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}
