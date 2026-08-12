import { getEmailLogoAttachments } from "@/lib/emails/email-brand";
import nodemailer, { type Transporter } from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

let cachedTransporter: Transporter | null = null;

function getEmailCredentials() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error("EMAIL_USER and EMAIL_PASSWORD must be set to send verification emails.");
  }

  return { user, pass };
}

function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { user, pass } = getEmailCredentials();

  cachedTransporter = nodemailer.createTransport({
    host: "securemail.webnames.ca",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return cachedTransporter;
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
  const { user } = getEmailCredentials();
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Eilo" <${user}>`,
    to,
    subject,
    html,
    text,
    attachments: [...getEmailLogoAttachments(), ...attachments],
  });
}
