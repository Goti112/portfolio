import { gsap } from "gsap";
import { requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createBuildMethodScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "method";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='method']");
  if (conditions.isCompact) {
    const reveals = requireElements<HTMLElement>(section, scene, "[data-motion-reveal]");
    const tween = gsap.from(reveals, {
      y: 24,
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
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

  const stages = requireElements<HTMLElement>(section, scene, "[data-method-stage]");
  const connectors = requireElements<SVGPathElement>(section, scene, "[data-method-connector]");
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: true,
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
