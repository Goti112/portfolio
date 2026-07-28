import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContractError, requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

function requireFirstElement(
  elements: readonly HTMLElement[],
  scene: string,
  selector: string,
): HTMLElement {
  const element = elements[0];
  if (element === undefined) {
    throw new MotionContractError(scene, selector, window.location.pathname);
  }
  return element;
}

export function createProjectEvidenceScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "projects";
  const section = requireElement<HTMLElement>(root, scene, "[data-project-stage]");
  const cases = requireElements<HTMLElement>(section, scene, "[data-project-case]");
  if (!conditions.isDesktop) {
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
    const caseTriggers = cases.map((projectCase) => {
      const projectId = projectCase.dataset.projectCase;
      if (projectId === undefined) {
        throw new MotionContractError(scene, "data-project-case value", window.location.pathname);
      }
      const activate = (): void => {
        root.dataset.activeProject = projectId;
      };
      return ScrollTrigger.create({
        trigger: projectCase,
        start: "top center",
        end: "bottom center",
        onEnter: activate,
        onEnterBack: activate,
      });
    });
    return (): void => {
      tween.scrollTrigger?.kill();
      tween.kill();
      caseTriggers.forEach((trigger) => trigger.kill());
    };
  }

  const visualStage = requireElement<HTMLElement>(section, scene, "[data-project-visual-stage]");
  const previews = requireElements<HTMLElement>(visualStage, scene, "[data-project-preview]");
  const firstPreview = requireFirstElement(previews, scene, "[data-project-preview]");
  const sceneTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    onEnter: (): void => {
      root.dataset.activeScene = scene;
    },
    onEnterBack: (): void => {
      root.dataset.activeScene = scene;
    },
  });

  gsap.set(previews, { autoAlpha: 0 });
  gsap.set(firstPreview, { autoAlpha: 1 });
  const caseTriggers = cases.map((projectCase, index) => {
    const projectId = projectCase.dataset.projectCase;
    if (projectId === undefined) {
      throw new MotionContractError(scene, "data-project-case value", window.location.pathname);
    }
    const activate = (): void => {
      root.dataset.activeProject = projectId;
      gsap.to(previews, {
        autoAlpha: (previewIndex: number): number => previewIndex === index ? 1 : 0,
        duration: 0.45,
        overwrite: "auto",
      });
    };
    return ScrollTrigger.create({
      trigger: projectCase,
      start: "top center",
      end: "bottom center",
      onEnter: activate,
      onEnterBack: activate,
    });
  });

  return (): void => {
    sceneTrigger.kill();
    caseTriggers.forEach((trigger) => trigger.kill());
    gsap.killTweensOf(previews);
    gsap.set(previews, { clearProps: "all" });
  };
}
