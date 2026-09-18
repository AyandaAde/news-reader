export const PODCAST_DURATION_OPTIONS = [
  { id: "30", labelKey: "duration30", minutes: 30, optimum: false },
  {
    id: "30-60",
    labelKey: "duration30to60",
    minutes: 45,
    optimum: true,
  },
  { id: "60", labelKey: "duration60", minutes: 60, optimum: false },
  { id: "90", labelKey: "duration90", minutes: 90, optimum: false },
  { id: "120", labelKey: "duration120", minutes: 120, optimum: false },
] as const;

export type PodcastDurationId = (typeof PODCAST_DURATION_OPTIONS)[number]["id"];

export const DEFAULT_PODCAST_DURATION_ID: PodcastDurationId = "30-60";

export type NewPodcastConfig = {
  topics: string[];
  language: string;
  durationId: PodcastDurationId;
};

export function getPodcastDurationMinutes(
  durationId: PodcastDurationId,
): number {
  return (
    PODCAST_DURATION_OPTIONS.find((option) => option.id === durationId)
      ?.minutes ?? 45
  );
}
