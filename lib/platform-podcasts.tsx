import type { ExpandableCardItem } from "@/components/platform/expandable-cards";
import type { NewsReaderPodcast } from "@/lib/news-reader-api";

export const PODCAST_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=400";

function formatPodcastSourceType(sourceType: string) {
  switch (sourceType) {
    case "Email":
      return "Email Brief";
    case "News":
      return "News Pod";
    case "WebSearch":
      return "Web Search";
    case "Rss":
      return "RSS Feed";
    case "Subreddit":
      return "Subreddit";
    case "XPost":
      return "X Post";
    case "Calendar":
      return "Calendar";
    case "Url":
      return "URL";
    case "Custom":
      return "Custom";
    default:
      return sourceType;
  }
}

function formatEpisodeCount(count: number) {
  return count === 1 ? "1 episode" : `${count} episodes`;
}

function formatPodcastDescription(podcast: NewsReaderPodcast) {
  const sourceLabel = formatPodcastSourceType(podcast.sourceType);
  const episodeLabel = formatEpisodeCount(podcast.episodeCount);

  if (podcast.description?.trim()) {
    return `${episodeLabel} • ${podcast.description.trim()}`;
  }

  if (podcast.topicTags.length > 0) {
    return `${episodeLabel} • ${podcast.topicTags.slice(0, 2).join(", ")}`;
  }

  return `${episodeLabel} • ${sourceLabel}`;
}

export function podcastsToForYouCards(
  podcasts: NewsReaderPodcast[],
): ExpandableCardItem[] {
  return podcasts.map((podcast) => {
    const sourceLabel = formatPodcastSourceType(podcast.sourceType);
    const description = formatPodcastDescription(podcast);

    return {
      id: podcast.id,
      title: podcast.title,
      description,
      badge: sourceLabel,
      src: podcast.artworkUrl?.trim() || PODCAST_PLACEHOLDER_IMAGE,
      ctaText: "Play",
      content: (
        <p>
          {podcast.title} — {description}. This is one of your podcasts, ready
          to play from your personal library.
        </p>
      ),
    };
  });
}
