import { clerkClient } from "@clerk/nextjs/server";
import { isLanguage } from "@/lib/i18n";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.email(),
  locale: z.string().min(2),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>;

  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isLanguage(body.locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [body.email],
      limit: 1,
    });

    const user = users.data[0];
    if (!user) {
      return NextResponse.json({ saved: false });
    }

    await client.users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        locale: body.locale,
      },
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Failed to save verification locale:", error);
    return NextResponse.json({ error: "Failed to save locale" }, { status: 500 });
  }
}
