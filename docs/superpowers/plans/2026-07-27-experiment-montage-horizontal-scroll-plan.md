# Experiment Montage Horizontal Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the three-card secondary-project montage as a complete horizontal scroll sequence on desktop and a native touch-scrollable strip on compact layouts.

**Architecture:** Keep `ExperimentMontage` as the semantic content owner and add one explicit stage contract around its existing strip. CSS owns the readable static layout and compact scroll snapping; the existing `createExperimentMontageScene` factory owns one desktop GSAP timeline, one ScrollTrigger pin, measured card-centering geometry, emphasis, refresh, and cleanup.

**Tech Stack:** Next.js 16 static export, React 19, strict TypeScript, CSS Grid and scroll snap, GSAP 3.15 with ScrollTrigger, Playwright 1.61.

## Global Constraints

- Keep the three experiment titles, categories, repository destinations, and order unchanged.
- Keep all three experiment articles in their natural DOM order and do not clone essential content.
- Desktop uses native vertical scroll to control one pinned horizontal timeline.
- Desktop creates no more than the four approved pin spacers.
- Compact layouts below `960px` create no GSAP pin and use native horizontal touch scrolling.
- Reduced-motion layouts create no pin, scrubbed translation, scaling, or opacity choreography.
- The third card must be completely visible before the desktop scene releases.
- The page must not gain horizontal overflow.
- Animate only `transform` and `opacity`; do not add an animation dependency or smooth-scroll layer.
- Preserve JavaScript-disabled content, keyboard order, visible focus, both locales, and existing performance budgets.

## File structure

- `src/components/portfolio/ExperimentMontage.tsx` — owns the semantic stage, strip, and three card markers.
- `src/styles/previews.css` — owns shared and desktop stage/card presentation.
- `src/styles/responsive.css` — owns compact native horizontal scrolling and scroll snapping.
- `src/styles/motion.css` — owns styles that apply only after desktop motion initializes.
- `src/motion/scenes/create-experiment-montage-scene.ts` — measures card centers and owns the desktop GSAP timeline and cleanup.
- `tests/projects.spec.ts` — verifies semantic structure and compact native-scroll behavior.
- `tests/motion-experience.spec.ts` — verifies desktop pinning, horizontal traversal, final-card visibility, pin budget, breakpoint cleanup, and reduced motion.
- `tests/accessibility.spec.ts` — verifies that JavaScript-disabled output still contains the complete experiment montage.

---

### Task 1: Add the semantic stage and compact native strip

**Files:**
- Modify: `tests/projects.spec.ts:31-36`
- Modify: `src/components/portfolio/ExperimentMontage.tsx:13-25`
- Modify: `src/styles/previews.css:267-325`
- Modify: `src/styles/responsive.css:40-60`

**Interfaces:**
- Consumes: existing `data-scene="experiments"`, `data-experiment-strip`, and the fixed three-item `Experiment` collection.
- Produces: one `[data-experiment-stage]` containing one strip and three `[data-experiment-card]` articles; compact CSS exposes the strip as the only horizontal scroll container.

- [ ] **Step 1: Add the failing semantic-stage test**

Replace the existing subordinate-montage test in `tests/projects.spec.ts` with:

```ts
test("keeps secondary work in one semantic three-card stage", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-experiment-stage]");
  const strip = stage.locator("[data-experiment-strip]");

  await expect(stage).toHaveCount(1);
  await expect(strip).toHaveCount(1);
  await expect(strip.locator("[data-experiment-card]")).toHaveCount(3);
  await expect(strip.locator("[data-experiment-card]").nth(0)).toContainText("Web Game");
  await expect(strip.locator("[data-experiment-card]").nth(1)).toContainText("Roblox Game");
  await expect(strip.locator("[data-experiment-card]").nth(2)).toContainText("AI Wrapped");
});
```

- [ ] **Step 2: Add the failing compact-scroll test**

Append this test to `tests/projects.spec.ts`:

