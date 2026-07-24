import { gsap } from "gsap";
import { requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createBuildMethodScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "method";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='method']");
  const stages = requireElements<HTMLElement>(section, scene, "[data-method-stage]");
  const connectors = requireElements<SVGPathElement>(section, scene, "[data-method-connector]");
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: conditions.isDesktop,
      scrub: 0.7,
      onEnter: (): void => {
        root.dataset.activeScene = scene;
      },
      onEnterBack: (): void => {
        root.dataset.activeScene = scene;
      },
    },
  });

  timeline
    .from(stages, {
      yPercent: 24,
      rotation: (index: number): number => index % 2 === 0 ? -3 : 3,
      stagger: 0.16,
    })
    .fromTo(
      connectors,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", stagger: 0.08 },
      0.2,
    );

  return (): void => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
