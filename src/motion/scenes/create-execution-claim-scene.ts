import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createExecutionClaimScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  void conditions;
  const scene = "claim";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='claim']");
  const fragments = requireElements<HTMLElement>(section, scene, "[data-claim-fragment]");
  let animation: gsap.core.Timeline | null = null;
  const activate = (): void => {
    if (animation !== null) {
      return;
    }
    const state = Flip.getState(fragments);
    section.dataset.claimAssembled = "true";
    animation = Flip.from(state, { duration: 0.9, ease: "power3.inOut", stagger: 0.06 });
    root.dataset.activeScene = scene;
  };
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top 65%",
    once: true,
    onEnter: activate,
  });

  return (): void => {
    trigger.kill();
    animation?.kill();
    delete section.dataset.claimAssembled;
  };
}
