"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePlatformPlayback } from "@/components/platform/platform-playback-provider";
import { useOutsideClick } from "@/hooks/use-outside-click";
import type { PlatformPlaybackItem } from "@/lib/platform-playback";
import { cn } from "@/lib/utils";

export type ExpandableCardItem = {
  id: string;
  title: string;
  description: string;
  src: string;
  ctaText?: string;
  badge?: string;
  viewHref?: string;
  viewLabel?: string;
  accent?: boolean;
  content: React.ReactNode | (() => React.ReactNode);
};

function cardToPlayback(card: ExpandableCardItem): PlatformPlaybackItem {
  return {
    id: card.id,
    title: card.title,
    subtitle: card.description,
    image: card.src,
  };
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-white"
      aria-hidden="true"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function ExpandableCards({
  cards,
  className,
  layout = "list",
  scrollRef,
}: {
  cards: ExpandableCardItem[];
  className?: string;
  layout?: "list" | "grid" | "scroll";
  scrollRef?: RefObject<HTMLUListElement | null>;
}) {
  const [active, setActive] = useState<ExpandableCardItem | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const { play } = usePlatformPlayback();

  function handlePlay(card: ExpandableCardItem, event: MouseEvent) {
    event.stopPropagation();
    play(cardToPlayback(card));
    setActive(null);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const isCardActive = (cardId: string) => active?.id === cardId;

  return (
    <>
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] h-full w-full bg-black/60"
            onClick={() => setActive(null)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="pointer-events-none fixed inset-0 z-[70] overflow-y-auto overscroll-y-contain px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:grid sm:place-items-center sm:p-4 sm:pb-4">
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto relative mx-auto flex w-full max-w-[500px] flex-col overflow-hidden rounded-3xl border border-[#262626] bg-[#0D0D0D] max-h-[min(85dvh,calc(100dvh-6rem))] sm:max-h-[90%]"
            >
              <motion.button
                key={`button-close-${active.id}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-[#262626]/90 backdrop-blur-sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  setActive(null);
                }}
                aria-label="Close"
              >
                <CloseIcon />
              </motion.button>

              <motion.div
                layoutId={`image-${active.id}-${id}`}
                className="shrink-0 overflow-hidden rounded-t-3xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.src}
                  alt={active.title}
                  className="h-48 w-full object-cover object-center sm:h-64"
                />
              </motion.div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    {active.badge ? (
                      <motion.span
                        layoutId={`badge-${active.id}-${id}`}
                        className="mb-2 inline-block rounded-full border border-[#262626] bg-[#1F1F1F] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#c4c7c8]"
                      >
                        {active.badge}
                      </motion.span>
                    ) : null}
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="text-lg font-bold text-white"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className="mt-1 font-mono text-[12px] tracking-[0.05em] text-[#888888]"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    {active.viewHref ? (
                      <Link
                        href={active.viewHref}
                        onClick={() => setActive(null)}
                        className="rounded-full border border-[#262626] bg-[#1f1f1f] px-4 py-2.5 text-center font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white/10"
                      >
                        {active.viewLabel ?? "View Briefing"}
                      </Link>
                    ) : null}
                    <motion.button
                      layoutId={`button-${active.id}-${id}`}
                      type="button"
                      onClick={(event) => handlePlay(active, event)}
                      className="rounded-full bg-white px-4 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black"
                    >
                      {active.ctaText ?? "Play"}
                    </motion.button>
                  </div>
                </div>

                <div className="relative px-4 pb-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-h-48 overflow-y-auto overscroll-y-contain text-sm leading-6 text-[#c4c7c8] [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:#262626_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#262626]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {layout === "grid" || layout === "scroll" ? (
        <ul
          ref={layout === "scroll" ? scrollRef : undefined}
          className={cn(
            layout === "scroll"
              ? "hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1"
              : "grid grid-cols-2 gap-4 md:grid-cols-3",
            active && "pointer-events-none",
            className,
          )}
        >
          {cards.map((card) => (
            <motion.li
              key={card.id}
              layoutId={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className={cn(
                "group cursor-pointer overflow-hidden rounded-lg bg-[#0D0D0D] transition-colors active:scale-[0.98]",
                card.accent
                  ? "border-0"
                  : "border border-[#262626] hover:border-[#3a3a3a]",
                layout === "scroll" && "w-[140px] shrink-0",
                isCardActive(card.id) && "opacity-0",
              )}
            >
              <motion.div
                layoutId={`image-${card.id}-${id}`}
                className="relative h-[140px] overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt={card.title}
                  className={cn(
                    "size-full object-cover object-center transition-transform duration-700 group-hover:scale-105",
                    card.accent ? "saturate-125" : "grayscale",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                {card.badge ? (
                  <motion.span
                    layoutId={`badge-${card.id}-${id}`}
                    className="absolute left-2 top-2 rounded-full border border-[#262626] bg-[#1F1F1F]/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#c4c7c8] backdrop-blur-sm"
                  >
                    {card.badge}
                  </motion.span>
                ) : null}
              </motion.div>

              <div className="p-2.5">
                <motion.h3
                  layoutId={`title-${card.id}-${id}`}
                  className="truncate font-mono text-[12px] font-medium leading-tight tracking-[0.05em] text-white"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.id}-${id}`}
                  className="mt-0.5 truncate font-mono text-[10px] tracking-[0.05em] text-[#888888]"
                >
                  {card.description}
                </motion.p>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <ul
          className={cn(
            "flex w-full flex-col gap-3",
            active && "pointer-events-none",
            className,
          )}
        >
          {cards.map((card) => (
            <motion.li
              key={card.id}
              layoutId={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className={cn(
                "flex cursor-pointer flex-row items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-[#262626] hover:bg-white/5 active:scale-[0.98]",
                isCardActive(card.id) && "opacity-0",
              )}
            >
              <div className="flex min-w-0 flex-1 flex-row items-center gap-3 sm:gap-4">
                <motion.div layoutId={`image-${card.id}-${id}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.title}
                    className="size-14 rounded-lg object-cover sm:size-16"
                  />
                </motion.div>

                <div className="min-w-0 flex-1 text-left">
                  {card.badge ? (
                    <motion.span
                      layoutId={`badge-${card.id}-${id}`}
                      className="mb-1 inline-block max-w-full truncate rounded-full border border-[#262626] bg-[#1F1F1F] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#c4c7c8]"
                    >
                      {card.badge}
                    </motion.span>
                  ) : null}
                  <motion.h3
                    layoutId={`title-${card.id}-${id}`}
                    className="truncate font-medium text-white"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.id}-${id}`}
                    className="mt-1 truncate font-mono text-[12px] tracking-[0.05em] text-[#888888]"
                  >
                    {card.description}
                  </motion.p>
                </div>
              </div>

              <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-3">
                {card.viewHref ? (
                  <Link
                    href={card.viewHref}
                    onClick={(event) => event.stopPropagation()}
                    className="rounded-full border border-[#262626] bg-[#1f1f1f] px-3 py-2 font-mono text-[11px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white/10 sm:px-4 sm:text-[12px]"
                  >
                    {card.viewLabel ?? "View Briefing"}
                  </Link>
                ) : null}
                <motion.button
                  layoutId={`button-${card.id}-${id}`}
                  type="button"
                  onClick={(event) => handlePlay(card, event)}
                  className="rounded-full border border-[#262626] bg-[#1f1f1f] px-3 py-2 font-mono text-[11px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white hover:text-black sm:px-4 sm:text-[12px]"
                >
                  {card.ctaText ?? "Play"}
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </>
  );
}
