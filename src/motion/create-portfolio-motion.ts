import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { gsap } from "gsap";
import { createBuildMethodScene } from "@/motion/scenes/create-build-method-scene";
import { createEvidenceLens } from "@/motion/scenes/create-evidence-lens";
import { createExecutionClaimScene } from "@/motion/scenes/create-execution-claim-scene";
import { createExperimentMontageScene } from "@/motion/scenes/create-experiment-montage-scene";
import { createIntroScene } from "@/motion/scenes/create-intro-scene";
import { createProjectEvidenceScene } from "@/motion/scenes/create-project-evidence-scene";
import { createVerdictScene } from "@/motion/scenes/create-verdict-scene";
import type { MotionConditions } from "@/motion/types";

gsap.registerPlugin(Flip, ScrollTrigger, SplitText);

export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  media.add({
    isDesktop: "(min-width: 960px)",
    isCompact: "(max-width: 959px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
    finePointer: "(pointer: fine)",
  }, (context) => {
    const conditions = context.conditions as unknown as MotionConditions;
    root.dataset.motionState = conditions.reduceMotion ? "reduced" : "ready";
    if (conditions.reduceMotion) {
      return;
    }
    const cleanups = [
      createIntroScene(root, conditions),
      createExecutionClaimScene(root, conditions),
      createBuildMethodScene(root, conditions),
      createProjectEvidenceScene(root, conditions),
      createExperimentMontageScene(root, conditions),
      createVerdictScene(root, conditions),
      createEvidenceLens(root, conditions),
    ];
    return (): void => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, root);
  return (): void => {
    media.revert();
    delete root.dataset.activeScene;
    delete root.dataset.activeProject;
    root.dataset.motionState = "static";
  };
}
