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
          "flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-white",
          canScrollPrevious
            ? "cursor-pointer hover:bg-neutral-100 active:scale-95 dark:hover:bg-white/10"
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
          "flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors dark:border-[#262626] dark:bg-[#1f1f1f] dark:text-white",
          canScrollNext
            ? "cursor-pointer hover:bg-neutral-100 active:scale-95 dark:hover:bg-white/10"
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
      <h2 className="text-2xl font-semibold leading-8 text-neutral-900 dark:text-white">
        {title}
      </h2>
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
