import { gsap } from "gsap";
import { requireElement } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createVerdictScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "verdict";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='verdict']");
  const heading = requireElement<HTMLElement>(section, scene, "[data-motion-heading]");
  const tween = gsap.from(heading.children, {
    yPercent: conditions.isDesktop ? 110 : 40,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: (): void => {
        root.dataset.activeScene = scene;
      },
    },
  });

  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
