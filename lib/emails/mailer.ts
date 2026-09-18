import { env } from "@/env";
import { getEmailLogoAttachments } from "@/lib/emails/email-brand";
import nodemailer, { type Transporter } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

type SmtpTarget = {
  host: string;
  port: number;
  secure: boolean;
};

let cachedTransporter: Transporter | null = null;
let cachedTargetKey = "";

function targetKey(target: SmtpTarget) {
  return `${target.host}:${target.port}:${target.secure ? "ssl" : "starttls"}`;
}

function isRetryableSmtpError(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const command =
    error && typeof error === "object" && "command" in error
      ? String((error as { command?: unknown }).command)
      : "";
  const message = error instanceof Error ? error.message : String(error);

  return (
    [
      "ETIMEDOUT",
      "ECONNREFUSED",
      "ESOCKET",
      "ECONNRESET",
      "EHOSTUNREACH",
      "ETLS",
      "EDNS",
    ].includes(code) ||
    command === "CONN" ||
    /greeting never received|connection timeout|socket closed/i.test(message)
  );
}

function resolvePrimaryTarget(): SmtpTarget {
  const host = env.SMTP_HOST ?? "securemail.webnames.ca";
  const port = env.SMTP_PORT ?? 587;
  // Webnames documents 587/465 with SSL enabled (implicit TLS), not STARTTLS.
  const secure = env.SMTP_SECURE ?? port !== 25;

  return { host, port, secure };
}

function getSendTargets(): SmtpTarget[] {
  const primary = resolvePrimaryTarget();
  const seen = new Set<string>();
  const targets: SmtpTarget[] = [];

  for (const target of [
    primary,
    { host: primary.host, port: 587, secure: true },
    { host: primary.host, port: 587, secure: false },
    { host: primary.host, port: 465, secure: true },
  ]) {
    const key = targetKey(target);
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push(target);
  }

  return targets;
}

function createTransporter(target: SmtpTarget) {
  const options: SMTPTransport.Options = {
    host: target.host,
    port: target.port,
    secure: target.secure,
    requireTLS: !target.secure,
    name: target.host,
    family: 4,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
    connectionTimeout: 6_000,
    greetingTimeout: 6_000,
    socketTimeout: 15_000,
    tls: {
      servername: target.host,
      minVersion: "TLSv1.2",
      rejectUnauthorized: false,
    },
  };

  return nodemailer.createTransport(options);
}

function getTransporter(target: SmtpTarget) {
  const key = targetKey(target);
  if (cachedTransporter && cachedTargetKey === key) return cachedTransporter;

  cachedTransporter?.close();
  cachedTransporter = createTransporter(target);
  cachedTargetKey = key;
  return cachedTransporter;
}

function clearTransporter() {
  cachedTransporter?.close();
  cachedTransporter = null;
  cachedTargetKey = "";
}

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments = [],
}: SendEmailParams) {
  const mail = {
    from: `"Eilo" <${env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
    attachments: [...getEmailLogoAttachments(), ...attachments],
  };

  const targets =
    process.env.NODE_ENV === "development"
      ? getSendTargets().slice(0, 1)
      : getSendTargets();
  let lastError: unknown;

  for (const [index, target] of targets.entries()) {
    try {
      await getTransporter(target).sendMail(mail);
      return;
    } catch (error) {
      lastError = error;
      clearTransporter();
      console.error(`SMTP send failed via ${targetKey(target)}`, error);

      const canRetry = isRetryableSmtpError(error) && index < targets.length - 1;
      if (!canRetry) break;
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[dev] SMTP unavailable; email to ${to} was not sent.\nSubject: ${subject}\n${text ?? "(html only)"}`,
    );
    return;
  }

  throw lastError instanceof Error ? lastError : new Error("SMTP send failed");
}