```ts
test("uses a native horizontal snap strip for compact experiments", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Compact-only assertion");
  await page.goto("/");

  const strip = page.locator("[data-experiment-strip]");
  const layout = await strip.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      bodyHasHorizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth,
      canScrollHorizontally: element.scrollWidth > element.clientWidth,
      gridAutoFlow: style.gridAutoFlow,
      overflowX: style.overflowX,
      scrollSnapType: style.scrollSnapType,
    };
  });

  expect(layout).toEqual({
    bodyHasHorizontalOverflow: false,
    canScrollHorizontally: true,
    gridAutoFlow: "column",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
  });

  await strip.evaluate((element) => {
    element.scrollTo({ left: element.scrollWidth, behavior: "instant" });
  });
  await expect.poll(async (): Promise<number> => strip.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);

  const finalBounds = await strip.evaluate((element) => {
    const finalCard = element.querySelector<HTMLElement>("[data-experiment-card]:last-child");
    if (finalCard === null) {
      throw new Error("Compact experiment strip is missing its final card");
    }
    const stripRect = element.getBoundingClientRect();
    const cardRect = finalCard.getBoundingClientRect();
    return {
      leftInset: cardRect.left - stripRect.left,
      rightInset: stripRect.right - cardRect.right,
    };
  });

  expect(finalBounds.leftInset).toBeGreaterThanOrEqual(-1);
  expect(finalBounds.rightInset).toBeGreaterThanOrEqual(-1);
});
```

- [ ] **Step 3: Build and run the focused tests to verify they fail**

Run:

```bash
npm run build
npm run test:e2e:built -- tests/projects.spec.ts --project=mobile-chromium
```

Expected: the semantic test fails because `[data-experiment-stage]` and `[data-experiment-card]` do not exist; the compact test fails because the current cards form one vertical column without horizontal overflow or scroll snapping.

- [ ] **Step 4: Add the stage and card contracts**

Replace the heading/strip block in `ExperimentMontage` with:

```tsx
<p className="experiment-montage__eyebrow">{eyebrow}</p>
<h2 className="experiment-montage__heading" data-motion-reveal>{heading}</h2>
<div className="experiment-montage__stage" data-experiment-stage>
  <div className="experiment-montage__strip" data-experiment-strip>
    {items.map((experiment) => (
      <article
        key={experiment.id}
        className="experiment-montage__item"
        data-experiment-card
        data-motion-reveal
      >
        <span className="experiment-montage__case-id">{experiment.id}</span>
        <h3 className="experiment-montage__name">{experiment.name}</h3>
        <span className="experiment-montage__category">{experiment.category}</span>
        <ExternalAction
          destination={experiment.repository}
          label={experiment.name}
          pendingLabel={pendingLabel}
        />
      </article>
    ))}
  </div>
</div>
```

- [ ] **Step 5: Give the stage a safe shared layout**

Add this rule before `.experiment-montage__strip` in `src/styles/previews.css`:

```css
.experiment-montage__stage {
  min-width: 0;
}
```

Keep the existing three equal columns as the static desktop and JavaScript-disabled presentation:

```css
.experiment-montage__strip {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: var(--scene-border);
  border-bottom: var(--scene-border);
}
```

- [ ] **Step 6: Replace the compact vertical experiment rules with native horizontal scrolling**

Remove `.experiment-montage__strip` from the shared single-column selector at the start of the `max-width: 959.98px` block. Keep that selector as:

```css
.build-method__stages,
.formation-trace__list,
.project-evidence__layout {
  grid-template-columns: minmax(0, 1fr);
}
```

Remove `.experiment-montage__item` from the shared build-stage border rules. Then add:

```css
.experiment-montage__stage {
  overflow: hidden;
}

.experiment-montage__strip {
  grid-template-columns: none;
  grid-auto-flow: column;
  grid-auto-columns: minmax(min(17rem, 82vw), 86vw);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.experiment-montage__item {
  border-right: var(--scene-border);
  border-bottom: 0;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.experiment-montage__item:last-child {
  border-right: 0;
}
```

- [ ] **Step 7: Rebuild and run both project-test viewports**

Run:

```bash
npm run build
npm run test:e2e:built -- tests/projects.spec.ts
```

Expected: all project tests pass in `desktop-chromium` and `mobile-chromium`; the mobile strip scrolls while `document.body` remains within the viewport.

- [ ] **Step 8: Commit the semantic and compact behavior**

```bash
git add tests/projects.spec.ts src/components/portfolio/ExperimentMontage.tsx src/styles/previews.css src/styles/responsive.css
git commit -m "feat: add responsive experiment stage"
```

