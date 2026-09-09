import { auth } from "@clerk/nextjs/server";
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

const authOptions = { treatPendingAsSignedOut: false } as const;

type ClerkIdentity = {
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  metadata: Record<string, unknown>;
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
    if (fromCoordinates) return fromCoordinates;
  }

  const ip = getRequestIp(req);
  if (ip) {
    const fromIp = await lookupIpLocation(ip);
    if (fromIp) return fromIp;
  }

  return readLoginLocation(metadata);
}

function readSessionClaimString(
  claims: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!claims) {
    return null;
  }

  for (const key of keys) {
    const value = claims[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

async function resolveClerkIdentity(
  clerkUserId: string,
): Promise<ClerkIdentity | null> {
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return null;
    }

    return {
      email,
      displayName: buildDisplayName(clerkUser),
      avatarUrl: clerkUser.imageUrl,
      metadata: clerkUser.unsafeMetadata as Record<string, unknown>,
    };
  } catch (error) {
    console.warn("Clerk user lookup failed, falling back to session claims:", error);
  }

  const { sessionClaims } = await auth(authOptions);
  const claims = sessionClaims as Record<string, unknown> | undefined;
  const email = readSessionClaimString(claims, [
    "email",
    "primary_email_address",
    "primaryEmailAddress",
  ]);

  if (!email) {
    return null;
  }

  const firstName = readSessionClaimString(claims, ["first_name", "firstName"]);
  const lastName = readSessionClaimString(claims, ["last_name", "lastName"]);
  const fullName = readSessionClaimString(claims, ["name", "full_name", "fullName"]);
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    fullName ||
    readSessionClaimString(claims, ["username", "user_name", "userName"]);

  return {
    email,
    displayName,
    avatarUrl: readSessionClaimString(claims, ["image_url", "imageUrl", "picture"]),
    metadata: {},
  };
}

async function syncClerkLocationMetadata(
  clerkUserId: string,
  metadata: Record<string, unknown>,
  location: IpLocation,
) {
  try {
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
  } catch (error) {
    console.warn("Failed to sync Clerk location metadata:", error);
  }
}

export async function syncUserLocation(
  req: NextRequest,
  clerkUserId: string,
  coordinates?: UserCoordinates | null,
  options?: { forceUpdate?: boolean; explicitLocation?: IpLocation | null },
) {
  let user = await getNewsReaderUserByClerkId(clerkUserId);
  const clerkIdentity = await resolveClerkIdentity(clerkUserId);

  const location =
    options?.explicitLocation ??
    (await resolveUserLocation(req, clerkIdentity?.metadata, coordinates));

  const needsCreate = !user;
  const needsLocationUpdate =
    Boolean(location) &&
    (options?.forceUpdate || (user ? !userHasLocation(user) : true));

  if (needsCreate || needsLocationUpdate) {
    const email = clerkIdentity?.email ?? user?.email;

    if (!email) {
      return { location, user };
    }

    const result = await provisionNewsReaderUser({
      clerkUserId,
      email,
      displayName: clerkIdentity?.displayName ?? user?.displayName,
      avatarUrl: clerkIdentity?.avatarUrl ?? user?.avatarUrl,
      location,
    });

    if (result) {
      if (location && clerkIdentity) {
        await syncClerkLocationMetadata(
          clerkUserId,
          clerkIdentity.metadata,
          location,
        );
      }

      user = await getNewsReaderUserByClerkId(clerkUserId);
    }
  } else if (location && clerkIdentity) {
    await syncClerkLocationMetadata(
      clerkUserId,
      clerkIdentity.metadata,
      location,
    );
  }

  return { location, user };
}

export async function ensureBackendUser(
  req: NextRequest,
  clerkUserId: string,
): Promise<NewsReaderUser | null> {
  const existingUser = await getNewsReaderUserByClerkId(clerkUserId);
  if (existingUser) {
    return existingUser;
  }

  const { user } = await syncUserLocation(req, clerkUserId);
  return user;
}
