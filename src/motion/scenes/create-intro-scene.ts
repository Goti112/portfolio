import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { requireElement } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createIntroScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "intro";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='intro']");
  const heading = requireElement<HTMLElement>(section, scene, "[data-motion-heading]");
  const evidenceWindow = requireElement<HTMLElement>(section, scene, "[data-intro-window]");
  const scan = requireElement<HTMLElement>(section, scene, "[data-intro-scan]");
  let activeTimeline: gsap.core.Timeline | null = null;

  const split = SplitText.create(heading, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    aria: "none",
    onSplit(instance) {
      activeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: conditions.isDesktop,
          scrub: 0.6,
          onEnter: (): void => {
            root.dataset.activeScene = scene;
          },
          onEnterBack: (): void => {
            root.dataset.activeScene = scene;
          },
        },
      })
        .from(instance.lines, { yPercent: 110, stagger: 0.08 })
        .from(evidenceWindow, { xPercent: 22, rotation: 4, autoAlpha: 0 }, "<")
        .fromTo(scan, { yPercent: -100 }, { yPercent: 700, ease: "none" }, 0);
      return activeTimeline;
    },
  });

  return (): void => {
    activeTimeline?.scrollTrigger?.kill();
    activeTimeline?.kill();
    split.revert();
  };
}
