import type { Language } from "@/lib/i18n";
import {
  EMAIL_COLORS,
  renderEmailBrandLogo,
  renderEmailDocumentHead,
} from "@/lib/emails/email-brand";
import {
  getNewDeviceSignInEmailCopy,
  getNewDeviceSignInEmailSubject,
  interpolateCopy,
} from "@/lib/emails/new-device-sign-in-email-copy";

export type NewDeviceSignInDetails = {
  signInMethod?: string;
  deviceType?: string;
  browserName?: string;
  operatingSystem?: string;
  location?: string;
  ipAddress?: string;
  sessionCreatedAt?: string;
  revokeSessionUrl?: string;
  supportEmail?: string;
};

type NewDeviceSignInEmailParams = {
  locale?: Language;
  details: NewDeviceSignInDetails;
};

const COLORS = EMAIL_COLORS;

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function formatDeviceLabel(details: NewDeviceSignInDetails, unknownValue: string) {
  const parts = [
    readString(details.deviceType),
    readString(details.browserName),
    readString(details.operatingSystem),
  ].filter(Boolean);

  if (parts.length === 0) {
    return unknownValue;
  }

  const deviceType = readString(details.deviceType);
  const browserName = readString(details.browserName);
  const operatingSystem = readString(details.operatingSystem);

  if (deviceType && browserName && operatingSystem) {
    return `${deviceType} ${browserName} for ${operatingSystem}`;
  }

  return parts.join(" ");
}

