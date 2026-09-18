export const ROUTINE_ADD_CATEGORIES = [
  "AI",
  "Weather",
  "Business",
  "Money",
  "Dating",
  "Pop Culture",
  "Leisure",
] as const;

export type RoutineAddCategory = (typeof ROUTINE_ADD_CATEGORIES)[number];

export type RoutineAddOption = {
  key: string;
  label: string;
  category: RoutineAddCategory;
  type: "weather" | "news" | "podcast";
  podcastId?: string;
};

const PODCAST_CATEGORY_BY_TITLE: Record<string, RoutineAddCategory> = {
  "The AI Revolution": "AI",
  "Why You're Always Busy but Never Feel Productive": "Leisure",
  "How the World's Most Successful People Actually Spend Their Day": "Business",
  "The Future of Money: Will Cash, Banks and Credit Cards Survive?": "Money",
  "The Attention Economy: Why Everything Is Fighting for Your Attention": "AI",
  "The Longevity Race: Can Humans Really Live to 120?": "Leisure",
  "Why Some Cities Become Rich and Others Don't": "Business",
  "The Creator Economy Is Changing What It Means to Have a Career": "Business",
  "What Will the World Look Like in 20 years": "AI",
  "How TikTok Decides What's Famous": "Pop Culture",
  "The Death of the Traditional Movie Star": "Pop Culture",
  "The Psychology of Money": "Money",
  "The Dating App Economy": "Dating",
  "Why Everyone Feels Burned Out": "Leisure",
  "Situationships: Why Don't People Want Relationships Anymore?": "Dating",
  "From First Date to Forever: How to Build a Lasting Relationship": "Dating",
};

export function getRoutinePodcastCategory(title: string): RoutineAddCategory {
  return PODCAST_CATEGORY_BY_TITLE[title] ?? "Leisure";
}
