"use client";

import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from "react";
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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] h-full w-full bg-black/60"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4">
            <motion.button
              key={`button-close-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-[#262626] lg:hidden"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="flex h-full max-h-[90vh] w-full max-w-[500px] flex-col overflow-hidden rounded-3xl border border-[#262626] bg-[#0D0D0D] sm:h-fit md:max-h-[90%]"
            >
              <motion.div
                layoutId={`image-${active.id}-${id}`}
                className="shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.src}
                  alt={active.title}
                  className="h-64 w-full object-cover object-center sm:rounded-t-3xl"
                />
              </motion.div>

              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4 p-4">
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

                  <motion.button
                    layoutId={`button-${active.id}-${id}`}
                    type="button"
                    onClick={(event) => handlePlay(active, event)}
                    className="shrink-0 rounded-full bg-white px-4 py-2.5 font-mono text-[12px] font-medium tracking-[0.05em] text-black"
                  >
                    {active.ctaText ?? "Play"}
                  </motion.button>
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
            className,
          )}
        >
          {cards.map((card) => (
            <motion.li
              key={card.id}
              layoutId={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className={cn(
                "group cursor-pointer overflow-hidden rounded-lg border border-[#262626] bg-[#0D0D0D] transition-colors hover:border-[#3a3a3a] active:scale-[0.98]",
                layout === "scroll" && "w-[140px] shrink-0",
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
                  className="size-full object-cover object-center grayscale transition-transform duration-700 group-hover:scale-105"
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
        <ul className={cn("flex w-full flex-col gap-3", className)}>
          {cards.map((card) => (
            <motion.li
              key={card.id}
              layoutId={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className="flex cursor-pointer flex-col items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-[#262626] hover:bg-white/5 active:scale-[0.98] md:flex-row md:items-center"
            >
              <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-center">
                <motion.div layoutId={`image-${card.id}-${id}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.title}
                    className="size-16 rounded-lg object-cover"
                  />
                </motion.div>

                <div className="min-w-0 flex-1 text-center md:text-left">
                  {card.badge ? (
                    <motion.span
                      layoutId={`badge-${card.id}-${id}`}
                      className="mb-1 inline-block rounded-full border border-[#262626] bg-[#1F1F1F] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#c4c7c8]"
                    >
                      {card.badge}
                    </motion.span>
                  ) : null}
                  <motion.h3
                    layoutId={`title-${card.id}-${id}`}
                    className="font-medium text-white"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.id}-${id}`}
                    className="mt-1 font-mono text-[12px] tracking-[0.05em] text-[#888888]"
                  >
                    {card.description}
                  </motion.p>
                </div>
              </div>

              <motion.button
                layoutId={`button-${card.id}-${id}`}
                type="button"
                onClick={(event) => handlePlay(card, event)}
                className="mt-3 rounded-full border border-[#262626] bg-[#1f1f1f] px-4 py-2 font-mono text-[12px] font-medium tracking-[0.05em] text-white transition-colors hover:bg-white hover:text-black md:mt-0"
              >
                {card.ctaText ?? "Play"}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </>
  );
}
