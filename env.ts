import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_SIGNING_SECRET: z.string().min(1),
    EMAIL_USER: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
    SMTP_HOST: z.string().min(1).optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_SECURE: z
      .string()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes"].includes(normalized)) return true;
        if (["false", "0", "no"].includes(normalized)) return false;
        return undefined;
      }),
    IPINFO_TOKEN: z.string().min(1).optional(),
    IP_INFO_API_KEY: z.string().min(1).optional(),
    MONGODB_URI: z.string().min(1).optional(),
    BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
    NEWS_READER_API_URL: z.url(),
    NEWS_READER_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
});

export function getIpInfoToken() {
  return env.IPINFO_TOKEN ?? env.IP_INFO_API_KEY;
}
