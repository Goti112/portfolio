const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

if (hasFinePointer && !reducedMotion) {
  const cursor = document.querySelector<HTMLElement>("[data-forensic-cursor]");

  if (cursor === null) {
    throw new Error("Portfolio effects could not resolve the forensic cursor");
  }

  let frame: number | null = null;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("pointermove", (event: PointerEvent): void => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    if (frame === null) {
      frame = requestAnimationFrame((): void => {
        frame = null;
        cursor.style.setProperty("--cursor-x", `${cursorX}px`);
        cursor.style.setProperty("--cursor-y", `${cursorY}px`);
      });
    }
  }, { passive: true });

  document.addEventListener("pointerover", (event: PointerEvent): void => {
    if ((event.target as HTMLElement | null)?.closest("[data-probe]") !== null) {
      cursor.dataset.cursorActive = "true";
    }
  }, { passive: true });

  document.addEventListener("pointerout", (event: PointerEvent): void => {
    if ((event.target as HTMLElement | null)?.closest("[data-probe]") !== null) {
      delete cursor.dataset.cursorActive;
    }
  }, { passive: true });
}

const corruptionLine = document.querySelector<HTMLElement>("[data-corruption-line]");
const projectsSection = document.querySelector<HTMLElement>("[data-motion-section='projects']");

if (!reducedMotion) {
  if (corruptionLine === null) {
    throw new Error("Portfolio effects could not resolve the corruption line");
  }

  if (projectsSection === null) {
    throw new Error("Portfolio effects could not resolve the Projects section");
  }
}

if (!reducedMotion && corruptionLine !== null && projectsSection !== null) {
  const projectObserver = new IntersectionObserver((entries: readonly IntersectionObserverEntry[]): void => {
    const enteredProjects = entries.some((entry: IntersectionObserverEntry): boolean => entry.isIntersecting);

    if (!enteredProjects) {
      return;
    }

    corruptionLine.dataset.corruptionActive = "true";
    projectObserver.disconnect();
    corruptionLine.addEventListener("animationend", (): void => {
      delete corruptionLine.dataset.corruptionActive;
    }, { once: true });
  }, { rootMargin: "-30% 0px -45% 0px", threshold: 0 });

  projectObserver.observe(projectsSection);
}
