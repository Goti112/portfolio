# Centered Project Evidence Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the desktop project-preview panel vertically centered while the project cases scroll past it.

**Architecture:** Replace the project visual stage's GSAP pin with CSS sticky positioning at the existing desktop motion breakpoint. GSAP remains responsible for updating the active project and crossfading previews; CSS owns the panel's viewport-centered geometry, avoiding the preserved grid offset that currently moves it too low.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP/ScrollTrigger, CSS, Playwright.

## Global Constraints

- Apply the layout change only at `min-width: 960px` with `[data-motion-state="ready"]`.
- Keep the evidence lens, project preview content, project crossfade, existing copy track, and compact/mobile inline previews unchanged.
- Preserve the project-case ScrollTriggers and their active-project data contract.
- Do not add dependencies.

---

## File Structure

- `src/styles/previews.css` owns the desktop visual-stage size and the new viewport-centered sticky position.
- `src/motion/scenes/create-project-evidence-scene.ts` owns desktop project activation and preview crossfades; it will no longer pin the visual stage.
- `tests/motion-experience.spec.ts` owns browser-level geometry checks for desktop motion.

### Task 1: Center the desktop project preview stage

**Files:**
- Modify: `tests/motion-experience.spec.ts` after the project progress test
- Modify: `src/styles/previews.css` in the desktop ready-motion visual-stage rule
- Modify: `src/motion/scenes/create-project-evidence-scene.ts` in `createProjectEvidenceScene`

**Interfaces:**
- Consumes: `[data-project-visual-stage]`, `[data-project-case]`, and the existing `data-motion-state="ready"` contract.
- Produces: A desktop visual stage whose vertical center equals the viewport vertical center while the first project case is active.

- [ ] **Step 1: Write the failing desktop geometry test**

Add this test after `updates scene and project progress while scrolling` in `tests/motion-experience.spec.ts`:

```ts
test("keeps the desktop project preview centered while project evidence scrolls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop project-stage assertion");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");

  const firstCase = page.locator("[data-project-case='qgc-planner']");
  await firstCase.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: "instant" }));

  const centerOffset = await page.locator("[data-project-visual-stage]").evaluate((stage) => {
    const bounds = stage.getBoundingClientRect();
    return Math.abs(bounds.top + bounds.height / 2 - window.innerHeight / 2);
  });
  expect(centerOffset).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Run the test to verify it fails against the current GSAP pin**

Run: `npx playwright test tests/motion-experience.spec.ts --grep "keeps the desktop project preview centered" --project=desktop-chromium`

Expected: FAIL because the fixed stage retains its grid offset; at a 900px viewport its center is substantially below 450px.

- [ ] **Step 3: Make the visual stage sticky and viewport-centered**

In `src/styles/previews.css`, replace the desktop ready-motion visual-stage rule with:

```css
[data-motion-state="ready"] [data-project-visual-stage] {
  display: block;
  position: sticky;
  top: calc((100svh - min(70vh, 48rem)) / 2);
}
```

Keep the existing `height: min(70vh, 48rem)` on `[data-project-visual-stage]`; this makes the top offset exactly half of the remaining viewport height.

- [ ] **Step 4: Remove only the GSAP pin lifecycle**

In `createProjectEvidenceScene`, delete the `const pin = ScrollTrigger.create({ ... })` block that pins `visualStage`. Keep `visualStage` and `previews` queries, initial preview visibility, the case triggers, and all crossfade logic. In the returned cleanup, remove `pin.kill()` and retain case-trigger and preview cleanup:

```ts
return (): void => {
  caseTriggers.forEach((trigger) => trigger.kill());
  gsap.killTweensOf(previews);
  gsap.set(previews, { clearProps: "all" });
};
```

- [ ] **Step 5: Run the focused test to verify the centered sticky panel**

Run: `npx playwright test tests/motion-experience.spec.ts --grep "keeps the desktop project preview centered" --project=desktop-chromium`

Expected: PASS. The stage center is within one pixel of the viewport center after scrolling into the first project case.

- [ ] **Step 6: Run regression checks**

Run:

```bash
npm run lint
npm run typecheck
npm run build
npx playwright test tests/motion-experience.spec.ts --project=desktop-chromium
npx playwright test tests/projects.spec.ts
```

Expected: all commands exit with code 0; desktop preview crossfades and mobile inline previews retain their existing contracts.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/styles/previews.css src/motion/scenes/create-project-evidence-scene.ts tests/motion-experience.spec.ts
git commit -m "fix: center project evidence preview"
```

