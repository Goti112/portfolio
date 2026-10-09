import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requireElement, requireElements } from "@/motion/contracts";
import type { SceneCleanup } from "@/motion/types";

gsap.registerPlugin(ScrollTrigger);

function cleanupScenes(cleanups: readonly SceneCleanup[]): void {
  const errors: unknown[] = [];
  for (const cleanup of [...cleanups].reverse()) {
    try {
      cleanup();
    } catch (error: unknown) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors, "One or more editorial motion scenes failed to clean up");
  }
}

function createScreenshotMotion(root: HTMLElement): SceneCleanup {
  const projects = requireElement<HTMLElement>(root, "projects", "#projects");
  const shots = requireElements<HTMLElement>(projects, "projects", "[data-project-shot] img");
  const tweens = shots.map((shot) => gsap.fromTo(shot,
    { clipPath: "inset(0 0 100% 0)" },
    {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.8,
      ease: "power2.out",
      clearProps: "clipPath",
      scrollTrigger: { trigger: shot, start: "top 85%", once: true },
    },
  ));
  return (): void => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.revert();
    });
  };
}

export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  try {
    media.add("(prefers-reduced-motion: reduce)", () => {
      root.dataset.motionState = "reduced";
      return (): void => { root.dataset.motionState = "static"; };
    }, root);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: SceneCleanup[] = [];
      try {
        cleanups.push(createScreenshotMotion(root));
        root.dataset.motionState = "ready";
      } catch (error: unknown) {
        try {
          cleanupScenes(cleanups);
        } catch (cleanupError: unknown) {
          root.dataset.motionState = "static";
          throw new AggregateError([error, cleanupError], "Editorial motion initialization and rollback failed");
        }
        root.dataset.motionState = "static";
        throw error;
      }
      return (): void => {
        try {
          cleanupScenes(cleanups);
        } finally {
          root.dataset.motionState = "static";
        }
      };
    }, root);
  } catch (error: unknown) {
    try {
      media.revert();
    } catch (revertError: unknown) {
      root.dataset.motionState = "static";
      throw new AggregateError([error, revertError], "Editorial motion initialization and media rollback failed");
    }
    root.dataset.motionState = "static";
    throw error;
  }
  return (): void => {
    try {
      media.revert();
    } finally {
      root.dataset.motionState = "static";
    }
  };
}
