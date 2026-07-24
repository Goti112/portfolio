import { gsap } from "gsap";
import type { MotionConditions } from "@/motion/types";

export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  media.add({
    isDesktop: "(min-width: 960px)",
    isCompact: "(max-width: 959px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
    finePointer: "(pointer: fine)",
  }, (context) => {
    const conditions = context.conditions as unknown as MotionConditions;
    root.dataset.motionState = conditions.reduceMotion ? "reduced" : "ready";
  }, root);
  return (): void => {
    media.revert();
    delete root.dataset.activeScene;
    delete root.dataset.activeProject;
    root.dataset.motionState = "static";
  };
}
