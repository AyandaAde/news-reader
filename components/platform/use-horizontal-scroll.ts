"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SCROLL_EDGE_THRESHOLD = 1;

function getScrollState(element: HTMLUListElement | null) {
  if (!element) {
    return { canScrollPrevious: false, canScrollNext: false };
  }

  const { scrollLeft, scrollWidth, clientWidth } = element;
  const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);

  return {
    canScrollPrevious: scrollLeft > SCROLL_EDGE_THRESHOLD,
    canScrollNext: scrollLeft < maxScrollLeft - SCROLL_EDGE_THRESHOLD,
  };
}

export function useHorizontalScroll(step = 320) {
  const ref = useRef<HTMLUListElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const state = getScrollState(ref.current);
    setCanScrollPrevious(state.canScrollPrevious);
    setCanScrollNext(state.canScrollNext);
  }, []);

  useLayoutEffect(() => {
    updateScrollState();
    const frame = window.requestAnimationFrame(updateScrollState);
    return () => window.cancelAnimationFrame(frame);
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    updateScrollState();

    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    const observeChildren = () => {
      for (const child of element.children) {
        resizeObserver.observe(child);
      }
    };

    observeChildren();

    const mutationObserver = new MutationObserver(() => {
      observeChildren();
      updateScrollState();
    });
    mutationObserver.observe(element, { childList: true, subtree: true });

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = useCallback(
    (direction: -1 | 1) => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const state = getScrollState(element);
      if (direction === -1 && !state.canScrollPrevious) {
        return;
      }
      if (direction === 1 && !state.canScrollNext) {
        return;
      }

      element.scrollBy({
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
    canScrollPrevious,
    canScrollNext,
  };
}
