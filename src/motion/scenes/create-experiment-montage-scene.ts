import { gsap } from "gsap";
import { requireElement } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createExperimentMontageScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "experiments";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='experiments']");
  if (!conditions.isDesktop) {
    return (): void => undefined;
  }
  const strip = requireElement<HTMLElement>(section, scene, "[data-experiment-strip]");
  const tween = gsap.to(strip, {
    x: (): number => Math.min(0, window.innerWidth - strip.scrollWidth - 64),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top 78%",
      end: "bottom 25%",
      scrub: 0.5,
      onEnter: (): void => {
        root.dataset.activeScene = scene;
      },
      onEnterBack: (): void => {
        root.dataset.activeScene = scene;
      },
    },
  });

  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
