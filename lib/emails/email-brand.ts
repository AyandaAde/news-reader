import fs from "node:fs";
import path from "node:path";
import type { Attachment } from "nodemailer/lib/mailer";

export const EMAIL_LOGO_CID = "eilo-logo@eilo";
export const EMAIL_WORDMARK_CID = "eilo-wordmark@eilo";

function getPublicImagePath(filename: string) {
  return path.join(process.cwd(), "public", "images", filename);
}

export function getEmailLogoAttachments(): Attachment[] {
  const files = [
    { filename: "logo.png", cid: EMAIL_LOGO_CID },
    { filename: "logo-2.png", cid: EMAIL_WORDMARK_CID },
  ] as const;

  return files.map(({ filename, cid }) => ({
    filename,
    content: fs.readFileSync(getPublicImagePath(filename)),
    cid,
    contentDisposition: "inline" as const,
  }));
}

type EmailBrandLogoOptions = {
  variant?: "header" | "footer";
};

export function renderEmailBrandLogo({
  variant = "header",
}: EmailBrandLogoOptions = {}) {
  const isFooter = variant === "footer";
  const logoHeight = isFooter ? 32 : 40;
  const wordmarkHeight = isFooter ? 24 : 28;
  const opacity = isFooter ? 0.5 : 1;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto ${isFooter ? "16px" : "0"} auto;opacity:${opacity};">
      <tr>
        <td style="padding-right:8px;vertical-align:middle;">
          <img src="cid:${EMAIL_LOGO_CID}" alt="Eilo" height="${logoHeight}" style="display:block;height:${logoHeight}px;width:auto;border:0;" />
        </td>
        <td style="vertical-align:middle;">
          <img src="cid:${EMAIL_WORDMARK_CID}" alt="Eilo" height="${wordmarkHeight}" style="display:block;height:${wordmarkHeight}px;width:auto;border:0;" />
        </td>
      </tr>
    </table>`;
}
