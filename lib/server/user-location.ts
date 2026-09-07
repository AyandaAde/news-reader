import { clerkClient } from "@clerk/nextjs/server";
import {
  buildDisplayName,
  readLoginLocation,
} from "@/lib/auth/clerk-user";
import { getRequestIp } from "@/lib/auth/get-request-ip";
import type { IpLocation } from "@/lib/ipinfo";
import { lookupCoordinatesLocation, lookupIpLocation } from "@/lib/ipinfo";
import {
  getNewsReaderUserByClerkId,
  provisionNewsReaderUser,
  type NewsReaderUser,
} from "@/lib/news-reader-api";
import type { NextRequest } from "next/server";

export type UserCoordinates = {
  lat: number;
  lon: number;
};

export function userHasLocation(user: NewsReaderUser) {
  return Boolean(
    user.locationLabel?.trim() ||
      user.locationCity?.trim() ||
      user.locationRegion?.trim() ||
      user.locationCountry?.trim(),
  );
}

export async function resolveUserLocation(
  req: NextRequest,
  metadata: Record<string, unknown> | undefined,
  coordinates?: UserCoordinates | null,
) {
  if (
    coordinates &&
    Number.isFinite(coordinates.lat) &&
    Number.isFinite(coordinates.lon)
  ) {
    const fromCoordinates = await lookupCoordinatesLocation(
      coordinates.lat,
      coordinates.lon,
    );
    if (fromCoordinates) {
      return fromCoordinates;
    }
  }

  const ip = getRequestIp(req);
  if (ip) {
    const fromIp = await lookupIpLocation(ip);
    if (fromIp) {
      return fromIp;
    }
  }

  return readLoginLocation(metadata);
}

async function syncClerkLocationMetadata(
  clerkUserId: string,
  metadata: Record<string, unknown>,
  location: IpLocation,
) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(clerkUserId, {
    unsafeMetadata: {
      ...metadata,
      loginLocation: {
        ...location,
        updatedAt: new Date().toISOString(),
      },
    },
  });
}

export async function syncUserLocation(
  req: NextRequest,
  clerkUserId: string,
  coordinates?: UserCoordinates | null,
  options?: { forceUpdate?: boolean },
) {
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);
  const metadata = clerkUser.unsafeMetadata as Record<string, unknown>;
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return { location: null, user: null };
  }

  const location = await resolveUserLocation(req, metadata, coordinates);
  let user = await getNewsReaderUserByClerkId(clerkUserId);
  const needsCreate = !user;
  const needsLocationUpdate =
    Boolean(location) &&
    (options?.forceUpdate || (user ? !userHasLocation(user) : true));

  if (needsCreate || needsLocationUpdate) {
    const result = await provisionNewsReaderUser({
      clerkUserId,
      email,
      displayName: buildDisplayName(clerkUser),
      avatarUrl: clerkUser.imageUrl,
      location,
    });

    if (result) {
      if (location) {
        await syncClerkLocationMetadata(clerkUserId, metadata, location);
      }
      user = await getNewsReaderUserByClerkId(clerkUserId);
    }
  } else if (location) {
    await syncClerkLocationMetadata(clerkUserId, metadata, location);
  }

  return { location, user };
}

export async function ensureBackendUser(
  req: NextRequest,
  clerkUserId: string,
): Promise<NewsReaderUser | null> {
  const { user } = await syncUserLocation(req, clerkUserId);
  return user;
}
