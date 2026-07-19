# Project Entry Glitch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the persistent red corruption line with a single 220 ms glitch flash when the Projects section enters the center of the viewport.

**Architecture:** Keep the existing decorative line element in `PortfolioPage`, but make it invisible by default. Extend the existing browser effects script with an `IntersectionObserver` for `[data-motion-section="projects"]`; it activates the line once, removes the active state after `animationend`, and disconnects the observer. CSS owns the visual flash and reduced-motion behavior.

**Tech Stack:** Next.js static export, TypeScript, CSS scroll/motion primitives, Playwright.

## Global Constraints

- The line is decorative, `aria-hidden`, and must not capture pointer events.
- It activates once per page load when Projects reaches the central viewport band.
- It must remain hidden for `prefers-reduced-motion: reduce`.
- Existing cursor, scanline overlay, content reveals, bilingual content, and visual layout remain unchanged.
- No new dependency is introduced.

---

### Task 1: Add the failing browser contract

**Files:**
- Modify: `tests/accessibility.spec.ts`

**Interfaces:**
- Consumes: existing `data-corruption-line` and `data-motion-section="projects"` markers.
- Produces: regression coverage for hidden initial state, one-shot activation, completion, and reduced motion.

- [ ] **Step 1: Add the initial-state and one-shot test**

```ts
test("flashes the corruption line once when Projects enters the center band", async ({ page }) => {
  await page.goto("/");
  const line = page.locator("[data-corruption-line]");
  const projects = page.locator("[data-motion-section='projects']");

  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(line).toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm run test:e2e:built -- --project=desktop-chromium --grep "flashes the corruption line"`

Expected: FAIL because the current scroll-linked line never receives `data-corruption-active` and its base opacity is visible.

- [ ] **Step 3: Extend the reduced-motion assertion**

```ts
await expect(page.locator("[data-corruption-line]")).toBeHidden();
```

The existing reduced-motion test already sets `page.emulateMedia({ reducedMotion: "reduce" })`.

### Task 2: Implement one-shot observation and flash styling

**Files:**
- Modify: `src/browser/portfolio-effects.ts`
- Modify: `src/styles/motion.css`

**Interfaces:**
- Consumes: existing forensic cursor setup and DOM markers.
- Produces: `data-corruption-active="true"` only during the project-entry flash.

- [ ] **Step 1: Resolve and validate the project flash elements**

```ts
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
```

- [ ] **Step 2: Add the one-shot IntersectionObserver**

```ts
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
```

- [ ] **Step 3: Replace continuous scroll animation with a one-shot keyframe**

```css
@keyframes corruption-flash {
  0% {
    opacity: 0;
    transform: translateX(-5vw) skewX(0deg);
  }

  35% {
    opacity: 0.7;
    transform: translateX(0) skewX(-7deg);
  }

  100% {
    opacity: 0;
    transform: translateX(5vw) skewX(0deg);
  }
}

.portfolio-shell__corruption-line {
  opacity: 0;
  pointer-events: none;
}

.portfolio-shell__corruption-line[data-corruption-active="true"] {
  animation: corruption-flash 220ms ease-out both;
}
```

Remove the `[data-corruption-line]` rule from the `@supports (animation-timeline: view())` block and remove the unused `corruption-drift` keyframes.

- [ ] **Step 4: Rebuild the browser bundle**

Run: `npm run build:browser`

Expected: exit code 0 and regenerated ignored file `public/browser/portfolio-effects.js`.

### Task 3: Run focused and full verification

**Files:**
- Verify: `tests/accessibility.spec.ts`, `src/browser/portfolio-effects.ts`, `src/styles/motion.css`

**Interfaces:**
- Consumes: one-shot flash implementation.
- Produces: passing regression and project-wide validation.

- [ ] **Step 1: Run the focused browser test**

Run: `npm run test:e2e:built -- --project=desktop-chromium --grep "flashes the corruption line"`

Expected: PASS.

- [ ] **Step 2: Run lint and type checking**

Run: `npm run lint`

Run: `npm run typecheck`

Expected: both commands exit 0.

- [ ] **Step 3: Run the complete validation suite**

Run: `npm run validate`

Expected: content validation, lint, typecheck, static build, Lighthouse assertions, and all Playwright tests pass; only the existing device-specific skips remain.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check; git status --short`

Expected: no whitespace errors; only the intended source, test, and ignored generated bundle changes are present.
