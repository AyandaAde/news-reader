export const siteConfig = {
  name: "Eilo",
  shortName: "Eilo",
  tagline: "Your world, in podcasts.",
  title: "Eilo — Your world, in podcasts.",
  description:
    "Eilo turns your email, news, and interests into personalized AI podcasts and daily audio briefings you can listen to anywhere.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://eilo.app").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  twitterHandle: "@eilo",
  keywords: [
    "Eilo",
    "AI podcasts",
    "personalized podcasts",
    "daily briefing",
    "audio news",
    "email briefing",
    "AI audio",
    "news reader podcast",
  ],
} as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
