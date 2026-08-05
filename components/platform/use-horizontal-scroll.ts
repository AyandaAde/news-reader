import { useCallback, useRef } from "react";

export function useHorizontalScroll(step = 320) {
  const ref = useRef<HTMLUListElement>(null);

  const scrollBy = useCallback(
    (direction: -1 | 1) => {
      ref.current?.scrollBy({
        left: direction * step,
        behavior: "smooth",
      });
    },
    [step],
  );

  return {
    ref,
    scrollPrevious: () => scrollBy(-1),
    scrollNext: () => scrollBy(1),
  };
}
