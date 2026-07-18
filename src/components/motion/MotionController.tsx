"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

export function MotionController(): null {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (root === null) {
      throw new Error("MotionController could not resolve its root element");
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.motionState = reducedMotion ? "reduced" : "ready";
    if (reducedMotion) {
      return;
    }

    return createPortfolioMotion(root);
  }, { dependencies: [] });

  return null;
}
