import type { Language } from "@/lib/i18n";
import { renderEmailBrandLogo } from "@/lib/emails/email-brand";
import {
  getVerificationEmailCopy,
  interpolateCopy,
  type VerificationEmailFlow,
} from "@/lib/emails/verification-email-copy";

type VerificationEmailParams = {
  otpCode: string;
  firstName?: string;
  expiryMinutes?: number;
  flow?: VerificationEmailFlow;
  locale?: Language;
};

const COLORS = {
  background: "#0d0d0d",
  surface: "#141414",
  surfaceSecondary: "#1a1a1a",
  borderSubtle: "#262626",
  accent: "#fafafa",
  accentSoft: "#1f1f1f",
  onBackground: "#fafafa",
  onSurface: "#fafafa",
  onSurfaceVariant: "#888888",
  outline: "#666666",
};

function formatOtp(code: string) {
  const digits = code.replace(/\s+/g, "");
  if (digits.length === 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  return digits;
}

function getFlowLabel(
  flow: VerificationEmailFlow,
  copy: ReturnType<typeof getVerificationEmailCopy>,
) {
  return flow === "sign-up" ? copy.flowSignUp : copy.flowSignIn;
}

export function renderVerificationEmail({
  otpCode,
  firstName,
  expiryMinutes = 10,
  flow = "sign-in",
  locale = "en",
}: VerificationEmailParams) {
  const copy = getVerificationEmailCopy(locale);
  const code = formatOtp(otpCode);
  const greetingName = firstName?.trim();
  const year = new Date().getFullYear();
  const flowLabel = getFlowLabel(flow, copy);
  const intro = greetingName
    ? interpolateCopy(copy.introWithName, { name: greetingName, flow: flowLabel })
    : interpolateCopy(copy.introWithoutName, { flow: flowLabel });
  const expiryNote = interpolateCopy(copy.expiryNote, { minutes: expiryMinutes });
  const copyright = interpolateCopy(copy.copyright, { year });
  const footerReason = flow === "sign-up" ? copy.footerReasonSignUp : copy.footerReasonSignIn;
  const textAlign = copy.dir === "rtl" ? "right" : "left";

  return `<!DOCTYPE html>
<html lang="${copy.htmlLang}" dir="${copy.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${copy.subject}</title>
  </head>
  <body style="margin:0; padding:0; background-color:${COLORS.background}; -webkit-font-smoothing:antialiased; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.background};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:${COLORS.surface}; border:1px solid ${COLORS.borderSubtle}; overflow:hidden;">
            <tr>
              <td align="center" style="background-color:${COLORS.surface}; padding:40px 32px 24px 32px;">
                ${renderEmailBrandLogo({ variant: "header" })}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 48px 32px;" align="center">
                <h1 style="margin:0 0 16px 0; font-size:32px; line-height:40px; font-weight:600; letter-spacing:-0.01em; color:${COLORS.onBackground};">
                  ${copy.title}
                </h1>
                <p style="margin:0 auto 40px auto; max-width:384px; font-size:16px; line-height:24px; color:${COLORS.onSurfaceVariant};">
                  ${intro}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 40px 0;">
                  <tr>
                    <td align="center" style="background-color:${COLORS.surfaceSecondary}; border:1px solid ${COLORS.borderSubtle}; padding:32px 24px;">
                      <span style="font-size:48px; line-height:56px; font-weight:600; letter-spacing:0.15em; color:${COLORS.accent}; white-space:nowrap; direction:ltr; unicode-bidi:isolate;">
                        ${code}
                      </span>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.accentSoft}; border:1px solid ${COLORS.borderSubtle};">
                  <tr>
                    <td style="padding:16px;">
                      <p style="margin:0; text-align:${textAlign}; font-size:14px; line-height:20px; color:${COLORS.onSurfaceVariant};">
                        ${expiryNote}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:${COLORS.surfaceSecondary}; border-top:1px solid ${COLORS.borderSubtle}; padding:32px; text-align:center;">
                ${renderEmailBrandLogo({ variant: "footer" })}
                <p style="margin:0 0 16px 0; font-size:20px; line-height:28px; font-weight:600; color:${COLORS.onBackground}; opacity:0.5;">
                  Eilo
                </p>
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
                  ${footerReason}
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

export function renderVerificationEmailText({
  otpCode,
  expiryMinutes = 10,
  flow = "sign-in",
  locale = "en",
}: VerificationEmailParams) {
  const copy = getVerificationEmailCopy(locale);
  const code = formatOtp(otpCode);
  const flowLabel = getFlowLabel(flow, copy);

  return [
    copy.subject,
    "",
    interpolateCopy(copy.textCodeLabel, { code }),
    "",
    interpolateCopy(copy.textIntro, { flow: flowLabel }),
    "",
    interpolateCopy(copy.textExpiry, { minutes: expiryMinutes }),
    copy.textIgnore,
    "",
    interpolateCopy(copy.copyright, { year: new Date().getFullYear() }),
  ].join("\n");
}

export function getVerificationFlowFromSlug(slug: string): VerificationEmailFlow {
  if (slug === "sign_up_code" || slug === "verification_code") {
    return "sign-up";
  }
  return "sign-in";
}

export function getVerificationEmailSubject(locale: Language) {
  return getVerificationEmailCopy(locale).subject;
}
