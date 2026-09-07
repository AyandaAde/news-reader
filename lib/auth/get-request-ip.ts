import type { NextRequest } from "next/server";

function normalizeIp(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice(7);
  }

  return trimmed;
}

function isPrivateIp(ip: string) {
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }

  if (ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return true;
  }

  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) {
    return true;
  }

  return false;
}

export function getRequestIp(req: NextRequest) {
  const forwarded = normalizeIp(req.headers.get("x-forwarded-for"));
  if (forwarded) {
    const first = normalizeIp(forwarded.split(",")[0] ?? null);
    if (first && !isPrivateIp(first)) {
      return first;
    }
  }

  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-client-ip"),
  ];

  for (const candidate of candidates) {
    const ip = normalizeIp(candidate);
    if (ip && !isPrivateIp(ip))return ip;
  }

  return null;
}
