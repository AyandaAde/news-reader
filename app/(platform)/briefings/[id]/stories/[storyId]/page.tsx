import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformStoryScreen } from "@/components/platform/story-screen";
import {
  getAllBriefingStoryParams,
  getBriefingStory,
} from "@/lib/platform-briefings";

type StoryPageProps = {
  params: Promise<{ id: string; storyId: string }>;
};

export function generateStaticParams() {
  return getAllBriefingStoryParams();
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { id, storyId } = await params;
  const result = getBriefingStory(id, storyId);

  if (!result) {
    return { title: "Story | EILO" };
  }

  return {
    title: `${result.story.subject} | Stories | EILO`,
    description: result.story.subject,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id, storyId } = await params;
  const result = getBriefingStory(id, storyId);

  if (!result) {
    notFound();
  }

  return (
    <PlatformStoryScreen briefing={result.briefing} story={result.story} />
  );
}
