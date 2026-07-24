import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requireElement } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createVerdictScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "verdict";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='verdict']");
  const heading = requireElement<HTMLElement>(section, scene, "[data-motion-heading]");
  const setActiveScene = (): void => {
    root.dataset.activeScene = scene;
  };
  const sceneTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "+=1",
    onEnter: setActiveScene,
    onEnterBack: setActiveScene,
  });
  const tween = gsap.from(heading.children, {
    yPercent: conditions.isDesktop ? 110 : 40,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      once: true,
    },
  });

  return (): void => {
    sceneTrigger.kill();
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
