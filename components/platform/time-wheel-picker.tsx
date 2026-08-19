"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const CENTER_PADDING = ITEM_HEIGHT * 2;
const DELIVERY_MINUTES = ["00", "15", "30", "45"] as const;
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const PERIOD_OPTIONS = ["AM", "PM"] as const;

type Period = (typeof PERIOD_OPTIONS)[number];

function to12Hour(hours24: number) {
  const period: Period = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;
  return { hour12, period };
}

function to24Hour(hour12: number, period: Period) {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }

  return hour12 === 12 ? 12 : hour12 + 12;
}

function normalizeMinutes(minutes: string) {
  return DELIVERY_MINUTES.includes(minutes as (typeof DELIVERY_MINUTES)[number])
    ? minutes
    : "30";
}

function WheelColumn<T extends string | number>({
  options,
  value,
  onChange,
  formatOption,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatOption?: (value: T) => string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const selectedIndex = Math.max(0, options.indexOf(value));
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  onChangeRef.current = onChange;

  const snapToIndex = useCallback(
    (index: number, smooth: boolean) => {
      const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
      const nextValue = options[clampedIndex];

      setCurrentIndex(clampedIndex);

      scrollRef.current?.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: smooth ? "smooth" : "auto",
      });

      if (nextValue !== undefined && nextValue !== value) {
        onChangeRef.current(nextValue);
      }
    },
    [options, value],
  );

  const syncScrollPosition = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(options.length - 1, index));
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        top: nextIndex * ITEM_HEIGHT,
        behavior: "auto",
      });
    },
    [options.length],
  );

  useEffect(() => {
    if (isDraggingRef.current) {
      return;
    }

    const matchedIndex = options.indexOf(value);
    const nextIndex = matchedIndex >= 0 ? matchedIndex : 0;

    requestAnimationFrame(() => {
      syncScrollPosition(nextIndex);
    });
  }, [options, syncScrollPosition, value]);

  useEffect(() => {
    return () => {
      if (scrollEndTimeoutRef.current !== null) {
        window.clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  function scheduleSnap() {
    if (scrollEndTimeoutRef.current !== null) {
      window.clearTimeout(scrollEndTimeoutRef.current);
    }

    scrollEndTimeoutRef.current = window.setTimeout(() => {
      isDraggingRef.current = false;
      const scrollTop = scrollRef.current?.scrollTop ?? 0;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      snapToIndex(index, true);
    }, 80);
  }

  function handleScroll() {
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    setCurrentIndex(Math.max(0, Math.min(options.length - 1, index)));
    scheduleSnap();
  }

  return (
    <div className={cn("relative min-w-0 flex-1 overflow-hidden", className)}>
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "y mandatory",
          paddingTop: CENTER_PADDING,
          paddingBottom: CENTER_PADDING,
        }}
        onScroll={handleScroll}
        onPointerDown={() => {
          isDraggingRef.current = true;
        }}
        onPointerUp={scheduleSnap}
        onTouchEnd={scheduleSnap}
        onMouseUp={scheduleSnap}
        onWheel={(event) => {
          event.stopPropagation();
        }}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - currentIndex);
          const isActive = distance === 0;
          const isNear = distance === 1;

          return (
            <button
              key={String(option)}
              type="button"
              onClick={() => snapToIndex(index, true)}
              className={cn(
                "flex h-11 w-full snap-center items-center justify-center transition-[color,transform,opacity] duration-200",
                isActive && "scale-105 text-white",
                isNear && "text-white/55",
                !isActive && !isNear && "text-white/30",
              )}
            >
              <span className="text-[17px] font-semibold tabular-nums">
                {formatOption ? formatOption(option) : String(option)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type TimeWheelPickerProps = {
  hours: number;
  minutes: string;
  onChange: (hours: number, minutes: string) => void;
  className?: string;
};

export function TimeWheelPicker({ hours, minutes, onChange, className }: TimeWheelPickerProps) {
  const parsed = to12Hour(hours);
  const normalizedMinutes = normalizeMinutes(minutes);
  const [hour12, setHour12] = useState(parsed.hour12);
  const [period, setPeriod] = useState<Period>(parsed.period);
  const [minute, setMinute] = useState(normalizedMinutes);

  useEffect(() => {
    const next = to12Hour(hours);
    setHour12(next.hour12);
    setPeriod(next.period);
    setMinute(normalizeMinutes(minutes));
  }, [hours, minutes]);

  function emit(nextHour12: number, nextPeriod: Period, nextMinute: string) {
    setHour12(nextHour12);
    setPeriod(nextPeriod);
    setMinute(nextMinute);
    onChange(to24Hour(nextHour12, nextPeriod), nextMinute);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1",
        className,
      )}
      style={{ height: VIEWPORT_HEIGHT }}
    >
      <div className="pointer-events-none absolute top-1/2 right-3 left-3 z-[1] h-11 -translate-y-1/2 rounded-[10px] border-y border-white/[0.08] bg-white/[0.07]" />
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-[2] h-16 bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a]/75 to-transparent" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[2] h-16 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/75 to-transparent" />

      <div className="relative z-0 flex h-full items-stretch">
        <WheelColumn
          options={HOUR_OPTIONS}
          value={hour12}
          formatOption={(option) => String(option).padStart(2, "0")}
          onChange={(nextHour) => emit(nextHour, period, minute)}
        />
        <div className="flex w-4 shrink-0 items-center justify-center self-center text-[18px] font-semibold text-[#888888]">
          :
        </div>
        <WheelColumn
          options={DELIVERY_MINUTES}
          value={minute}
          onChange={(nextMinute) => emit(hour12, period, nextMinute)}
        />
        <WheelColumn
          options={PERIOD_OPTIONS}
          value={period}
          className="max-w-[72px]"
          onChange={(nextPeriod) => emit(hour12, nextPeriod, minute)}
        />
      </div>
    </div>
  );
}

export function parseDeliveryTime(value: string) {
  const [hoursText, minutesText = "30"] = value.split(":");
  const hours = Number(hoursText);

  return {
    hours: Number.isNaN(hours) ? 7 : hours,
    minutes: normalizeMinutes(minutesText),
  };
}

export function toDeliveryTime(hours: number, minutes: string) {
  return `${String(hours).padStart(2, "0")}:${normalizeMinutes(minutes)}`;
}

export function formatDeliveryTime(value: string) {
  const { hours, minutes } = parseDeliveryTime(value);
  const { hour12, period } = to12Hour(hours);
  return `${hour12}:${minutes} ${period}`;
}
