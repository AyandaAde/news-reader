export type ProfileShow = {
  id: string;
  title: string;
  episodes: number;
  followers: number;
  image: string;
};

export type SavedItem = {
  id: string;
  title: string;
  meta: string;
  image: string;
};

export type RecentItem = {
  id: string;
  title: string;
  listenedAt: string;
  image: string;
};

const ROUTINE_SHOW_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1611162616471-46b635cb4eba?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
] as const;

const ROUTINE_SHOW_TITLES = [
  "The AI Revolution",
  "Why You're Always Busy but Never Feel Productive",
  "How the World's Most Successful People Actually Spend Their Day",
  "The Future of Money: Will Cash, Banks and Credit Cards Survive?",
  "The Attention Economy: Why Everything Is Fighting for Your Attention",
  "The Longevity Race: Can Humans Really Live to 120?",
  "Why Some Cities Become Rich and Others Don't",
  "The Creator Economy Is Changing What It Means to Have a Career",
  "What Will the World Look Like in 20 years",
  "How TikTok Decides What's Famous",
  "The Death of the Traditional Movie Star",
  "The Psychology of Money",
  "The Dating App Economy",
  "Why Everyone Feels Burned Out",
  "Situationships: Why Don't People Want Relationships Anymore?",
  "From First Date to Forever: How to Build a Lasting Relationship",
] as const;

function toShowId(title: string) {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export const profileShows: ProfileShow[] = ROUTINE_SHOW_TITLES.map(
  (title, index) => ({
    id: toShowId(title),
    title,
    episodes: 1,
    followers: 120 + index * 37,
    image: ROUTINE_SHOW_IMAGES[index % ROUTINE_SHOW_IMAGES.length],
  }),
);

export const savedItems: SavedItem[] = [
  {
    id: "saved-1",
    title: "Morning Markets Wrap",
    meta: "Business • 8 mins",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "saved-2",
    title: "Tech & AI Digest",
    meta: "Technology • 10 mins",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "saved-3",
    title: "World Headlines",
    meta: "World News • 6 mins",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
  },
];

export const recentItems: RecentItem[] = [
  {
    id: "recent-1",
    title: "Climate & Energy",
    listenedAt: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "recent-2",
    title: "Policy & Politics",
    listenedAt: "Yesterday",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "recent-3",
    title: "Health & Wellness",
    listenedAt: "2 days ago",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400",
  },
];

export const listeningByDay = [
  { day: "Mon", hours: 3.2 },
  { day: "Tue", hours: 4.1 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.4 },
  { day: "Fri", hours: 4.6 },
  { day: "Sat", hours: 6.2 },
  { day: "Sun", hours: 7.8 },
] as const;

export function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;

  return String(value);
}
