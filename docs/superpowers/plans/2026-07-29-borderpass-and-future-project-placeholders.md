# BorderPass and Future Project Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish BorderPass AI with its confirmed repository and technology stack, then turn secondary projects into three accessible `?` placeholders.

**Architecture:** Keep primary-project repository data in `destinations.ts` and the bilingual content modules as the source of project copy. Replace the experiment model with a future-project placeholder model, so `ExperimentMontage` can render no categories or external actions while its three-card and motion contracts stay intact.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Playwright, CSS.

## Global Constraints

- BorderPass destination is exactly `https://github.com/Goti112/borderpass-ai`.
- BorderPass technologies are exactly `Next.js`, `TypeScript`, `PostgreSQL`, and `Prisma` in both locales.
- Secondary Files retains exactly three cards; every card visibly renders only `?`, with no project name, category, or link.
- Keep the current semantic experiment region, `data-experiment-stage`, `data-experiment-strip`, and `data-experiment-card` attributes so the GSAP scene remains compatible.
- Do not add dependencies or alter unrelated content, layout, or motion behavior.

---

### Task 1: Publish the confirmed BorderPass evidence

**Files:**
- Modify: `src/content/destinations.ts:1-30`
- Modify: `src/content/portfolio.en.ts:66-80`
- Modify: `src/content/portfolio.es.ts:66-80`
- Modify: `tests/projects.spec.ts:23-59,120-133`

**Interfaces:**
- Consumes: `projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>>`.
- Produces: `projectRepositories["borderpass-ai"]` with `{ status: "published", url: "https://github.com/Goti112/borderpass-ai" }` and bilingual `PrimaryProject.technologies` sequences shared by the browser tests.

- [ ] **Step 1: Rewrite the BorderPass browser assertions to state the published contract**

  In `tests/projects.spec.ts`, replace the pending BorderPass assertion with the exact destination and verify its action is active:

  ```ts
  await expect(page.getByRole("link", { name: "BorderPass AI" }))
    .toHaveAttribute("href", "https://github.com/Goti112/borderpass-ai");
  await expect(page.locator("[data-project-case='borderpass-ai'] .external-action--active")).toHaveCount(1);
  ```

  Update the launch-module test to select the BorderPass link and assert its destination label is `github.com/Goti112/borderpass-ai`. Change both locale technology assertions to:

  ```ts
  await expect(
    page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"),
  ).toHaveText(["Next.js", "TypeScript", "PostgreSQL", "Prisma"]);
  ```

  While the secondary entries are still pending in this task, update the pending-destination assertion from `4` to `3`.

- [ ] **Step 2: Run the focused browser contract and verify it fails**

  Run: `npm run build && npx playwright test tests/projects.spec.ts --project=desktop-chromium`

  Expected: FAIL because BorderPass remains a pending destination and exposes `AI`, `CBAM` rather than the four verified technologies.

- [ ] **Step 3: Publish BorderPass and replace its evidence tags**

  In `src/content/destinations.ts`, set the BorderPass entry to:

  ```ts
  "borderpass-ai": publishedDestination("https://github.com/Goti112/borderpass-ai"),
  ```

  In both `portfolio.en.ts` and `portfolio.es.ts`, replace only BorderPass's technology array with:

  ```ts
  technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
  ```

- [ ] **Step 4: Run the focused browser contract and verify it passes**

  Run: `npm run build && npx playwright test tests/projects.spec.ts --project=desktop-chromium`

  Expected: PASS; BorderPass renders one active launch module pointing to the public GitHub repository and four verified labels.

- [ ] **Step 5: Commit the independently verified BorderPass update**

  ```bash
  git add src/content/destinations.ts src/content/portfolio.en.ts src/content/portfolio.es.ts tests/projects.spec.ts
  git commit -m "feat: publish borderpass repository"
  ```

### Task 2: Model and render future-project placeholders

**Files:**
- Modify: `src/content/types.ts:3-31`
- Modify: `src/content/destinations.ts:1-22`
- Modify: `src/content/portfolio.en.ts:1-5,91-99`
- Modify: `src/content/portfolio.es.ts:1-5,91-99`
- Modify: `src/lib/content-validation.ts:34-47,102-109,151-154`
- Modify: `scripts/test-content-validation.ts:44-53`
- Modify: `src/components/portfolio/PortfolioPage.tsx:20-27`
- Modify: `src/components/portfolio/ExperimentMontage.tsx:1-36`
- Modify: `src/styles/previews.css:296-334`
- Modify: `tests/projects.spec.ts:136-190`

**Interfaces:**
- Consumes: `PortfolioContent.experiments.items` and the existing `data-experiment-*` selectors used by `create-experiment-montage-scene.ts`.
- Produces: `Experiment` entries shaped as `{ id: FutureProjectId; marker: "?"; ariaLabel: string }`; the visible marker is hidden from assistive technology and each article receives its translated `aria-label`.

