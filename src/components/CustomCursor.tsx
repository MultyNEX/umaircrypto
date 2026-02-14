"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      setHovering(!!interactive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    // RAF loop for smooth interpolation
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 16}px, ${pos.current.y - 16}px) scale(${hovering ? 1.5 : 1})`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [isTouch, visible, hovering]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-accent-primary pointer-events-none z-[9998] transition-[width,height,border-color,box-shadow] duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      } ${hovering ? "border-accent-secondary shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "shadow-[0_0_10px_rgba(56,189,248,0.3)]"}`}
    />
  );
}