---

### Task 2: Pin and traverse the three desktop cards with GSAP

**Files:**
- Modify: `tests/motion-experience.spec.ts:1-200`
- Modify: `tests/accessibility.spec.ts:10-25`
- Modify: `src/motion/scenes/create-experiment-montage-scene.ts:1-32`
- Modify: `src/styles/motion.css:94-100`
- Modify: `src/styles/previews.css:267-325`

**Interfaces:**
- Consumes: `[data-experiment-stage]`, `[data-experiment-strip]`, `[data-experiment-card]`, `MotionConditions.isDesktop`, existing registered `ScrollTrigger`, and `MotionContractError`.
- Produces: strict `ExperimentCards` and `HorizontalRange` values, one desktop timeline whose ScrollTrigger pins the experiment section, and cleanup that removes all inline strip/card state.

- [ ] **Step 1: Add the failing desktop traversal test for both locales**

Append this parameterized test to `tests/motion-experience.spec.ts`:

```ts
for (const route of ["/", "/en"] as const) {
  test(`pins and traverses every experiment card on ${route}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop experiment assertion");
    await page.goto(route);
    await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");

    const section = page.locator("[data-scene='experiments']");
    const stage = section.locator("[data-experiment-stage]");
    const strip = section.locator("[data-experiment-strip]");
    const cards = section.locator("[data-experiment-card]");
    await expect(section.locator("xpath=..")).toHaveClass(/pin-spacer/);

    const pinGeometry = await section.evaluate((element) => {
      const spacer = element.parentElement;
      if (spacer === null || !spacer.classList.contains("pin-spacer")) {
        throw new Error("Experiment section is not inside a GSAP pin spacer");
      }
      return {
        distance: spacer.offsetHeight - element.offsetHeight,
        top: spacer.getBoundingClientRect().top + window.scrollY,
      };
    });
    expect(pinGeometry.distance).toBeGreaterThan(0);

    await page.evaluate(({ top }) => {
      window.scrollTo({ top: top + 1, behavior: "instant" });
    }, pinGeometry);
    const startX = await strip.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
    });
    const startCenterDelta = await stage.evaluate((element) => {
      const firstCard = element.querySelector<HTMLElement>("[data-experiment-card]:first-child");
      if (firstCard === null) {
        throw new Error("Experiment stage is missing its first card");
      }
      const stageRect = element.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      return cardRect.left + cardRect.width / 2 - (stageRect.left + stageRect.width / 2);
    });
    expect(Math.abs(startCenterDelta)).toBeLessThanOrEqual(1);

    await page.evaluate(({ distance, top }) => {
      window.scrollTo({ top: top + distance * 0.5, behavior: "instant" });
    }, pinGeometry);
    await page.waitForTimeout(250);
    const middleX = await strip.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
    });
    expect(Math.abs(middleX - startX)).toBeGreaterThan(50);
    await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-active-scene", "experiments");

    await page.evaluate(({ distance, top }) => {
      window.scrollTo({ top: top + distance * 0.99, behavior: "instant" });
    }, pinGeometry);
    await page.waitForTimeout(250);

    const finalState = await stage.evaluate((element) => {
      const finalCard = element.querySelector<HTMLElement>("[data-experiment-card]:last-child");
      const firstCard = element.querySelector<HTMLElement>("[data-experiment-card]:first-child");
      if (finalCard === null || firstCard === null) {
        throw new Error("Experiment stage requires first and final cards");
      }
      const stageRect = element.getBoundingClientRect();
      const finalRect = finalCard.getBoundingClientRect();
      const readScale = (card: HTMLElement): number => {
        const transform = getComputedStyle(card).transform;
        return transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
      };
      return {
        finalLeftInset: finalRect.left - stageRect.left,
        finalRightInset: stageRect.right - finalRect.right,
        finalScale: readScale(finalCard),
        firstScale: readScale(firstCard),
        pageHasHorizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    expect(finalState.finalLeftInset).toBeGreaterThanOrEqual(-1);
    expect(finalState.finalRightInset).toBeGreaterThanOrEqual(-1);
    expect(finalState.finalScale).toBeGreaterThan(finalState.firstScale);
    expect(finalState.pageHasHorizontalOverflow).toBe(false);
    await expect(cards).toHaveCount(3);
  });
}
```

- [ ] **Step 2: Update the failing desktop pin budget**

Replace the existing three-pin assertion with:

```ts
test("creates no more than four approved desktop pin spacers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const pinCount = await page.locator(".pin-spacer").count();
  expect(pinCount).toBeGreaterThan(0);
  expect(pinCount).toBeLessThanOrEqual(4);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(1);
});
```

- [ ] **Step 3: Strengthen compact, reduced-motion, and JavaScript-disabled assertions**

In the existing compact no-pin test, add:

```ts
await expect(page.locator("[data-scene='experiments']").locator("xpath=.."))
  .not.toHaveClass(/pin-spacer/);