- [ ] **Step 1: Replace secondary-project assertions with placeholder assertions**

  In `tests/projects.spec.ts`, replace all `Web Game`, `Roblox Game`, and `AI Wrapped` expectations with this contract:

  ```ts
  for (const [route, labels] of [
    ["/", ["Future project 01", "Future project 02", "Future project 03"]],
    ["/es", ["Próximo proyecto 01", "Próximo proyecto 02", "Próximo proyecto 03"]],
  ] as const) {
    await page.goto(route);
    const cards = page.locator("[data-experiment-card]");
    await expect(cards).toHaveCount(3);
    await expect(cards.locator(".experiment-montage__placeholder")).toHaveText(["?", "?", "?"]);
    await expect(cards.locator(".external-action")).toHaveCount(0);
    for (const [index, label] of labels.entries()) {
      await expect(cards.nth(index)).toHaveAttribute("aria-label", label);
    }
  }
  ```

  Replace the pending-link test with assertions that the page has no `.external-action--pending` and no `LINK_PENDING` text.

  In `scripts/test-content-validation.ts`, change the mismatch fixture so the first experiment has `id: "future-project-03"` and expect `Experiment immutable data differ between Spanish and English content`.

- [ ] **Step 2: Run the content and browser checks to verify they fail**

  Run: `npm run test:content && npm run build && npx playwright test tests/projects.spec.ts --project=desktop-chromium --project=mobile-chromium`

  Expected: FAIL because experiments still expose their old names, categories, and pending launch modules.

- [ ] **Step 3: Replace the experiment data model and bilingual content**

  In `src/content/types.ts`, define the placeholder identifier and model:

  ```ts
  export type FutureProjectId = "future-project-01" | "future-project-02" | "future-project-03";

  export interface Experiment {
    readonly id: FutureProjectId;
    readonly marker: "?";
    readonly ariaLabel: string;
  }
  ```

  Remove `experimentRepositories` from `destinations.ts` and remove its imports from both portfolio content files. In each locale, populate the three entries with the same IDs and marker plus locale-specific labels:

  ```ts
  { id: "future-project-01", marker: "?", ariaLabel: "Future project 01" },
  { id: "future-project-02", marker: "?", ariaLabel: "Future project 02" },
  { id: "future-project-03", marker: "?", ariaLabel: "Future project 03" },
  ```

  Use `"Próximo proyecto 01"`, `"Próximo proyecto 02"`, and `"Próximo proyecto 03"` for the Spanish `ariaLabel` values.

- [ ] **Step 4: Remove obsolete rendering and validate the new immutable fields**

  In `ExperimentMontage.tsx`, remove the `ExternalAction` import and `pendingLabel` prop. Render each existing article with `aria-label={experiment.ariaLabel}` and only:

  ```tsx
  <span aria-hidden="true" className="experiment-montage__placeholder">{experiment.marker}</span>
  ```

  In `PortfolioPage.tsx`, render `<ExperimentMontage {...content.experiments} />`.

  In `content-validation.ts`, make `experimentSignature` join `${experiment.id}:${experiment.marker}`, assert `marker` and `ariaLabel` are non-empty, and remove the experiment destination validation loop. Keep the three-entry count validation unchanged.

- [ ] **Step 5: Center and size the visible placeholder without changing the strip contract**

  Replace the removed name/category/action-specific CSS with:

  ```css
  .experiment-montage__item {
    align-items: center;
    justify-content: center;
  }

  .experiment-montage__placeholder {
    font-family: var(--font-code);
    font-size: clamp(4rem, 12vw, 9rem);
    line-height: 1;
  }
  ```

  Retain the existing item `display`, dimensions, padding, borders, horizontal-scroll rules, and `data-experiment-*` selectors.

- [ ] **Step 6: Run content and browser verification**

  Run: `npm run validate:content && npm run test:content && npm run build && npx playwright test tests/projects.spec.ts --project=desktop-chromium --project=mobile-chromium`

  Expected: PASS; both routes have three accessible placeholder cards, no secondary-project anchors, and the mobile strip still scrolls and snaps horizontally.

- [ ] **Step 7: Commit the independently verified placeholder work**

  ```bash
  git add src/content/types.ts src/content/destinations.ts src/content/portfolio.en.ts src/content/portfolio.es.ts src/lib/content-validation.ts scripts/test-content-validation.ts src/components/portfolio/PortfolioPage.tsx src/components/portfolio/ExperimentMontage.tsx src/styles/previews.css tests/projects.spec.ts
  git commit -m "feat: reserve secondary projects for future work"
  ```

### Task 3: Validate, publish, and inspect production

**Files:**
- Modify: none
- Verify: `tests/projects.spec.ts`, `tests/accessibility.spec.ts`, production URL

**Interfaces:**
- Consumes: the two feature commits on `main` and Vercel's linked production project.
- Produces: a pushed `main` branch and a fresh production deployment.

- [ ] **Step 1: Run the repository's complete validation suite**

  Run: `npm run validate`

  Expected: all content, lint, type, build, performance, accessibility, desktop, and mobile checks pass.

- [ ] **Step 2: Review the final diff and repository state**

  Run: `git --no-pager diff HEAD~2..HEAD && git status --short && git log --oneline -3`

  Expected: only the BorderPass publication and future-project placeholder changes are present; the working tree is clean.

- [ ] **Step 3: Push the verified commits**

  Run: `git push origin main`

  Expected: remote `main` advances with the two feature commits.

- [ ] **Step 4: Redeploy the current production target**

  Run: `npx vercel redeploy https://portfolio-nk8ckv2z8-sissiii547-4979s-projects.vercel.app --non-interactive`

  Expected: Vercel reports a ready production deployment and preserves the custom-domain alias.

- [ ] **Step 5: Inspect the deployment and report the live URLs**

  Run: `npx vercel inspect <deployment-url>`

  Expected: deployment state is `Ready`; report the generated production URL and `https://www.miquelmanzano.com`.
