import { clerkClient } from "@clerk/nextjs/server";
import { buildDisplayName, readLoginLocation } from "@/lib/auth/clerk-user";
import { getAuthenticatedUserId } from "@/lib/auth/server-auth";
import { getRequestIp } from "@/lib/auth/get-request-ip";
import type { IpLocation } from "@/lib/ipinfo";
import { lookupIpLocation } from "@/lib/ipinfo";
import { provisionNewsReaderUser } from "@/lib/news-reader-api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    let location: IpLocation | null = readLoginLocation(
      user.unsafeMetadata as Record<string, unknown>,
    );

    if (!location) {
      const ip = getRequestIp(req);
      if (ip) {
        location = (await lookupIpLocation(ip)) ?? null;
      }
    }

    const displayName = buildDisplayName(user);
    const result = await provisionNewsReaderUser({
      clerkUserId: userId,
      email,
      displayName,
      avatarUrl: user.imageUrl,
      location,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to provision backend user" },
        { status: 502 },
      );
    }

    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        clerkUserId: userId,
        newsReaderUserId: result.userId,
        ...(location
          ? {
              loginLocation: {
                ...location,
                updatedAt: new Date().toISOString(),
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      saved: true,
      created: result.created,
      userId: result.userId,
      clerkUserId: result.clerkUserId ?? userId,
      location,
    });
  } catch (error) {
    console.error("Failed to provision backend user:", error);
    return NextResponse.json(
      { error: "Failed to provision backend user" },
      { status: 500 },
    );
  }
}
