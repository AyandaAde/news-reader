"use client";

import Link from "next/link";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlatformAskAiChat } from "@/components/platform/platform-ask-ai-chat";
import { PlatformStoriesList } from "@/components/platform/stories-list";
import { useStoryDictation } from "@/hooks/use-story-dictation";
import type { BriefingEmail, PlatformBriefing } from "@/lib/platform-briefings";
import { consumeStoryReplyDraft } from "@/lib/story-reply-drafts";
import { cn } from "@/lib/utils";

type PlatformStoryScreenProps = {
  briefing: PlatformBriefing;
  story: BriefingEmail;
};

function MaterialIcon({
  name,
  filled,
  className,
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}

function getStoryBody(story: BriefingEmail, briefingTitle: string) {
  return `${story.subject}

Hi,

Here's the source material we pulled into "${briefingTitle}".

Quick summary: ${story.subject}. This thread includes the key updates, context, and follow-ups that shaped how this story appeared in your briefing.

Let me know if you want this added to tomorrow's edition or summarized differently.

Best,
${story.senderName.split(" ")[0]}`;
}

type StoryEmailAndReplyProps = {
  briefing: PlatformBriefing;
  story: BriefingEmail;
  body: string;
  reply: string;
  setReply: Dispatch<SetStateAction<string>>;
  cc: string;
  setCc: Dispatch<SetStateAction<string>>;
  onSendReply: () => void;
  showDictation?: boolean;
};

function StoryEmailAndReply({
  briefing,
  story,
  body,
  reply,
  setReply,
  cc,
  setCc,
  onSendReply,
  showDictation = false,
}: StoryEmailAndReplyProps) {
  const { isListening, activeStoryKey, toggleDictation } = useStoryDictation({
    onTranscript: (text) => {
      setReply((current) => (current.trim() ? `${current.trim()} ${text}` : text));
    },
  });

  const dictationKey = `${briefing.id}:${story.id}`;
  const isDictating = showDictation && isListening && activeStoryKey === dictationKey;
  const metaRowClass = "flex flex-col gap-1 lg:flex-row lg:gap-3";
  const metaLabelClass = "shrink-0 text-[#888888]";

  return (
    <>
      <div className="rounded-xl border border-[#262626] bg-[#131313]">
        <div className="space-y-3 border-b border-[#262626] px-4 py-4 font-mono text-[12px] tracking-[0.04em] text-[#c4c7c8] md:px-5">
          <div className={metaRowClass}>
            <span className={metaLabelClass}>From</span>
            <span className="text-white">
              {story.senderName} &lt;{story.senderEmail}&gt;
            </span>
          </div>
          <div className={metaRowClass}>
            <span className={metaLabelClass}>To</span>
            <span className="text-white">you@eilo.app</span>
          </div>
          <div className={metaRowClass}>
            <span className={metaLabelClass}>Subject</span>
            <span className="text-white">{story.subject}</span>
          </div>
        </div>

        <div className="whitespace-pre-wrap px-4 py-5 text-sm leading-7 text-[#e2e2e2] md:px-5">
          {body}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#262626] bg-[#131313]">
        <div className="border-b border-[#262626] px-4 py-3 md:px-5">
          <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[#888888]">
            Reply
          </h3>
        </div>
        <div className="space-y-3 px-4 py-4 font-mono text-[12px] tracking-[0.04em] text-[#c4c7c8] md:px-5">
          <div className={metaRowClass}>
            <span className={metaLabelClass}>To</span>
            <span className="text-white">
              {story.senderName} &lt;{story.senderEmail}&gt;
            </span>
          </div>
          <div className={metaRowClass}>
            <span className={metaLabelClass}>Subject</span>
            <span className="text-white">Re: {story.subject}</span>
          </div>
          <div className={metaRowClass}>
            <label className={metaLabelClass} htmlFor="story-reply-cc">
              Cc
            </label>
            <input
              id="story-reply-cc"
              type="text"
              value={cc}
              onChange={(event) => setCc(event.target.value)}
              placeholder="Add emails, separated by commas"
              className="w-full bg-transparent text-white outline-none placeholder:text-[#666666]"
            />
          </div>
        </div>
        <div className="border-t border-[#262626] px-4 py-4 md:px-5">
          <div className="flex items-start gap-2">
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Write your reply..."
              rows={showDictation ? 6 : 8}
              className="min-h-[10rem] flex-1 resize-y rounded-lg border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-[#666666] focus:border-white/20"
            />
            {showDictation ? (
              <button
                type="button"
                onClick={() => toggleDictation(briefing.id, story.id)}
                aria-label={isDictating ? "Stop dictating reply" : "Dictate reply"}
                className={cn(
                  "mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] transition-colors",
                  isDictating && "border-[#ffb4ab]/45 bg-[#ffb4ab]/12",
                )}
              >
                <MaterialIcon
                  name="mic"
                  className={cn(
                    "text-[18px]",
                    isDictating ? "text-[#ffb4ab]" : "text-white",
                  )}
                />
              </button>
            ) : null}
          </div>
          {isDictating ? (
            <p className="mt-2 text-xs text-[#ffb4ab]">
              Listening… tap mic to finish
            </p>
          ) : null}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onSendReply}
              disabled={!reply.trim()}
              className="rounded-full bg-white px-5 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function PlatformStoryScreen({ briefing, story }: PlatformStoryScreenProps) {
  const [reply, setReply] = useState("");
  const [cc, setCc] = useState("");
  const body = getStoryBody(story, briefing.title);

  useEffect(() => {
    const draft = consumeStoryReplyDraft(briefing.id, story.id);
    if (draft) {
      setReply(draft);
    }
  }, [briefing.id, story.id]);

  function handleSendReply() {
    if (!reply.trim()) {
      return;
    }

    const ccRecipients = cc
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const ccMessage =
      ccRecipients.length > 0 ? ` CC'd: ${ccRecipients.join(", ")}.` : "";

    window.alert(`Your reply to ${story.senderName} was sent.${ccMessage}`);
    setReply("");
    setCc("");
  }

  return (
    <div className="pb-8 lg:flex lg:max-h-screen lg:flex-col">
      <Link
        href={`/briefings/${briefing.id}`}
        className="mb-4 inline-flex items-center gap-1 text-white transition-opacity hover:opacity-80 lg:hidden"
      >
        <MaterialIcon name="arrow_back" className="text-[22px]" />
      </Link>

      <Breadcrumb className="mb-4 hidden shrink-0 lg:block">
        <BreadcrumbList className="text-[#888888]">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/home" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#888888]" />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/briefings/${briefing.id}`} />}>
              Your Briefings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#888888]" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Stories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex min-h-0 flex-col lg:h-[calc(100svh-10rem)] lg:max-h-screen lg:overflow-hidden lg:rounded-2xl lg:border lg:border-[#262626] lg:bg-[#0d0d0d] lg:flex-row">
        <aside className="hidden min-h-0 w-80 shrink-0 flex-col border-r border-[#262626] lg:flex">
          <div className="shrink-0 border-b border-[#262626] px-4 py-3">
            <h2 className="text-lg font-semibold text-white">Stories</h2>
            <p className="mt-1 text-sm text-[#888888]">{briefing.title}</p>
          </div>
          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <PlatformStoriesList
              briefingId={briefing.id}
              stories={briefing.emails}
              activeStoryId={story.id}
              variant="sidebar"
            />
          </div>
        </aside>

        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col lg:overflow-y-auto lg:overscroll-y-contain">
          <div className="mb-5 flex items-start justify-between gap-3 lg:mb-0 lg:shrink-0 lg:justify-end lg:border-b lg:border-[#262626] lg:px-6 lg:py-3">
            <div className="min-w-0 flex-1 lg:hidden">
              <h1 className="text-2xl font-semibold text-white">Stories</h1>
              <p className="mt-1 text-sm text-[#888888]">{briefing.title}</p>
            </div>
            <PlatformAskAiChat context="story" briefing={briefing} story={story} />
          </div>

          <div className="px-0 py-0 lg:px-6 lg:py-5">
            <StoryEmailAndReply
              briefing={briefing}
              story={story}
              body={body}
              reply={reply}
              setReply={setReply}
              cc={cc}
              setCc={setCc}
              onSendReply={handleSendReply}
              showDictation
            />
          </div>
        </div>
      </div>
    </div>
  );
}
