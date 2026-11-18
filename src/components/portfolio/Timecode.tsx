"use client";

import { useEffect, useRef } from "react";

const FRAMES_PER_SECOND: number = 25;
const IDLE_TIMECODE: string = "00:00:00:00";

function pad(value: number): string {
  return String(Math.floor(value)).padStart(2, "0");
}

function formatTimecode(milliseconds: number, withFrames: boolean): string {
  const seconds = milliseconds / 1000;
  const frames = withFrames ? (milliseconds / (1000 / FRAMES_PER_SECOND)) % FRAMES_PER_SECOND : 0;
  return `${pad(seconds / 3600)}:${pad((seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames)}`;
}

interface TimecodeProps {
  readonly className?: string;
}

/** Running SMPTE-style timecode counting the time since the page was opened. */
export function Timecode({ className }: TimecodeProps): React.JSX.Element {
  const outputRef = useRef<HTMLSpanElement>(null);

  useEffect((): (() => void) | undefined => {
    const output = outputRef.current;
    if (output === null) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;

    const start = (): void => {
      window.clearInterval(timer);
      const withFrames = !reducedMotion.matches;
      const update = (): void => {
        output.textContent = formatTimecode(performance.now(), withFrames);
      };
      update();
      timer = window.setInterval(update, withFrames ? 1000 / FRAMES_PER_SECOND : 1000);
    };

    start();
    reducedMotion.addEventListener("change", start);
    return (): void => {
      window.clearInterval(timer);
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return <span ref={outputRef} className={className}>{IDLE_TIMECODE}</span>;
}
