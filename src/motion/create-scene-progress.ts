import { requireElement } from "@/motion/contracts";
import type { SceneCleanup } from "@/motion/types";

const progressByScene = Object.freeze({
  intro: "01",
  claim: "02",
  method: "03",
  projects: "04",
  experiments: "05",
  verdict: "06",
});

type MotionScene = keyof typeof progressByScene;

function isMotionScene(value: string): value is MotionScene {
  return value in progressByScene;
}

export function createSceneProgress(root: HTMLElement): SceneCleanup {
  const progress = requireElement<HTMLElement>(root, "shell", "[data-progress-value]");
  const updateProgress = (): void => {
    const activeScene = root.dataset.activeScene;
    if (activeScene === undefined) {
      progress.textContent = progressByScene.intro;
      return;
    }
    if (!isMotionScene(activeScene)) {
      throw new Error(`Unknown portfolio motion scene: ${activeScene}`);
    }
    progress.textContent = progressByScene[activeScene];
  };
  const observer = new MutationObserver(updateProgress);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["data-active-scene"],
  });
  updateProgress();

  return (): void => {
    observer.disconnect();
    progress.textContent = progressByScene.intro;
  };
}
