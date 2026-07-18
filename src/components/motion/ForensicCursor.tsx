"use client";

import { useEffect, useRef } from "react";

export function ForensicCursor(): React.JSX.Element {
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const el = document.querySelector<HTMLElement>("[data-forensic-cursor]");
    if (el === null) {
      return;
    }

    const cursor = el;

    function onPointerMove(e: PointerEvent): void {
      pointRef.current.x = e.clientX;
      pointRef.current.y = e.clientY;

      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          cursor.style.setProperty("--cursor-x", `${pointRef.current.x}px`);
          cursor.style.setProperty("--cursor-y", `${pointRef.current.y}px`);
        });
      }
    }

    function onPointerOver(e: PointerEvent): void {
      if ((e.target as HTMLElement | null)?.closest("[data-probe]")) {
        cursor.dataset.cursorActive = "true";
      }
    }

    function onPointerOut(e: PointerEvent): void {
      if ((e.target as HTMLElement | null)?.closest("[data-probe]")) {
        delete cursor.dataset.cursorActive;
      }
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return <div aria-hidden="true" data-forensic-cursor />;
}