```

In the existing reduced-motion test, add:

```ts
const reducedExperimentState = await page.locator("[data-scene='experiments']").evaluate((section) => {
  const strip = section.querySelector<HTMLElement>("[data-experiment-strip]");
  if (strip === null) {
    throw new Error("Reduced-motion experiment scene is missing its strip");
  }
  return {
    cardOpacities: Array.from(section.querySelectorAll<HTMLElement>("[data-experiment-card]"))
      .map((card) => getComputedStyle(card).opacity),
    cardTransforms: Array.from(section.querySelectorAll<HTMLElement>("[data-experiment-card]"))
      .map((card) => getComputedStyle(card).transform),
    stripTransform: getComputedStyle(strip).transform,
  };
});
expect(reducedExperimentState.cardOpacities).toEqual(["1", "1", "1"]);
expect(reducedExperimentState.cardTransforms).toEqual(["none", "none", "none"]);
expect(reducedExperimentState.stripTransform).toBe("none");
```

Append this lifecycle test to `tests/motion-experience.spec.ts`:

```ts
test("remounts one experiment pin across desktop and compact breakpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop lifecycle assertion");
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  const section = page.locator("[data-scene='experiments']");
  const originalViewport = page.viewportSize();
  if (originalViewport === null) {
    throw new Error("Experiment lifecycle test requires a configured viewport");
  }

  await expect(section.locator("xpath=..")).toHaveClass(/pin-spacer/);
  await page.setViewportSize({ width: 959, height: originalViewport.height });
  await page.waitForTimeout(350);
  await expect(section.locator("xpath=..")).not.toHaveClass(/pin-spacer/);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(0);
  await expect(section.locator("[data-experiment-strip]")).toHaveCSS("transform", "none");

  await page.setViewportSize(originalViewport);
  await page.waitForTimeout(350);
  await expect(section.locator("xpath=..")).toHaveClass(/pin-spacer/);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(1);
});
```

In the JavaScript-disabled hiring-argument test in `tests/accessibility.spec.ts`, add:

```ts
await expect(page.locator("[data-experiment-card]")).toHaveCount(3);
await expect(page.getByRole("heading", { level: 3, name: "AI Wrapped" })).toBeVisible();
```

- [ ] **Step 4: Build and run the focused tests to verify they fail**

Run:

```bash
npm run build
npm run test:e2e:built -- tests/motion-experience.spec.ts tests/accessibility.spec.ts --project=desktop-chromium --grep "experiment|four approved|JavaScript"
```

Expected: the traversal tests fail because the current experiment section has no pin spacer and its strip transform does not advance through a measured pinned range. The pin-budget test fails because no experiment pin exists.

- [ ] **Step 5: Replace the experiment scene with measured range helpers**

Replace `src/motion/scenes/create-experiment-montage-scene.ts` with:

```ts
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

