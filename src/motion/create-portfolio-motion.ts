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

function createDiagramMotion(root: HTMLElement): SceneCleanup {
  const qgc = requireElement<HTMLElement>(root, "qgc", "[data-project-case='qgc-planner']");
  const borderPass = requireElement<HTMLElement>(root, "borderpass", "[data-project-case='borderpass-ai']");
  const ocr = requireElement<HTMLElement>(root, "ocr", "[data-project-case='ticket-ocr']");
  const route = requireElement<SVGPolylineElement>(qgc, "qgc", "[data-route]");
  const decisions = requireElements<HTMLElement>(borderPass, "borderpass", "[data-decision-step]");
  const outputs = requireElements<HTMLElement>(ocr, "ocr", "[data-output-row]");
  const routeTween = gsap.fromTo(route,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: qgc, start: "top 80%", once: true },
    },
  );
  const decisionTween = gsap.from(decisions, {
    y: 12,
    duration: 0.5,
    stagger: 0.1,
    clearProps: "all",
    scrollTrigger: { trigger: borderPass, start: "top 80%", once: true },
  });
  const outputTween = gsap.from(outputs, {
    y: 12,
    duration: 0.5,
    stagger: 0.1,
    clearProps: "all",
    scrollTrigger: { trigger: ocr, start: "top 80%", once: true },
  });
  const tweens = [routeTween, decisionTween, outputTween] as const;
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
        cleanups.push(createDiagramMotion(root));
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
