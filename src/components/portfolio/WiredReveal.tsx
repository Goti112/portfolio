"use client";

import { useEffect } from "react";

interface WiredRevealProps {
  readonly targetId: string;
}

const revealGlitchCleanupDelayMs: number = 450;

export function WiredReveal({ targetId }: WiredRevealProps): null {
  useEffect((): (() => void) | undefined => {
    const target = document.getElementById(targetId);
    if (target === null) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.dataset.wiredReveal = "done";
      return undefined;
    }

    let revealGlitchTimer: number | undefined;
    const cleanupRevealTimer = (): void => {
      if (revealGlitchTimer !== undefined) {
        window.clearTimeout(revealGlitchTimer);
      }
    };
    const reveal = (): void => {
      target.dataset.wiredReveal = "done";
      target.dataset.wiredGlitchReveal = "active";
      if (revealGlitchTimer !== undefined) {
        window.clearTimeout(revealGlitchTimer);
      }
      revealGlitchTimer = window.setTimeout((): void => {
        delete target.dataset.wiredGlitchReveal;
        revealGlitchTimer = undefined;
      }, revealGlitchCleanupDelayMs);
    };

    const rect = target.getBoundingClientRect();
    if (!("IntersectionObserver" in window) || rect.top < window.innerHeight) {
      reveal();
      return cleanupRevealTimer;
    }

    target.dataset.wiredReveal = "pending";
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        reveal();
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(target);
    return (): void => {
      observer.disconnect();
      cleanupRevealTimer();
    };
  }, [targetId]);
  return null;
}
