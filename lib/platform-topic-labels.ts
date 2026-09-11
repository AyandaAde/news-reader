import { TOPIC_OPTIONS } from "@/lib/onboarding";

export const TOPIC_LABEL_KEYS: Record<
  (typeof TOPIC_OPTIONS)[number],
  string
> = {
  "World News": "platform.home.topicWorldNews",
  Business: "platform.home.topicBusiness",
  Science: "platform.home.topicScience",
  Sports: "platform.home.topicSports",
  Entertainment: "platform.home.topicEntertainment",
  Technology: "platform.home.topicTechnology",
  Health: "platform.home.topicHealth",
  Finance: "platform.home.topicFinance",
  Music: "platform.home.topicMusic",
  Food: "platform.home.topicFood",
  AI: "platform.home.topicAi",
  Travel: "platform.home.topicTravel",
  Books: "platform.home.topicBooks",
  Gaming: "platform.home.topicGaming",
  Climate: "platform.home.topicClimate",
};
