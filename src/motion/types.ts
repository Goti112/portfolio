export interface MotionConditions {
  readonly isDesktop: boolean;
  readonly isCompact: boolean;
  readonly reduceMotion: boolean;
  readonly finePointer: boolean;
}

export type SceneCleanup = () => void;
