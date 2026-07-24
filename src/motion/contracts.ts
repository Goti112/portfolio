export class MotionContractError extends Error {
  public constructor(scene: string, selector: string, route: string) {
    super(`Motion contract failed for scene ${scene} on ${route}: missing ${selector}`);
    this.name = "MotionContractError";
  }
}

export function requireElement<T extends Element>(root: ParentNode, scene: string, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) {
    throw new MotionContractError(scene, selector, window.location.pathname);
  }
  return element;
}

export function requireElements<T extends Element>(root: ParentNode, scene: string, selector: string): readonly T[] {
  const elements = Array.from(root.querySelectorAll<T>(selector));
  if (elements.length === 0) {
    throw new MotionContractError(scene, selector, window.location.pathname);
  }
  return elements;
}
