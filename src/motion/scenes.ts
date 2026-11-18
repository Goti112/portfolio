import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneCleanup } from "@/motion/types";

const noop: SceneCleanup = (): void => undefined;

/**
 * Reveals `[data-reveal]` elements as they scroll into view. Elements that are
 * already on screen when motion starts are left alone so nothing flashes.
 */
export function createRevealMotion(root: HTMLElement): SceneCleanup {
  const fold = window.innerHeight * 0.92;
  const pending = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
    .filter((element) => element.getBoundingClientRect().top > fold);
  if (pending.length === 0) return noop;

  const rising = pending.filter((element) => element.dataset.reveal === "rise");
  const wiping = pending.filter((element) => element.dataset.reveal === "wipe");
  gsap.set(rising, { opacity: 0, y: 36 });
  gsap.set(wiping, { clipPath: "inset(0 100% 0 0)" });

  const triggers: ScrollTrigger[] = [];
  if (rising.length > 0) {
    triggers.push(...ScrollTrigger.batch(rising, {
      start: "top 88%",
      once: true,
      onEnter: (batch): void => {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.09, clearProps: "opacity,transform",
        });
      },
    }));
  }
  if (wiping.length > 0) {
    triggers.push(...ScrollTrigger.batch(wiping, {
      start: "top 90%",
      once: true,
      onEnter: (batch): void => {
        gsap.to(batch, {
          clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut", clearProps: "clipPath",
        });
      },
    }));
  }

  return (): void => {
    triggers.forEach((trigger) => trigger.kill());
    gsap.killTweensOf(pending);
    gsap.set(pending, { clearProps: "opacity,transform,clipPath" });
  };
}

/** Lets the oversized channel numerals drift against the scroll direction. */
export function createGhostParallax(root: HTMLElement): SceneCleanup {
  const tweens = Array.from(root.querySelectorAll<HTMLElement>("[data-ghost]")).map((ghost) => gsap.fromTo(ghost,
    { yPercent: 28 },
    {
      yPercent: -28,
      ease: "none",
      scrollTrigger: { trigger: ghost.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
    },
  ));
  return (): void => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.revert();
    });
  };
}

/** Draws the education signal trace as the timeline scrolls through the viewport. */
export function createTraceMotion(root: HTMLElement): SceneCleanup {
  const list = root.querySelector<HTMLElement>("[data-trace]");
  if (list === null) return noop;
  const items = Array.from(list.querySelectorAll<HTMLElement>("[data-trace-item]"));
  if (list.getBoundingClientRect().top < window.innerHeight * 0.8) return noop;

  const state = { progress: 0 };
  const apply = (): void => {
    list.style.setProperty("--trace-progress", state.progress.toFixed(4));
    items.forEach((item, index) => {
      item.dataset.traceReached = String(state.progress >= index / items.length + 0.02);
    });
  };
  apply();
  const tween = gsap.to(state, {
    progress: 1,
    ease: "none",
    onUpdate: apply,
    scrollTrigger: { trigger: list, start: "top 82%", end: "top 38%", scrub: 0.5 },
  });

  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
    list.style.removeProperty("--trace-progress");
    items.forEach((item) => { delete item.dataset.traceReached; });
  };
}

/** Feeds the pointer position to `[data-spotlight]` panels as CSS variables. */
export function createSpotlightMotion(root: HTMLElement): SceneCleanup {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return noop;
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-spotlight]"));
  const onMove = (event: PointerEvent): void => {
    const panel = event.currentTarget as HTMLElement;
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty("--spot-x", `${(event.clientX - bounds.left).toFixed(1)}px`);
    panel.style.setProperty("--spot-y", `${(event.clientY - bounds.top).toFixed(1)}px`);
  };
  panels.forEach((panel) => panel.addEventListener("pointermove", onMove, { passive: true }));
  return (): void => {
    panels.forEach((panel) => {
      panel.removeEventListener("pointermove", onMove);
      panel.style.removeProperty("--spot-x");
      panel.style.removeProperty("--spot-y");
    });
  };
}

/** Tilts project monitors towards the pointer and moves their glare. */
export function createTiltMotion(root: HTMLElement): SceneCleanup {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return noop;
  const cleanups = Array.from(root.querySelectorAll<HTMLElement>("[data-project-shot]")).map((shot) => {
    gsap.set(shot, { transformPerspective: 1100 });
    const rotateX = gsap.quickTo(shot, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotateY = gsap.quickTo(shot, "rotationY", { duration: 0.5, ease: "power3.out" });
    const onMove = (event: PointerEvent): void => {
      const bounds = shot.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      rotateY((x - 0.5) * 7);
      rotateX((0.5 - y) * 5);
      shot.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
      shot.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
    };
    const onLeave = (): void => {
      rotateX(0);
      rotateY(0);
    };
    shot.addEventListener("pointermove", onMove, { passive: true });
    shot.addEventListener("pointerleave", onLeave);
    return (): void => {
      shot.removeEventListener("pointermove", onMove);
      shot.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(shot);
      gsap.set(shot, { clearProps: "transform" });
      shot.style.removeProperty("--glare-x");
      shot.style.removeProperty("--glare-y");
    };
  });
  return (): void => cleanups.forEach((cleanup) => cleanup());
}

const channelSwitchDurationMs: number = 320;

/** Flashes a burst of static across the screen when a header channel is picked. */
export function createChannelSwitchMotion(root: HTMLElement): SceneCleanup {
  const links = Array.from(root.querySelectorAll<HTMLElement>(".experience-header__navigation a, .experience-header__brand"));
  let timer: number | undefined;
  const onClick = (): void => {
    window.clearTimeout(timer);
    delete root.dataset.channelSwitch;
    // Reading layout restarts the CSS animation when channels are picked in quick succession.
    void root.offsetWidth;
    root.dataset.channelSwitch = "active";
    timer = window.setTimeout((): void => { delete root.dataset.channelSwitch; }, channelSwitchDurationMs);
  };
  links.forEach((link) => link.addEventListener("click", onClick));
  return (): void => {
    window.clearTimeout(timer);
    delete root.dataset.channelSwitch;
    links.forEach((link) => link.removeEventListener("click", onClick));
  };
}
