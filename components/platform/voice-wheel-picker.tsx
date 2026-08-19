"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { VoiceInfo } from "@/lib/voice-catalog";
import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 56;
const CENTER_INDEX = 2;
const VIEWPORT_HEIGHT = 280;

type VoiceWheelPickerProps = {
  voices: VoiceInfo[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function getTargetOffset(index: number) {
  return -(index * ITEM_HEIGHT) + CENTER_INDEX * ITEM_HEIGHT;
}

export function VoiceWheelPicker({
  voices,
  value,
  onChange,
  className,
}: VoiceWheelPickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const lastEmittedValueRef = useRef(value);
  const voiceIds = useMemo(() => voices.map((voice) => voice.id).join("|"), [voices]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  onChangeRef.current = onChange;

  const count = voices.length;

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(count - 1, index)),
    [count],
  );

  const applyOffset = useCallback((nextOffset: number, smooth: boolean) => {
    offsetRef.current = nextOffset;
    setOffset(nextOffset);

    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.style.transition = smooth
      ? "transform 350ms cubic-bezier(0.23, 1, 0.32, 1)"
      : "none";
    track.style.transform = `translateY(${nextOffset}px)`;
  }, []);

  const commitIndex = useCallback(
    (index: number) => {
      const nextIndex = clampIndex(index);
      setCurrentIndex(nextIndex);
      const nextValue = voices[nextIndex]?.id;
      if (nextValue) {
        lastEmittedValueRef.current = nextValue;
        onChangeRef.current(nextValue);
      }
      return nextIndex;
    },
    [clampIndex, voices],
  );

  const snapTo = useCallback(
    (index: number, smooth: boolean) => {
      if (!count) {
        return;
      }

      const nextIndex = commitIndex(index);
      applyOffset(getTargetOffset(nextIndex), smooth);
    },
    [applyOffset, commitIndex, count],
  );

  const snapToNearest = useCallback(
    (smooth: boolean) => {
      const rawIndex = CENTER_INDEX - Math.round(offsetRef.current / ITEM_HEIGHT);
      snapTo(rawIndex, smooth);
    },
    [snapTo],
  );

  const cancelMomentum = useCallback(() => {
    if (momentumRef.current !== null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!count) {
      return;
    }

    if (draggingRef.current) {
      return;
    }

    const matchedIndex = voices.findIndex((voice) => voice.id === value);
    const initialIndex = matchedIndex >= 0 ? matchedIndex : 0;

    if (value === lastEmittedValueRef.current && initialIndex === currentIndex) {
      return;
    }

    cancelMomentum();
    lastEmittedValueRef.current = value;
    setCurrentIndex(initialIndex);
    applyOffset(getTargetOffset(initialIndex), false);
  }, [applyOffset, cancelMomentum, count, currentIndex, value, voiceIds, voices]);

  useEffect(() => cancelMomentum, [cancelMomentum]);

  const pointerY = (event: MouseEvent | TouchEvent) =>
    "touches" in event ? event.touches[0]?.clientY ?? 0 : event.clientY;

  const onStart = useCallback(
    (event: MouseEvent | TouchEvent) => {
      cancelMomentum();
      draggingRef.current = true;
      startYRef.current = pointerY(event);
      startOffsetRef.current = offsetRef.current;
      lastYRef.current = startYRef.current;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
    },
    [cancelMomentum],
  );

  const onMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) {
        return;
      }

      const y = pointerY(event);
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;

      if (deltaTime > 0) {
        velocityRef.current = ((y - lastYRef.current) / deltaTime) * 16;
      }

      lastYRef.current = y;
      lastTimeRef.current = now;

      const nextOffset = startOffsetRef.current + (y - startYRef.current);
      applyOffset(nextOffset, false);

      const rawIndex = clampIndex(CENTER_INDEX - Math.round(nextOffset / ITEM_HEIGHT));
      if (rawIndex !== currentIndex) {
        commitIndex(rawIndex);
      }
    },
    [applyOffset, clampIndex, commitIndex, currentIndex],
  );

  const onEnd = useCallback(() => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;

    if (Math.abs(velocityRef.current) > 2) {
      cancelMomentum();

      const step = () => {
        if (Math.abs(velocityRef.current) < 0.5) {
          snapToNearest(true);
          return;
        }

        velocityRef.current *= 0.92;
        const nextOffset = offsetRef.current + velocityRef.current;
        const minOffset = getTargetOffset(count - 1);
        const maxOffset = getTargetOffset(0);

        if (nextOffset < minOffset) {
          offsetRef.current = minOffset;
          velocityRef.current = 0;
        } else if (nextOffset > maxOffset) {
          offsetRef.current = maxOffset;
          velocityRef.current = 0;
        } else {
          offsetRef.current = nextOffset;
        }

        applyOffset(offsetRef.current, false);
        commitIndex(CENTER_INDEX - Math.round(offsetRef.current / ITEM_HEIGHT));
        momentumRef.current = requestAnimationFrame(step);
      };

      momentumRef.current = requestAnimationFrame(step);
      return;
    }

    snapToNearest(true);
  }, [applyOffset, cancelMomentum, commitIndex, count, snapToNearest]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cancelMomentum();
      const direction = event.deltaY > 0 ? 1 : -1;
      snapTo(currentIndex + direction, true);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, [cancelMomentum, currentIndex, onEnd, onMove, snapTo]);

  if (!count) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("touch-none select-none", className)}>
      <div
        className="relative overflow-hidden rounded-[10px]"
        style={{
          height: VIEWPORT_HEIGHT,
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
        onMouseDown={(event) => {
          event.preventDefault();
          onStart(event.nativeEvent);
        }}
        onTouchStart={(event) => onStart(event.nativeEvent)}
      >
        <div
          ref={trackRef}
          className="absolute w-full will-change-transform"
          style={{ transform: `translateY(${offset}px)` }}
        >
          {voices.map((voice, index) => {
            const distance = Math.abs(index - currentIndex);
            const isActive = distance === 0;
            const isNear = distance === 1;

            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => snapTo(index, true)}
                className={cn(
                  "flex h-14 w-full cursor-pointer flex-col items-center justify-center transition-[color,transform,opacity] duration-250",
                  isActive && "scale-[1.12] text-[#fafafa]",
                  isNear && "scale-[1.04] text-[#fafafa]/55",
                  !isActive && !isNear && "text-[#fafafa]/30",
                )}
              >
                <span className="text-[15px] font-semibold leading-tight">{voice.name}</span>
                <span
                  className={cn(
                    "text-[11px] leading-tight",
                    isActive ? "opacity-100" : "opacity-70",
                  )}
                >
                  {voice.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute top-28 right-2 left-2 h-14 rounded-lg border-y border-white/[0.08] bg-white/[0.07]" />
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-[2] h-20 bg-gradient-to-b from-[#141414] via-[#141414]/70 to-transparent" />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[2] h-20 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
      </div>
    </div>
  );
}
