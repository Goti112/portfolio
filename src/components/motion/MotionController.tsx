"use client";

import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

export function MotionController(): React.JSX.Element {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (root === null) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.motionState = reducedMotion ? "reduced" : "ready";
    if (reducedMotion) {
      return;
    }

    return createPortfolioMotion(root);
  });

  return <span aria-hidden="true" data-motion-marker />;
}
