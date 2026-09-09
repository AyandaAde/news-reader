import type { NextRequest } from "next/server";

function normalizeIp(value: string | null): string | null {
  if (!value) return null;

  let ip = value.trim();

  if (!ip) return null;

  if (ip.toLowerCase().startsWith("::ffff:")) ip = ip.slice(7);


  if (ip.startsWith("[") && ip.endsWith("]")) ip = ip.slice(1, -1);

  return ip;
}

function isPrivateIp(ip: string): boolean {
  const normalized = ip.toLowerCase().trim();

  if (normalized === "::1") return true;

  if (
    normalized === "127.0.0.1" ||
    normalized.startsWith("127.")
  ) return true;

  if (
    normalized === "0.0.0.0" ||
    normalized === "::"
  ) return true;

  if (normalized.startsWith("10.")) return true;

  if (normalized.startsWith("192.168.")) return true;

  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;

  if (normalized.startsWith("169.254.")) {
    return true;
  }


  if (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  ) {
    return true;
  }

  return false;
}

function getFirstPublicIp(value: string | null): string | null {
  if (!value) return null;

  const ips = value
    .split(",")
    .map((ip) => normalizeIp(ip))
    .filter((ip): ip is string => Boolean(ip));

  for (const ip of ips) {
    if (!isPrivateIp(ip)) return ip;
  }

  return null;
}

export function getRequestIp(req: NextRequest): string | null {

  const cfConnectingIp = getFirstPublicIp(
    req.headers.get("cf-connecting-ip")
  );

  if (cfConnectingIp) {
    console.log("[getRequestIp] user IP:", cfConnectingIp);
    return cfConnectingIp;
  }

  const forwardedIp = getFirstPublicIp(
    req.headers.get("x-forwarded-for")
  );

  if (forwardedIp) {
    console.log("[getRequestIp] user IP:", forwardedIp);
    return forwardedIp;
  }

  const realIp = getFirstPublicIp(
    req.headers.get("x-real-ip")
  );

  if (realIp) {
    console.log("[getRequestIp] user IP:", realIp);
    return realIp;
  }

  const clientIp = getFirstPublicIp(
    req.headers.get("x-client-ip")
  );

  if (clientIp) {
    console.log("[getRequestIp] user IP:", clientIp);
    return clientIp;
  }

  console.log("[getRequestIp] no public IP available", {
    "x-forwarded-for": req.headers.get("x-forwarded-for"),
    "cf-connecting-ip": req.headers.get("cf-connecting-ip"),
    "x-real-ip": req.headers.get("x-real-ip"),
    "x-client-ip": req.headers.get("x-client-ip"),
  });

  return null;
}