function renderDetailRow(label: string, value: string, textAlign: "left" | "right") {
  return `
    <tr>
      <td style="padding:12px 16px; border-bottom:1px solid ${COLORS.borderSubtle}; font-size:13px; line-height:20px; color:${COLORS.onSurfaceVariant}; white-space:nowrap; vertical-align:top;">
        ${label}
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid ${COLORS.borderSubtle}; font-size:14px; line-height:20px; color:${COLORS.onSurface}; font-weight:600; text-align:${textAlign}; vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

export function parseNewDeviceSignInDetails(
  data: Record<string, unknown> | null | undefined,
): NewDeviceSignInDetails {
  const source = data ?? {};

  return {
    signInMethod: readString(source.sign_in_method),
    deviceType: readString(source.device_type),
    browserName: readString(source.browser_name),
    operatingSystem: readString(source.operating_system),
    location: readString(source.location),
    ipAddress: readString(source.ip_address),
    sessionCreatedAt: readString(source.session_created_at),
    revokeSessionUrl: readString(source.revoke_session_url),
    supportEmail: readString(source.support_email),
  };
}

export function renderNewDeviceSignInEmail({
  locale = "en",
  details,
}: NewDeviceSignInEmailParams) {
  const copy = getNewDeviceSignInEmailCopy(locale);
  const year = new Date().getFullYear();
  const textAlign = copy.dir === "rtl" ? "right" : "left";
  const copyright = interpolateCopy(copy.copyright, { year });
  const deviceLabel = formatDeviceLabel(details, copy.unknownValue);
  const supportEmail = details.supportEmail ?? process.env.EMAIL_USER ?? "";

  const detailRows = [
    details.signInMethod
      ? renderDetailRow(copy.signInTypeLabel, details.signInMethod, textAlign)
      : "",
    renderDetailRow(copy.deviceLabel, deviceLabel, textAlign),
    renderDetailRow(
      copy.locationLabel,
      details.location ?? copy.unknownValue,
      textAlign,
    ),
    renderDetailRow(
      copy.ipLabel,
      details.ipAddress ?? copy.unknownValue,
      textAlign,
    ),
    renderDetailRow(
      copy.timeLabel,
      details.sessionCreatedAt ?? copy.unknownValue,
      textAlign,
    ),
  ].join("");

  const revokeSection = details.revokeSessionUrl
    ? `
        <h2 style="margin:32px 0 8px 0; font-size:20px; line-height:28px; font-weight:600; color:${COLORS.onBackground}; text-align:${textAlign};">
          ${copy.unrecognizedTitle}
        </h2>
        <p style="margin:0 0 24px 0; font-size:14px; line-height:22px; color:${COLORS.onSurfaceVariant}; text-align:${textAlign};">
          ${copy.unrecognizedBody}
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 16px auto;">
          <tr>
            <td align="center" style="background-color:${COLORS.accent}; border-radius:8px;">
              <a href="${details.revokeSessionUrl}" style="display:inline-block; padding:12px 20px; font-size:14px; line-height:20px; font-weight:600; color:${COLORS.background}; text-decoration:none;">
                ${copy.signOutButton}
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0; font-size:13px; line-height:20px; color:${COLORS.outline}; text-align:${textAlign};">
          ${copy.signOutFallback}
          <a href="${details.revokeSessionUrl}" style="color:${COLORS.onSurfaceVariant}; text-decoration:underline;">${details.revokeSessionUrl}</a>
        </p>`
    : "";

  const supportSection =
    supportEmail &&
    `
        <p style="margin:24px 0 0 0; font-size:14px; line-height:22px; color:${COLORS.onSurfaceVariant}; text-align:${textAlign};">
          ${interpolateCopy(copy.supportBody, { supportEmail })}
        </p>`;

  return `<!DOCTYPE html>
<html lang="${copy.htmlLang}" dir="${copy.dir}">
  <head>
    ${renderEmailDocumentHead(copy.subject)}
  </head>
  <body class="email-bg" bgcolor="${COLORS.background}" style="margin:0; padding:0; background-color:${COLORS.background}; -webkit-font-smoothing:antialiased; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="${COLORS.background}" style="background-color:${COLORS.background};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" class="email-surface" width="600" cellpadding="0" cellspacing="0" bgcolor="${COLORS.surface}" style="max-width:600px; width:100%; background-color:${COLORS.surface}; border:1px solid ${COLORS.borderSubtle}; overflow:hidden;">
            <tr>
              <td class="email-surface" align="center" bgcolor="${COLORS.surface}" style="background-color:${COLORS.surface}; padding:40px 32px 24px 32px;">
                ${renderEmailBrandLogo({ variant: "header" })}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 48px 32px;" align="center">
                <h1 style="margin:0 0 16px 0; font-size:32px; line-height:40px; font-weight:600; letter-spacing:-0.01em; color:${COLORS.onBackground}; text-align:${textAlign};">
                  ${copy.title}
                </h1>
                <p style="margin:0 auto 32px auto; max-width:480px; font-size:16px; line-height:24px; color:${COLORS.onSurfaceVariant}; text-align:${textAlign};">
                  ${copy.intro}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-surface-secondary" bgcolor="${COLORS.surfaceSecondary}" style="background-color:${COLORS.surfaceSecondary}; border:1px solid ${COLORS.borderSubtle};">
                  ${detailRows}
                </table>
                ${revokeSection}
                ${supportSection}
              </td>
            </tr>
            <tr>
              <td class="email-surface-secondary" bgcolor="${COLORS.surfaceSecondary}" style="background-color:${COLORS.surfaceSecondary}; border-top:1px solid ${COLORS.borderSubtle}; padding:32px; text-align:center;">
                ${renderEmailBrandLogo({ variant: "footer" })}
                <p style="margin:0 0 24px 0; font-size:14px; line-height:20px;">
                  <span style="color:${COLORS.onSurfaceVariant}; font-weight:500;">${copy.privacyPolicy}</span>
                  <span style="color:${COLORS.outline}; padding:0 12px;">&middot;</span>
                  <span style="color:${COLORS.onSurfaceVariant}; font-weight:500;">${copy.termsOfService}</span>
                </p>
                <p style="margin:0; font-size:14px; line-height:20px; color:${COLORS.outline};">
                  ${copyright}
                </p>
              </td>
            </tr>
          </table>
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
            <tr>
              <td align="center" style="padding:32px 16px 0 16px;">
                <p style="margin:0; font-size:14px; line-height:20px; color:${COLORS.outline}; opacity:0.6;">
                  ${copy.footerReason}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderNewDeviceSignInEmailText({
  locale = "en",
  details,
}: NewDeviceSignInEmailParams) {
  const copy = getNewDeviceSignInEmailCopy(locale);
  const deviceLabel = formatDeviceLabel(details, copy.unknownValue);
  const supportEmail = details.supportEmail ?? process.env.EMAIL_USER ?? "";

  const lines = [
    copy.subject,
    "",
    copy.textIntro,
    "",
    copy.textDetailsHeader,
    `- ${copy.signInTypeLabel}: ${details.signInMethod ?? copy.unknownValue}`,
    `- ${copy.deviceLabel}: ${deviceLabel}`,
    `- ${copy.locationLabel}: ${details.location ?? copy.unknownValue}`,
    `- ${copy.ipLabel}: ${details.ipAddress ?? copy.unknownValue}`,
    `- ${copy.timeLabel}: ${details.sessionCreatedAt ?? copy.unknownValue}`,
  ];

  if (details.revokeSessionUrl) {
    lines.push(
      "",
      copy.textUnrecognized,
      interpolateCopy(copy.textSignOut, { url: details.revokeSessionUrl }),
    );
  }

  if (supportEmail) {
    lines.push("", interpolateCopy(copy.textSupport, { supportEmail }));
  }

  lines.push(
    "",
    interpolateCopy(copy.copyright, { year: new Date().getFullYear() }),
  );

  return lines.join("\n");
}

export { getNewDeviceSignInEmailSubject };
