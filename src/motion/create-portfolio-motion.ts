import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requireElement, requireElements } from "@/motion/contracts";
import {
  createChannelSwitchMotion,
  createGhostParallax,
  createRevealMotion,
  createSpotlightMotion,
  createTiltMotion,
  createTraceMotion,
} from "@/motion/scenes";
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
  const timelines = shots.map((shot) => {
    const noise = shot.closest("[data-project-shot]")?.querySelector<HTMLElement>("[data-shot-static]") ?? null;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: shot, start: "top 85%", once: true } });
    timeline.fromTo(shot,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power2.out", clearProps: "clipPath" },
      0,
    );
    // The picture "tunes in": blown-out and colourless first, then it settles.
    timeline.fromTo(shot,
      { filter: "brightness(1.9) contrast(1.5) saturate(0)" },
      { filter: "brightness(1) contrast(1) saturate(1)", duration: 1.2, ease: "power2.out", clearProps: "filter" },
      0,
    );
    if (noise !== null) {
      timeline.fromTo(noise,
        { autoAlpha: 0.9 },
        { autoAlpha: 0, duration: 1, ease: "steps(8)", clearProps: "opacity,visibility" },
        0,
      );
    }
    return timeline;
  });
  return (): void => {
    timelines.forEach((timeline) => {
      timeline.scrollTrigger?.kill();
      timeline.revert();
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
        // The screenshot scene carries the motion contract, so it must run first:
        // if its hooks are missing nothing else has touched the page yet.
        cleanups.push(createScreenshotMotion(root));
        cleanups.push(createRevealMotion(root));
        cleanups.push(createGhostParallax(root));
        cleanups.push(createTraceMotion(root));
        cleanups.push(createSpotlightMotion(root));
        cleanups.push(createTiltMotion(root));
        cleanups.push(createChannelSwitchMotion(root));
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
