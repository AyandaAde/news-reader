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

export const profileShows: ProfileShow[] = [
  {
    id: "midnight-frequencies",
    title: "Midnight Frequencies",
    episodes: 12,
    followers: 428,
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "the-agent-era",
    title: "The Agent Era",
    episodes: 8,
    followers: 312,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "nomad-notes",
    title: "Nomad Notes",
    episodes: 24,
    followers: 891,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400",
  },
];

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
