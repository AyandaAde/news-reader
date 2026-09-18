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
  if (token) {
    const url = new URL(
      `https://ipinfo.io/${encodeURIComponent(`${lat},${lon}`)}/json`,
    );
    url.searchParams.set("token", token);

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      });

      if (response.ok) {
        const payload = (await response.json()) as IpInfoResponse;

        if (!payload.error) {
          const coordinates = parseCoordinates(payload.loc) ?? { lat, lon };
          const city = payload.city?.trim() ?? "";
          const region = payload.region?.trim() ?? "";
          const country = payload.country?.trim() ?? "";

          if (city || region || country) {
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
        }
      } else {
        console.error(
          "IPInfo coordinate lookup failed:",
          response.status,
          await response.text(),
        );
      }
    } catch (error) {
      console.error("IPInfo coordinate lookup error:", error);
    }
  } else {
    console.error("IPINFO_TOKEN or IP_INFO_API_KEY is not set");
  }

  return lookupCoordinatesLocationViaNominatim(lat, lon);
}

async function lookupCoordinatesLocationViaNominatim(
  lat: number,
  lon: number,
): Promise<IpLocation | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "10");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
        "User-Agent": "EiloNewsReader/1.0 (weather-location; contact=support@eilo.app)",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        "Nominatim coordinate lookup failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    const payload = (await response.json()) as {
      name?: string;
      display_name?: string;
      address?: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        region?: string;
        country?: string;
      };
    };

    const city =
      payload.address?.city?.trim() ||
      payload.address?.town?.trim() ||
      payload.address?.village?.trim() ||
      payload.address?.municipality?.trim() ||
      payload.name?.trim() ||
      "";
    const region =
      payload.address?.state?.trim() ||
      payload.address?.region?.trim() ||
      "";
    const country = payload.address?.country?.trim() || "";

    if (!city && !region && !country) {
      return null;
    }

    return {
      ip: "",
      city,
      region,
      country,
      label: formatLocationLabel(city, region, country),
      lat,
      lon,
    };
  } catch (error) {
    console.error("Nominatim coordinate lookup error:", error);
    return null;
  }
}

export async function lookupPlaceLocation(
  query: string,
): Promise<IpLocation | null> {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", trimmed);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "1");

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
        "User-Agent": "EiloNewsReader/1.0 (weather-location; contact=support@eilo.app)",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(
        "Nominatim place lookup failed:",
        response.status,
        await response.text(),
      );
      return null;
    }

    const payload = (await response.json()) as Array<{
      lat?: string;
      lon?: string;
      name?: string;
      address?: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        region?: string;
        country?: string;
        postcode?: string;
      };
    }>;

    const match = payload[0];
    if (!match) {
      return null;
    }

    const lat = Number.parseFloat(match.lat ?? "");
    const lon = Number.parseFloat(match.lon ?? "");
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    const city =
      match.address?.city?.trim() ||
      match.address?.town?.trim() ||
      match.address?.village?.trim() ||
      match.address?.municipality?.trim() ||
      match.name?.trim() ||
      trimmed.split(",")[0]?.trim() ||
      "";
    const region =
      match.address?.state?.trim() ||
      match.address?.region?.trim() ||
      "";
    const country = match.address?.country?.trim() || "";

    if (!city && !region && !country) {
      return null;
    }

    return {
      ip: "",
      city,
      region,
      country,
      label: formatLocationLabel(city, region, country) || trimmed,
      lat,
      lon,
      postal: match.address?.postcode?.trim() || undefined,
    };
  } catch (error) {
    console.error("Nominatim place lookup error:", error);
    return null;
  }
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
