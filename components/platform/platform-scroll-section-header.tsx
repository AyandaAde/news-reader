import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlatformScrollNavButtons({
  title,
  onPrevious,
  onNext,
  canScrollPrevious = false,
  canScrollNext = false,
}: {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  canScrollPrevious?: boolean;
  canScrollNext?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canScrollPrevious}
        aria-label={`Scroll ${title} left`}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors",
          canScrollPrevious
            ? "cursor-pointer hover:bg-white/10 active:scale-95"
            : "cursor-default opacity-40",
        )}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label={`Scroll ${title} right`}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors",
          canScrollNext
            ? "cursor-pointer hover:bg-white/10 active:scale-95"
            : "cursor-default opacity-40",
        )}
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}

export function PlatformScrollSectionHeader({
  title,
  onPrevious,
  onNext,
  canScrollPrevious = false,
  canScrollNext = false,
}: {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  canScrollPrevious?: boolean;
  canScrollNext?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold leading-8 text-white">{title}</h2>
      <PlatformScrollNavButtons
        title={title}
        onPrevious={onPrevious}
        onNext={onNext}
        canScrollPrevious={canScrollPrevious}
        canScrollNext={canScrollNext}
      />
    </div>
  );
}
