"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlatformStoriesList } from "@/components/platform/stories-list";
import type { BriefingEmail, PlatformBriefing } from "@/lib/platform-briefings";
import { consumeStoryReplyDraft } from "@/lib/story-reply-drafts";

type PlatformStoryScreenProps = {
  briefing: PlatformBriefing;
  story: BriefingEmail;
};

function getStoryBody(story: BriefingEmail, briefingTitle: string) {
  return `${story.subject}

Hi,

Here's the source material we pulled into "${briefingTitle}".

Quick summary: ${story.subject}. This thread includes the key updates, context, and follow-ups that shaped how this story appeared in your briefing.

Let me know if you want this added to tomorrow's edition or summarized differently.

Best,
${story.senderName.split(" ")[0]}`;
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
    <div className="flex max-h-screen flex-col">
      <Breadcrumb className="mb-4 shrink-0">
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

      <div className="flex h-[calc(100svh-10rem)] max-h-screen min-h-0 flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#0d0d0d] lg:flex-row">
        <aside className="flex min-h-0 max-h-[min(40svh,280px)] shrink-0 flex-col border-b border-[#262626] lg:max-h-none lg:w-80 lg:border-b-0 lg:border-r">
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

        <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
          <div className="px-4 py-5 md:px-6">
            <div className="rounded-xl border border-[#262626] bg-[#131313]">
              <div className="space-y-3 border-b border-[#262626] px-4 py-4 font-mono text-[12px] tracking-[0.04em] text-[#c4c7c8] md:px-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[#888888]">From</span>
                  <span className="text-white">
                    {story.senderName} &lt;{story.senderEmail}&gt;
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[#888888]">To</span>
                  <span className="text-white">you@eilo.app</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[#888888]">Subject</span>
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
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[#888888]">To</span>
                  <span className="text-white">
                    {story.senderName} &lt;{story.senderEmail}&gt;
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-[#888888]">Subject</span>
                  <span className="text-white">Re: {story.subject}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <label className="shrink-0 text-[#888888]" htmlFor="story-reply-cc">
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
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write your reply..."
                  rows={8}
                  className="w-full resize-y rounded-lg border border-[#262626] bg-[#0d0d0d] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-[#666666] focus:border-white/20"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={!reply.trim()}
                    className="rounded-full bg-white px-5 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
