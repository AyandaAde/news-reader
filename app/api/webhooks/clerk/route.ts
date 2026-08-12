import { sendEmail } from "@/lib/emails/mailer";
import { resolveVerificationLocale } from "@/lib/emails/resolve-verification-locale";
import {
  getVerificationEmailSubject,
  getVerificationFlowFromSlug,
  renderVerificationEmail,
  renderVerificationEmailText,
} from "@/lib/emails/verification-email";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

const VERIFICATION_CODE_SLUGS = new Set([
  "verification_code",
  "sign_in_code",
  "sign_up_code",
]);

type ClerkEmailData = {
  slug?: string | null;
  to_email_address?: string | null;
  data?: {
    otp_code?: string | null;
    otp?: string | null;
    code?: string | null;
    otpCode?: string | null;
    first_name?: string | null;
    [key: string]: unknown;
  } | null;
  user?: {
    unsafe_metadata?: { locale?: string | null } | null;
    public_metadata?: { locale?: string | null } | null;
  } | null;
};

function readOtpCode(data: ClerkEmailData) {
  const nested = data.data ?? {};
  const candidates = [nested.otp_code, nested.otp, nested.code, nested.otpCode];

  for (const value of candidates) if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
}

function isVerificationEmailSlug(slug: string) {
  if (VERIFICATION_CODE_SLUGS.has(slug)) {
    return true;
  }

  return /verification|sign[_-]?in|sign[_-]?up/i.test(slug);
}

async function handleEmailCreated(data: ClerkEmailData) {
  const slug = data.slug ?? "";
  const to = data.to_email_address ?? "";
  const otpCode = readOtpCode(data);

  if (!isVerificationEmailSlug(slug) || !to || !otpCode) {
    console.error("Clerk webhook: verification email skipped", {
      slug,
      hasTo: Boolean(to),
      hasOtp: Boolean(otpCode),
    });
    return new NextResponse("Ignored email event", { status: 200 });
  }

  const firstName = data.data?.first_name ?? undefined;
  const flow = getVerificationFlowFromSlug(slug);
  const locale = resolveVerificationLocale({ clerkUser: data.user });

  await sendEmail({
    to,
    subject: getVerificationEmailSubject(locale),
    html: renderVerificationEmail({ otpCode, firstName, flow, locale }),
    text: renderVerificationEmailText({ otpCode, flow, locale }),
  });

  return new NextResponse("Verification email sent", { status: 200 });
}

export async function POST(req: NextRequest) {
  const signingSecret = process.env.CLERK_SIGNING_SECRET;

  if (!signingSecret) {
    console.error("Clerk webhook failed: CLERK_SIGNING_SECRET is not set");
    return new NextResponse("Missing CLERK_SIGNING_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const body = await req.text();
  const webhook = new Webhook(signingSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new NextResponse("Unable to verify webhook", { status: 400 });
  }

  const eventName = String(event.type);

  try {
    if (eventName === "email.created" || eventName === "emails.created") {
      return handleEmailCreated(event.data as unknown as ClerkEmailData);
    }

    return new NextResponse("Webhook successfully processed", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook handler failed:", error);
    return new NextResponse("Error handling webhook", { status: 500 });
  }
}
