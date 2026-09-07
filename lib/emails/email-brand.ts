import fs from "node:fs";
import path from "node:path";
import type { Attachment } from "nodemailer/lib/mailer";

export const EMAIL_LOGO_CID = "eilo-logo@eilo";

const EMAIL_LOGO_CANDIDATES = ["logo.png", "logo-dark.png"] as const;
// logo.png is 668×315 — keep width/height in sync to avoid stretching in clients.
const EMAIL_LOGO_ASPECT_RATIO = 668 / 315;

function getPublicImagePath(filename: string) {
  return path.join(process.cwd(), "public", "images", filename);
}

function resolveEmailLogoFilename() {
  for (const filename of EMAIL_LOGO_CANDIDATES) {
    if (fs.existsSync(getPublicImagePath(filename))) {
      return filename;
    }
  }

  return null;
}

export function getEmailLogoAttachments(): Attachment[] {
  const filename = resolveEmailLogoFilename();
  if (!filename) {
    console.warn(
      `Email logo asset missing. Expected one of: ${EMAIL_LOGO_CANDIDATES.join(", ")}`,
    );
    return [];
  }

  const filePath = getPublicImagePath(filename);

  return [
    {
      filename,
      content: fs.readFileSync(filePath),
      cid: EMAIL_LOGO_CID,
      contentType: "image/png",
      contentDisposition: "inline" as const,
    },
  ];
}

type EmailBrandLogoOptions = {
  variant?: "header" | "footer";
};

export const EMAIL_COLORS = {
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
} as const;

export function renderEmailDocumentHead(title: string) {
  const { background, surface, surfaceSecondary } = EMAIL_COLORS;

  return `<meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <style type="text/css">
      :root {
        color-scheme: light only;
        supported-color-schemes: light only;
      }
      @media (prefers-color-scheme: dark) {
        body,
        .email-bg {
          background-color: ${background} !important;
        }
        .email-surface {
          background-color: ${surface} !important;
        }
        .email-surface-secondary {
          background-color: ${surfaceSecondary} !important;
        }
      }
    </style>
    <title>${title}</title>`;
}

export function renderEmailBrandLogo({
  variant = "header",
}: EmailBrandLogoOptions = {}) {
  const isFooter = variant === "footer";
  const logoHeight = isFooter ? 20 : 28;
  const logoWidth = Math.round(logoHeight * EMAIL_LOGO_ASPECT_RATIO);
  const opacity = isFooter ? 0.5 : 1;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto ${isFooter ? "12px" : "0"} auto;opacity:${opacity};">
      <tr>
        <td align="center" style="vertical-align:middle;line-height:0;">
          <img src="cid:${EMAIL_LOGO_CID}" alt="Eilo" width="${logoWidth}" height="${logoHeight}" style="display:block;width:${logoWidth}px;height:${logoHeight}px;max-width:${logoWidth}px;border:0;" />
        </td>
      </tr>
    </table>`;
}
