import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { createSceneProgress } from "@/motion/create-scene-progress";
import { createBuildMethodScene } from "@/motion/scenes/create-build-method-scene";
import { createEvidenceLens } from "@/motion/scenes/create-evidence-lens";
import { createExecutionClaimScene } from "@/motion/scenes/create-execution-claim-scene";
import { createExperimentMontageScene } from "@/motion/scenes/create-experiment-montage-scene";
import { createIntroScene } from "@/motion/scenes/create-intro-scene";
import { createProjectEvidenceScene } from "@/motion/scenes/create-project-evidence-scene";
import { createVerdictScene } from "@/motion/scenes/create-verdict-scene";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

gsap.registerPlugin(Flip, ScrollTrigger);

function decodeAnchorId(fragment: string): string | null {
  try {
    return decodeURIComponent(fragment.slice(1));
  } catch (error: unknown) {
    if (error instanceof URIError) {
      return null;
    }
    throw error;
  }
}

function resolveInitialAnchor(root: HTMLElement, fragment: string): HTMLElement | null {
  const anchorId = decodeAnchorId(fragment);
  if (anchorId === null || anchorId.length === 0) {
    return null;
  }
  const target = document.getElementById(anchorId);
  if (target === null || !root.contains(target)) {
    return null;
  }
  return target;
}

function resetMotionState(root: HTMLElement): void {
  delete root.dataset.activeScene;
  delete root.dataset.activeProject;
  root.dataset.motionState = "static";
}

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
    throw new AggregateError(errors, "One or more portfolio motion scenes failed to clean up");
  }
}

export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  const initialAnchor = resolveInitialAnchor(root, window.location.hash);
  let refreshFrame: number | null = null;
  let isActive = true;
  try {
    media.add({
      isDesktop: "(min-width: 960px)",
      isCompact: "(max-width: 959.98px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
      finePointer: "(pointer: fine)",
    }, (context) => {
      const conditions = context.conditions as unknown as MotionConditions;
      if (conditions.reduceMotion) {
        root.dataset.motionState = "reduced";
        return;
      }
      const cleanups: SceneCleanup[] = [];
      try {
        cleanups.push(createSceneProgress(root));
        cleanups.push(createIntroScene(root, conditions));
        cleanups.push(createExecutionClaimScene(root, conditions));
        cleanups.push(createBuildMethodScene(root, conditions));
        cleanups.push(createProjectEvidenceScene(root, conditions));
        cleanups.push(createExperimentMontageScene(root, conditions));
        cleanups.push(createVerdictScene(root, conditions));
        cleanups.push(createEvidenceLens(root, conditions));
        root.dataset.motionState = "ready";
      } catch (error: unknown) {
        try {
          cleanupScenes(cleanups);
        } catch (cleanupError: unknown) {
          resetMotionState(root);
          throw new AggregateError(
            [error, cleanupError],
            "Portfolio motion initialization and rollback both failed",
          );
        }
        resetMotionState(root);
        throw error;
      }
      return (): void => {
        cleanupScenes(cleanups);
      };
    }, root);
  } catch (error: unknown) {
    try {
      media.revert();
    } catch (revertError: unknown) {
      resetMotionState(root);
      throw new AggregateError(
        [error, revertError],
        "Portfolio motion initialization and media rollback both failed",
      );
    }
    resetMotionState(root);
    throw error;
  }
  if (initialAnchor !== null) {
    void document.fonts.ready.then((): void => {
      if (!isActive) {
        return;
      }
      refreshFrame = window.requestAnimationFrame((): void => {
        ScrollTrigger.refresh();
        initialAnchor.scrollIntoView();
      });
    });
  }
  return (): void => {
    isActive = false;
    if (refreshFrame !== null) {
      window.cancelAnimationFrame(refreshFrame);
    }
    media.revert();
    resetMotionState(root);
  };
}
