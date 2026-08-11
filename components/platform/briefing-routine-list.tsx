"use client";

import { useEffect, useRef } from "react";
import Sortable from "sortablejs";

import type { BriefingRoutineSlot } from "@/lib/platform-settings";
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

type BriefingRoutineListProps = {
  slots: BriefingRoutineSlot[];
  onReorder: (slots: BriefingRoutineSlot[]) => void;
  onRemove: (id: string) => void;
};

export function BriefingRoutineList({
  slots,
  onReorder,
  onRemove,
}: BriefingRoutineListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef(slots);
  const onReorderRef = useRef(onReorder);
  slotsRef.current = slots;
  onReorderRef.current = onReorder;

  useEffect(() => {
    const element = listRef.current;
    if (!element) {
      return;
    }

    const sortable = Sortable.create(element, {
      handle: ".routine-drag-handle",
      animation: 150,
      ghostClass: "opacity-40",
      chosenClass: "cursor-grabbing",
      onEnd() {
        const ids = Array.from(element.children).map(
          (child) => (child as HTMLElement).dataset.slotId ?? "",
        );
        const next = ids
          .map((id) => slotsRef.current.find((slot) => slot.id === id))
          .filter((slot): slot is BriefingRoutineSlot => Boolean(slot));

        if (next.length === slotsRef.current.length) {
          onReorderRef.current(next);
        }
      },
    });

    return () => sortable.destroy();
  }, []);

  return (
    <div ref={listRef} className="space-y-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          className="flex cursor-grab items-center gap-3 rounded-xl bg-[#141414] px-4 py-3 active:cursor-grabbing"
        >
          <button
            type="button"
            tabIndex={-1}
            className="routine-drag-handle flex touch-none items-center text-[#555555]"
            aria-label="Drag to reorder"
          >
            <MaterialIcon name="drag_indicator" className="text-[18px]" />
          </button>
          <MaterialIcon
            name={
              slot.type === "email"
                ? "mail"
                : slot.type === "news"
                  ? "public"
                  : "headphones"
            }
            className={cn(
              "text-[20px]",
              slot.type === "email" && "text-[#34c759]",
              slot.type === "news" && "text-blue-400",
              slot.type === "podcast" && "text-purple-400",
            )}
          />
          <p className="flex-1 text-sm font-medium text-white">{slot.label}</p>
          <button
            type="button"
            aria-label="Remove"
            onClick={() => onRemove(slot.id)}
            className="flex size-8 items-center justify-center rounded-full text-[#888888] transition-colors hover:bg-white/10 hover:text-red-400"
          >
            <MaterialIcon name="close" className="text-[18px]" />
          </button>
        </div>
      ))}
    </div>
  );
}
