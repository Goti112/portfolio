import { gsap } from "gsap";
import { requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

export function createEvidenceLens(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  if (!conditions.finePointer || conditions.reduceMotion) {
    return (): void => undefined;
  }
  const lens = requireElement<HTMLElement>(root, "evidence-lens", "[data-evidence-lens]");
  const previews = requireElements<HTMLElement>(root, "evidence-lens", "[data-project-preview]");
  const moveX = gsap.quickTo(lens, "x", { duration: 0.2, ease: "power2.out" });
  const moveY = gsap.quickTo(lens, "y", { duration: 0.2, ease: "power2.out" });
  const onMove = (event: PointerEvent): void => {
    moveX(event.clientX);
    moveY(event.clientY);
  };
  const onEnter = (): void => {
    lens.dataset.active = "true";
  };
  const onLeave = (): void => {
    delete lens.dataset.active;
  };
  root.addEventListener("pointermove", onMove, { passive: true });
  previews.forEach((preview) => {
    preview.addEventListener("pointerenter", onEnter);
    preview.addEventListener("pointerleave", onLeave);
  });

  return (): void => {
    root.removeEventListener("pointermove", onMove);
    previews.forEach((preview) => {
      preview.removeEventListener("pointerenter", onEnter);
      preview.removeEventListener("pointerleave", onLeave);
    });
    moveX.tween.kill();
    moveY.tween.kill();
    delete lens.dataset.active;
    gsap.set(lens, { clearProps: "x,y" });
  };
}
