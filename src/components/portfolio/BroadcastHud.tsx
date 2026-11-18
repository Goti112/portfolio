"use client";

import { useEffect, useRef } from "react";
import { Timecode } from "@/components/portfolio/Timecode";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Decorative on-screen display for the hero: tape state, running timecode and
 * the visitor's actual present day and present time.
 */
export function BroadcastHud(): React.JSX.Element {
  const dayRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect((): (() => void) => {
    const update = (): void => {
      const now = new Date();
      if (dayRef.current !== null) {
        dayRef.current.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
      }
      if (timeRef.current !== null) {
        timeRef.current.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      }
    };
    update();
    const timer = window.setInterval(update, 1000);
    return (): void => window.clearInterval(timer);
  }, []);

  return (
    <div className="proof-intro__hud" aria-hidden="true">
      <p className="proof-intro__hud-item" data-corner="top-left">
        <span className="proof-intro__hud-play">▶</span> PLAY <span className="proof-intro__hud-dim">SP</span>
      </p>
      <p className="proof-intro__hud-item" data-corner="top-right">
        <span className="proof-intro__hud-rec">●</span> REC <Timecode />
      </p>
      <p className="proof-intro__hud-item" data-corner="bottom-left">
        <span>
          <span className="proof-intro__hud-dim">PRESENT DAY</span> <span ref={dayRef}>----.--.--</span>
        </span>
        <span>
          <span className="proof-intro__hud-dim">PRESENT TIME</span> <span ref={timeRef}>--:--:--</span>
        </span>
      </p>
      <p className="proof-intro__hud-item" data-corner="bottom-right">
        SCROLL <span className="proof-intro__hud-scroll">▼</span>
      </p>
    </div>
  );
}
