import { gsap } from "gsap";
import { MotionContractError, requireElement, requireElements } from "@/motion/contracts";
import type { MotionConditions, SceneCleanup } from "@/motion/types";

interface HorizontalRange {
  readonly startX: number;
  readonly endX: number;
  readonly distance: number;
}

interface ExperimentCards {
  readonly all: readonly [HTMLElement, HTMLElement, HTMLElement];
  readonly first: HTMLElement;
  readonly middle: HTMLElement;
  readonly last: HTMLElement;
}

function requireExperimentCards(elements: readonly HTMLElement[], scene: string): ExperimentCards {
  if (elements.length !== 3) {
    throw new MotionContractError(
      scene,
      "exactly three [data-experiment-card] elements",
      window.location.pathname,
    );
  }
  const [first, middle, last] = elements;
  if (first === undefined || middle === undefined || last === undefined) {
    throw new MotionContractError(
      scene,
      "exactly three [data-experiment-card] elements",
      window.location.pathname,
    );
  }
  return {
    all: [first, middle, last],
    first,
    middle,
    last,
  };
}

function measureHorizontalRange(
  stage: HTMLElement,
  strip: HTMLElement,
  cards: ExperimentCards,
  scene: string,
): HorizontalRange {
  if (cards.first.offsetParent !== strip || cards.last.offsetParent !== strip) {
    throw new MotionContractError(
      scene,
      "experiment cards positioned by their strip",
      window.location.pathname,
    );
  }
  const stageCenter = stage.clientWidth / 2;
  const firstCenter = cards.first.offsetLeft + cards.first.offsetWidth / 2;
  const lastCenter = cards.last.offsetLeft + cards.last.offsetWidth / 2;
  const startX = stageCenter - firstCenter;
  const endX = stageCenter - lastCenter;
  return {
    startX,
    endX,
    distance: Math.max(0, startX - endX),
  };
}

function measureScrollDistance(
  stage: HTMLElement,
  strip: HTMLElement,
  cards: ExperimentCards,
  scene: string,
): number {
  const range = measureHorizontalRange(stage, strip, cards, scene);
  return Math.max(window.innerHeight, range.distance + window.innerHeight * 0.25);
}

export function createExperimentMontageScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "experiments";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='experiments']");
  if (!conditions.isDesktop) {
    return (): void => undefined;
  }
  const stage = requireElement<HTMLElement>(section, scene, "[data-experiment-stage]");
  const strip = requireElement<HTMLElement>(stage, scene, "[data-experiment-strip]");
  const cards = requireExperimentCards(
    requireElements<HTMLElement>(strip, scene, "[data-experiment-card]"),
    scene,
  );
  gsap.set(cards.all, { scale: 0.94, opacity: 0.58 });
  gsap.set(cards.first, { scale: 1, opacity: 1 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: (): string => `+=${measureScrollDistance(stage, strip, cards, scene)}`,
      pin: true,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: (): void => {
        root.dataset.activeScene = scene;
      },
      onEnterBack: (): void => {
        root.dataset.activeScene = scene;
      },
    },
  });
  timeline
    .fromTo(
      strip,
      { x: (): number => measureHorizontalRange(stage, strip, cards, scene).startX },
      {
        x: (): number => measureHorizontalRange(stage, strip, cards, scene).endX,
        duration: 0.84,
        ease: "none",
      },
      0,
    )
    .to(cards.first, { scale: 0.94, opacity: 0.58, duration: 0.2 }, 0.12)
    .to(cards.middle, { scale: 1, opacity: 1, duration: 0.2 }, 0.22)
    .to(cards.middle, { scale: 0.94, opacity: 0.58, duration: 0.18 }, 0.54)
    .to(cards.last, { scale: 1, opacity: 1, duration: 0.2 }, 0.62)
    .to({}, { duration: 0.16 }, 0.84);

  return (): void => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    gsap.set([strip, ...cards.all], { clearProps: "transform,opacity,visibility" });
  };
}
