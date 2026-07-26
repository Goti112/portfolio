"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Component, useCallback, useRef, useState } from "react";
import type { ErrorInfo, ReactNode, RefObject } from "react";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

interface MotionExperienceProps {
  readonly root: RefObject<HTMLDivElement | null>;
}

interface MotionErrorBoundaryProps {
  readonly children: ReactNode;
}

interface MotionErrorBoundaryState {
  readonly error: Error | null;
}

class MotionErrorBoundary extends Component<MotionErrorBoundaryProps, MotionErrorBoundaryState> {
  public state: MotionErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): MotionErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Portfolio motion initialization failed", {
      error,
      componentStack: info.componentStack,
    });
  }

  public render(): ReactNode {
    return this.state.error === null ? this.props.children : null;
  }
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
      {hasRoot ? (
        <MotionErrorBoundary>
          <MotionExperience root={root} />
        </MotionErrorBoundary>
      ) : null}
    </div>
  );
}