function requireExperimentCards(
  elements: readonly HTMLElement[],
  scene: string,
): ExperimentCards {
  const first = elements[0];
  const middle = elements[1];
  const last = elements[2];
  if (elements.length !== 3 || first === undefined || middle === undefined || last === undefined) {
    throw new MotionContractError(scene, "exactly three [data-experiment-card] elements", window.location.pathname);
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
    throw new MotionContractError(scene, "experiment cards positioned by their strip", window.location.pathname);
  }
  const stageCenter = stage.clientWidth / 2;
  const startX = stageCenter - (cards.first.offsetLeft + cards.first.offsetWidth / 2);
  const endX = stageCenter - (cards.last.offsetLeft + cards.last.offsetWidth / 2);
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

export function createExperimentMontageScene(
  root: HTMLElement,
  conditions: MotionConditions,
): SceneCleanup {
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
  const setActiveScene = (): void => {
    root.dataset.activeScene = scene;
  };
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: (): string => `+=${measureScrollDistance(stage, strip, cards, scene)}`,
      pin: true,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: setActiveScene,
      onEnterBack: setActiveScene,
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
    .fromTo(
      cards.first,
      { scale: 1, opacity: 1 },
      { scale: 0.94, opacity: 0.58, duration: 0.2, ease: "none" },
      0.12,
    )
    .fromTo(
      cards.middle,
      { scale: 0.94, opacity: 0.58 },
      { scale: 1, opacity: 1, duration: 0.2, ease: "none" },
      0.22,
    )
    .to(cards.middle, { scale: 0.94, opacity: 0.58, duration: 0.18, ease: "none" }, 0.54)
    .fromTo(
      cards.last,
      { scale: 0.94, opacity: 0.58 },
      { scale: 1, opacity: 1, duration: 0.2, ease: "none" },
      0.62,
    )
    .to({}, { duration: 0.16 }, 0.84);

  return (): void => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    gsap.set([strip, ...cards.all], { clearProps: "transform,opacity,visibility" });
  };
}
```

- [ ] **Step 6: Add the desktop stage and motion presentation**

Add these rules to the existing `min-width: 960px` block in `src/styles/previews.css` so ScrollTrigger measures the final card geometry before motion initializes. The stage remains natively scrollable if JavaScript never enhances it:

```css
.experiment-montage {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.experiment-montage__stage {
  overflow-x: auto;
}

.experiment-montage__strip {
  width: max-content;
  grid-template-columns: repeat(3, clamp(24rem, 42vw, 36rem));
}
```

Then extend the existing `min-width: 960px` motion block in `src/styles/motion.css` to:

```css
@media (min-width: 960px) {
  [data-motion-state="ready"] [data-experiment-stage] {
    overflow: clip;
  }

  [data-motion-state="ready"] [data-experiment-card] {
    transform-origin: center;
  }
}
```

Do not add hidden initial states. Before GSAP initializes, the base three-column layout remains visible.

- [ ] **Step 7: Rebuild and run the focused desktop, compact, and reduced-motion tests**

Run:

```bash
npm run build
npm run test:e2e:built -- tests/motion-experience.spec.ts tests/projects.spec.ts tests/accessibility.spec.ts
```

Expected: both locale traversal tests pass on desktop; the third card is fully inside the stage at the final sample; the experiment scene contributes one pin without exceeding four; compact and reduced-motion projects create no pins; JavaScript-disabled output contains all three cards.

- [ ] **Step 8: Verify breakpoint cleanup does not duplicate the experiment pin**

Run the existing breakpoint test directly:

```bash
npm run test:e2e:built -- tests/motion-experience.spec.ts --project=desktop-chromium --grep "breakpoint"
```

Expected: PASS, with no pin spacer after the forced compact match. Then run the desktop traversal test once more:

```bash
npm run test:e2e:built -- tests/motion-experience.spec.ts --project=desktop-chromium --grep "traverses every experiment"
```

Expected: two passing tests, one for `/` and one for `/en`, with exactly one experiment section inside a pin spacer on each fresh page.

- [ ] **Step 9: Run repository-wide verification**

Run:

```bash
npm run validate
git --no-pager diff --check
git status --short
```

Expected: content validation, content tests, ESLint, strict TypeScript, production build, Lighthouse budgets, and the complete Playwright suite pass. The diff check reports no whitespace errors, and status lists only the intended source, test, specification, and plan changes.

- [ ] **Step 10: Commit the horizontal GSAP sequence**

```bash
git add docs/superpowers/specs/2026-07-27-experiment-montage-horizontal-scroll-design.md docs/superpowers/plans/2026-07-27-experiment-montage-horizontal-scroll-plan.md tests/motion-experience.spec.ts tests/accessibility.spec.ts src/motion/scenes/create-experiment-montage-scene.ts src/styles/motion.css
git commit -m "feat: restore horizontal experiment montage"
```
