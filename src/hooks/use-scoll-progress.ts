"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";
import { useResizeObserver } from "./use-resize-observer";

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [scrollProgress, setScrollProgress] = useState(1);

  const updateScrollProgress = useCallback(() => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;

    setScrollProgress(
      scrollHeight === clientHeight
        ? 1
        : Math.min(scrollTop / (scrollHeight - clientHeight), 1),
    );
  }, [ref]);


  const resizeObserverEntry = useResizeObserver(ref);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(updateScrollProgress, [resizeObserverEntry]);

  return { scrollProgress, updateScrollProgress };
}