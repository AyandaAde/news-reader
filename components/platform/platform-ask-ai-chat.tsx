"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useId, useRef, useState } from "react";
import type { BriefingEmail, PlatformBriefing } from "@/lib/platform-briefings";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type PlatformAskAiChatProps = {
  context: "briefing" | "story";
  briefing: PlatformBriefing;
  story?: BriefingEmail;
  className?: string;
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

function getInitialMessage(
  context: PlatformAskAiChatProps["context"],
  briefing: PlatformBriefing,
  story?: BriefingEmail,
): string {
  if (context === "story" && story) {
    return `Hi! Ask me anything about "${story.subject}" from ${briefing.title}. I can explain the story, summarize key points, or help you draft a reply.`;
  }

  return `Hi! Ask me anything about "${briefing.title}". I can summarize the briefing, explain individual stories, or highlight what matters most from the ${briefing.emails.length} sources included.`;
}

function generateMockResponse(
  context: PlatformAskAiChatProps["context"],
  briefing: PlatformBriefing,
  story: BriefingEmail | undefined,
  userMessage: string,
): string {
  const query = userMessage.toLowerCase();

  if (context === "story" && story) {
    if (query.includes("summar")) {
      return `"${story.subject}" from ${story.senderName} covers the core updates that shaped this part of ${briefing.title}. The thread includes context, follow-ups, and the details that made it into your audio briefing.`;
    }

    if (query.includes("reply") || query.includes("respond")) {
      return `For a reply to ${story.senderName}, acknowledge the main point in "${story.subject}", ask one clarifying question if needed, and keep the tone concise. I can help refine a draft if you paste what you have.`;
    }

    return `About "${story.subject}": this story from ${story.senderName} is one of ${briefing.emails.length} sources in ${briefing.title}. It contributed the updates and context you heard in the briefing segment on this topic.`;
  }

  if (query.includes("summar")) {
    const highlights = briefing.emails
      .slice(0, 3)
      .map((email) => email.subject)
      .join("; ");
    return `${briefing.title} (${briefing.description}) pulls together ${briefing.emails.length} stories. Key threads include: ${highlights}${briefing.emails.length > 3 ? "; and more." : "."}`;
  }

  if (query.includes("story") || query.includes("stories") || query.includes("list")) {
    const list = briefing.emails
      .map((email) => `• ${email.subject} (${email.senderName})`)
      .join("\n");
    return `This briefing includes ${briefing.emails.length} stories:\n${list}`;
  }

  if (query.includes("important") || query.includes("matter") || query.includes("highlight")) {
    return `The most important threads in ${briefing.title} are the ones driving today's narrative — starting with "${briefing.emails[0]?.subject ?? "the lead story"}". I can go deeper on any story if you name it.`;
  }

  return `In ${briefing.title}, the briefing weaves ${briefing.emails.length} email sources into one audio narrative (${briefing.description}). Tell me if you want a summary, a specific story explained, or help comparing themes across sources.`;
}

export function PlatformAskAiChat({
  context,
  briefing,
  story,
  className,
}: PlatformAskAiChatProps) {
  const inputId = useId();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: getInitialMessage(context, briefing, story),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getInitialMessage(context, briefing, story),
      },
    ]);
    setInput("");
    setIsThinking(false);
  }, [open, context, briefing, story]);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isThinking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: generateMockResponse(context, briefing, story, trimmed),
        },
      ]);
      setIsThinking(false);
    }, 700);
  }

  const title =
    context === "story" && story
      ? `Ask about ${story.subject}`
      : `Ask about ${briefing.title}`;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-full border border-[#262626] bg-[#1f1f1f] px-4 py-2 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:border-white/30 hover:bg-white/10",
            className,
          )}
        >
          <MaterialIcon name="auto_awesome" filled className="text-[16px] text-[#EBB800]" />
          Ask AI
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] flex max-h-[min(640px,90svh)] w-[min(calc(100vw-2rem),28rem)] md:max-h-[min(720px,90svh)] md:w-[min(calc(100vw-4rem),42rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#131313] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#262626] px-4 py-3">
            <div className="min-w-0">
              <Dialog.Title className="truncate text-base font-semibold text-white">
                Ask AI
              </Dialog.Title>
              <Dialog.Description className="truncate text-sm text-[#888888]">
                {title}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close chat"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#888888] transition-colors hover:bg-white/10 hover:text-white"
              >
                <MaterialIcon name="close" className="text-[20px]" />
              </button>
            </Dialog.Close>
          </div>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 whitespace-pre-wrap",
                    message.role === "user"
                      ? "ml-auto bg-white text-black"
                      : "mr-auto border border-[#262626] bg-[#0d0d0d] text-[#e2e2e2]",
                  )}
                >
                  {message.content}
                </div>
              ))}

              {isThinking ? (
                <div className="mr-auto flex items-center gap-2 rounded-2xl border border-[#262626] bg-[#0d0d0d] px-3.5 py-2.5 text-sm text-[#888888]">
                  <MaterialIcon name="more_horiz" className="text-[18px] animate-pulse" />
                  Thinking...
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form
            onSubmit={handleSend}
            className="shrink-0 border-t border-[#262626] p-4"
          >
            <label htmlFor={inputId} className="sr-only">
              Ask a question
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id={inputId}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend(event);
                  }
                }}
                placeholder="Ask a question..."
                rows={2}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[#262626] bg-[#0d0d0d] px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-[#666666] focus:border-white/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                aria-label="Send message"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MaterialIcon name="send" filled className="text-[18px]" />
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
