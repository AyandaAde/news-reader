"use client";

import Link from "next/link";

import type { BriefingEmail } from "@/lib/platform-briefings";
import { useStoryDictation } from "@/hooks/use-story-dictation";
import { cn } from "@/lib/utils";

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return <span className={cn("material-symbols-outlined", className)}>{name}</span>;
}

type PlatformStoriesListProps = {
  briefingId: string;
  stories: BriefingEmail[];
  activeStoryId?: string;
  variant?: "panel" | "sidebar";
  className?: string;
};

export function PlatformStoriesList({
  briefingId,
  stories,
  activeStoryId,
  variant = "panel",
  className,
}: PlatformStoriesListProps) {
  const { isListening, activeStoryKey, toggleDictation } = useStoryDictation();

  return (
    <div className={className}>
      {stories.map((story) => {
        const key = `${briefingId}:${story.id}`;
        const isActiveStory = activeStoryId === story.id;
        const isDictating = isListening && activeStoryKey === key;
        const href = `/briefings/${briefingId}/stories/${story.id}`;

        return (
          <div
            key={story.id}
            className={cn(
              "flex items-start gap-2",
              variant === "panel" ? "py-3" : "border-b border-[#262626]/80",
            )}
          >
            <Link
              href={href}
              className={cn(
                "min-w-0 flex-1 transition-colors",
                variant === "panel" &&
                  "-mx-2 rounded-lg px-2 hover:bg-white/[0.03]",
                variant === "sidebar" && "px-4 py-4 hover:bg-white/5",
                isActiveStory && variant === "sidebar" && "bg-white/5",
              )}
            >
              <p
                className={cn(
                  "font-semibold leading-snug",
                  isActiveStory ? "text-white" : "text-white/90",
                )}
              >
                {story.subject}
              </p>
              <p className="mt-1 truncate text-sm text-[#888888]">
                {story.senderName} &lt;{story.senderEmail}&gt;
              </p>
              {isDictating ? (
                <p className="mt-1.5 text-xs text-[#ffb4ab]">
                  Listening… click mic to finish
                </p>
              ) : null}
            </Link>

            <button
              type="button"
              aria-label={isDictating ? "Stop dictating reply" : "Dictate reply"}
              onClick={() => toggleDictation(briefingId, story.id)}
              className={cn(
                "mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                isDictating
                  ? "border-[#ffb4ab]/45 bg-[#ffb4ab]/10 text-[#ffb4ab]"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10",
                variant === "sidebar" && "mr-3",
                variant === "panel" && "mr-1",
              )}
            >
              <MaterialIcon name="mic" className="text-[18px]" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
