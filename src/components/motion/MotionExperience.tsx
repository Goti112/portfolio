"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useCallback, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

interface MotionExperienceProps {
  readonly root: RefObject<HTMLDivElement | null>;
}

export function MotionExperience({ root }: MotionExperienceProps): null {
  useGSAP(() => {
    const element = root.current;
    if (element === null) {
      throw new Error("MotionExperience could not resolve its root");
    }
    return createPortfolioMotion(element);
  }, { scope: root });
  return null;
}

interface PortfolioExperienceRootProps {
  readonly children: ReactNode;
}

export function PortfolioExperienceRoot({ children }: PortfolioExperienceRootProps): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  const [hasRoot, setHasRoot] = useState<boolean>(false);
  const setMotionRoot = useCallback((element: HTMLDivElement | null): void => {
    root.current = element;
    setHasRoot(element !== null);
  }, []);

  return (
    <div ref={setMotionRoot} className="portfolio-shell" data-motion-root data-motion-state="static">
      {children}
      {hasRoot ? <MotionExperience root={root} /> : null}
    </div>
  );
}
