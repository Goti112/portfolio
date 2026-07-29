# Portfolio Destinations and Project Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the confirmed portfolio destinations and show the verified primary technologies for Mission Planner and Ticket OCR.

**Architecture:** Keep all shared destinations in `src/content/destinations.ts` so Spanish and English consume one immutable source of truth. Keep project technology labels in the locale content files because they are rendered as project copy, while enforcing parity through the existing content validation contract.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Playwright

## Global Constraints

- Publish only the confirmed email, GitHub profile, QGC Planner repository, and Ticket OCR repository.
- Keep BorderPass AI pending with `AI` and `CBAM`.
- Keep project images and secondary experiment destinations unchanged.
- Use `TypeScript`, `React`, `Mapbox GL`, and `Cesium` for QGC Planner.
- Use `Dart`, `Flutter`, `Google ML Kit`, and `XLSX` for Ticket OCR.
- Do not add dependencies or change components, styling, or link behavior.

---

### Task 1: Publish Confirmed Destinations and Verified Project Stacks

**Files:**
- Modify: `tests/projects.spec.ts`
- Modify: `src/content/destinations.ts`
- Modify: `src/content/portfolio.en.ts`
- Modify: `src/content/portfolio.es.ts`

**Interfaces:**
- Consumes: `ExternalDestination` and `PrimaryProjectId` from `src/content/types.ts`
- Produces: published `projectRepositories` and `contactDestinations` values consumed by both locale files
- Produces: project `technologies: readonly string[]` values validated for Spanish/English parity

- [ ] **Step 1: Write failing browser tests for the confirmed destinations**

Add these tests to `tests/projects.spec.ts`:

```typescript
test("publishes the confirmed repositories and contact destinations", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "QGC Planner" }))
    .toHaveAttribute("href", "https://github.com/Goti112/Mission-Planner-Demo");
  await expect(page.getByRole("link", { name: "Ticket OCR Scanner" }))
    .toHaveAttribute("href", "https://github.com/Goti112/ticket_app");
  await expect(page.getByRole("link", { name: "EMAIL" }))
    .toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GITHUB" }))
    .toHaveAttribute("href", "https://github.com/Goti112");

  const borderPass = page.locator("[data-project-case='borderpass-ai']");
  await expect(borderPass.locator(".external-action--pending")).toHaveAttribute("aria-disabled", "true");
});
```

- [ ] **Step 2: Write failing browser tests for the verified technology labels**

Add this parameterized test to `tests/projects.spec.ts`:

```typescript
for (const route of ["/", "/es"] as const) {
  test(`shows verified project technologies on ${route}`, async ({ page }) => {
    await page.goto(route);

    await expect(
      page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"),
    ).toHaveText(["TypeScript", "React", "Mapbox GL", "Cesium"]);
    await expect(
      page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"),
    ).toHaveText(["AI", "CBAM"]);
    await expect(
      page.locator("[data-project-case='ticket-ocr'] .project-evidence__techs li"),
    ).toHaveText(["Dart", "Flutter", "Google ML Kit", "XLSX"]);
  });
}
```

Change the existing pending-destination assertion from:

```typescript
await expect(page.locator(".external-action--pending[aria-disabled='true']")).toHaveCount(8);
```

to:

```typescript
await expect(page.locator(".external-action--pending[aria-disabled='true']")).toHaveCount(4);
```

- [ ] **Step 3: Run the focused tests and verify the expected failures**

Run:

```powershell
npm run build
npm run test:e2e:built -- tests/projects.spec.ts --project=desktop-chromium
```

Expected: the destination test fails because the four actions are still pending; both technology tests fail because QGC Planner and Ticket OCR still use their shorter old label lists; the pending-count assertion fails with eight actual pending actions.

- [ ] **Step 4: Publish the confirmed destinations**

Replace the shared destination values in `src/content/destinations.ts` with:

```typescript
const pendingDestination: ExternalDestination = Object.freeze({ status: "pending" });

const publishedDestination = (url: string): ExternalDestination => Object.freeze({
  status: "published",
  url,
});

export const projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>> = Object.freeze({
  "qgc-planner": publishedDestination("https://github.com/Goti112/Mission-Planner-Demo"),
  "borderpass-ai": pendingDestination,
  "ticket-ocr": publishedDestination("https://github.com/Goti112/ticket_app"),
});

export const contactDestinations: Readonly<{
  email: ExternalDestination;
  github: ExternalDestination;
}> = Object.freeze({
  email: publishedDestination("mailto:mmanz2606@gmail.com"),
  github: publishedDestination("https://github.com/Goti112"),
});
```

Keep `experimentRepositories` unchanged between these declarations.

- [ ] **Step 5: Replace the project technology labels in both locales**

In both `src/content/portfolio.en.ts` and `src/content/portfolio.es.ts`, use:

```typescript
technologies: ["TypeScript", "React", "Mapbox GL", "Cesium"],
```

for `qgc-planner`, retain:

```typescript
technologies: ["AI", "CBAM"],
```

for `borderpass-ai`, and use:

```typescript
technologies: ["Dart", "Flutter", "Google ML Kit", "XLSX"],
```

for `ticket-ocr`.

- [ ] **Step 6: Run focused validation and verify green**

Run:

```powershell
npm run validate:content
npm run test:content
npm run build
npm run test:e2e:built -- tests/projects.spec.ts --project=desktop-chromium
```

Expected: all commands exit with code 0 and every project test passes.

- [ ] **Step 7: Run the complete repository validation**

Run:

```powershell
npm run validate
```

Expected: content validation, content contract tests, ESLint, type checking, production build, performance audit, and the full Playwright suite all exit with code 0.

- [ ] **Step 8: Review and commit the implementation**

Run:

```powershell
git --no-pager diff --check
git --no-pager diff
git add tests/projects.spec.ts src/content/destinations.ts src/content/portfolio.en.ts src/content/portfolio.es.ts
git commit -m "feat: publish portfolio links and project stacks"
```

Confirm the diff contains no image, BorderPass destination, experiment destination, component, style, or dependency changes.

- [ ] **Step 9: Push the validated commits**

Run:

```powershell
git status --short --branch
git push origin main
```

Expected: local `main` is clean and synchronized with `origin/main`, allowing Vercel to redeploy from the new commit.
