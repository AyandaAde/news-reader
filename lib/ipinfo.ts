import { getIpInfoToken } from "@/env";

export type IpLocation = {
  ip: string;
  city: string;
  region: string;
  country: string;
  label: string;
  lat: number;
  lon: number;
  postal?: string;
  timezone?: string;
};

type IpInfoResponse = {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  postal?: string;
  timezone?: string;
  error?: { title?: string; message?: string };
};

function formatLocationLabel(city: string, region: string, country: string) {
  if (city && region) {
    return `${city}, ${region}`;
  }

  return [city, region, country].filter(Boolean).join(", ");
}

function parseCoordinates(loc?: string) {
  if (!loc) {
    return null;
  }

  const [latRaw, lonRaw] = loc.split(",");
  const lat = Number.parseFloat(latRaw ?? "");
  const lon = Number.parseFloat(lonRaw ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon };
}

export async function lookupCoordinatesLocation(
  lat: number,
  lon: number,
): Promise<IpLocation | null> {
  const token = getIpInfoToken();
  if (!token) {
    console.error("IPINFO_TOKEN or IP_INFO_API_KEY is not set");
    return null;
  }

  const url = new URL(
    `https://ipinfo.io/${encodeURIComponent(`${lat},${lon}`)}/json`,
  );
  url.searchParams.set("token", token);

  let payload: IpInfoResponse;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        "IPInfo coordinate lookup failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    payload = (await response.json()) as IpInfoResponse;
  } catch (error) {
    console.error("IPInfo coordinate lookup error:", error);
    return null;
  }

  if (payload.error) {
    console.error("IPInfo coordinate lookup error:", payload.error);
    return null;
  }

  const coordinates = parseCoordinates(payload.loc) ?? { lat, lon };
  const city = payload.city?.trim() ?? "";
  const region = payload.region?.trim() ?? "";
  const country = payload.country?.trim() ?? "";

  if (!city && !region && !country) {
    return null;
  }

  return {
    ip: payload.ip ?? "",
    city,
    region,
    country,
    label: formatLocationLabel(city, region, country),
    lat: coordinates.lat,
    lon: coordinates.lon,
    postal: payload.postal?.trim() || undefined,
    timezone: payload.timezone?.trim() || undefined,
  };
}

export async function lookupIpLocation(ip: string): Promise<IpLocation | null> {
  const token = getIpInfoToken();
  if (!token) {
    console.error("IPINFO_TOKEN or IP_INFO_API_KEY is not set");
    return null;
  }

  const url = new URL(`https://ipinfo.io/${encodeURIComponent(ip)}/json`);
  url.searchParams.set("token", token);

  let payload: IpInfoResponse;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("IPInfo lookup failed:", response.status, await response.text());
      return null;
    }

    payload = (await response.json()) as IpInfoResponse;
  } catch (error) {
    console.error("IPInfo lookup error:", error);
    return null;
  }

  if (payload.error) {
    console.error("IPInfo lookup error:", payload.error);
    return null;
  }

  const coordinates = parseCoordinates(payload.loc);
  const city = payload.city?.trim() ?? "";
  const region = payload.region?.trim() ?? "";
  const country = payload.country?.trim() ?? "";

  if (!coordinates || (!city && !region && !country)) {
    return null;
  }

  return {
    ip: payload.ip ?? ip,
    city,
    region,
    country,
    label: formatLocationLabel(city, region, country),
    lat: coordinates.lat,
    lon: coordinates.lon,
    postal: payload.postal?.trim() || undefined,
    timezone: payload.timezone?.trim() || undefined,
  };
}
