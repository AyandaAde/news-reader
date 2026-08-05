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

export function PlatformScrollSectionHeader({
  title,
  onPrevious,
  onNext,
}: {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold leading-8 text-white">{title}</h2>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          aria-label={`Scroll ${title} left`}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
        >
          <MaterialIcon name="chevron_left" className="text-[20px]" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={`Scroll ${title} right`}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#262626] bg-[#1f1f1f] text-white transition-colors hover:bg-white/10 active:scale-95"
        >
          <MaterialIcon name="chevron_right" className="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
