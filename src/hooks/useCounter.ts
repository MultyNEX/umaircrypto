"use client";

import { useState, useEffect, useRef } from "react";

export function useCounter(
  end: number,
  duration = 2000,
  suffix = ""
) {
  // Start at the real number so server-rendered HTML has actual values for SEO
  const [count, setCount] = useState(end);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // On mount, reset to 0 then animate up when visible
  useEffect(() => {
    setCount(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(parseFloat((eased * end).toFixed(1)));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const display =
    count % 1 === 0 ? `${Math.round(count)}${suffix}` : `${count}${suffix}`;

  return { ref, displayValue: display };
}
