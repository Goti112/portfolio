# External Action Launch Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every plain portfolio external action and Unicode arrow with the approved two-column Launch Module, real destination metadata, an SVG icon bay, polished interaction states, and compact-safe layout.

**Architecture:** Keep `ExternalAction` as the single renderer and add one private pure formatter for display destinations. Give the component stable child classes for active and pending states, then implement the visual system in the existing section and responsive styles without adding dependencies or changing destination data.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, CSS, Playwright

## Global Constraints

- Use the approved dark Launch Module with a red side rail and separate light icon bay.
- Show the real destination without `https://` or `mailto:` beneath each published action label.
- Remove the Unicode `↗` and use an inline decorative SVG external-link arrow.
- Keep pending actions as disabled non-anchor spans with the same two-column geometry.
- Preserve all destinations, labels, content, navigation behavior, project images, and BorderPass availability.
- Add no dependency or icon library.
- Keep the accessible name equal to the existing action label.
- Disable action and arrow transforms under `prefers-reduced-motion: reduce`.

---

### Task 1: Build the Semantic Launch Module Structure

**Files:**
- Modify: `tests/projects.spec.ts`
- Modify: `src/components/portfolio/ExternalAction.tsx`

**Interfaces:**
- Consumes: `ExternalDestination` from `src/content/types.ts`
- Produces: `formatDestination(url: string): string`
- Produces: `.external-action__content`, `.external-action__label`, `.external-action__destination`, `.external-action__pending-label`, `.external-action__icon-bay`, and `.external-action__status-mark` elements
- Preserves: `ExternalAction(props: ExternalActionProps): React.JSX.Element`

- [ ] **Step 1: Write the failing structure and destination-metadata test**

Add this test to `tests/projects.spec.ts`:

```typescript
test("renders external actions as semantic launch modules", async ({ page }) => {
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  await expect(planner.locator(".external-action__label")).toHaveText("QGC Planner");
  await expect(planner.locator(".external-action__destination"))
    .toHaveText("github.com/Goti112/Mission-Planner-Demo");
  await expect(planner.locator(".external-action__icon-bay svg")).toHaveCount(1);
  await expect(planner).not.toContainText("↗");

  const email = page.getByRole("link", { name: "EMAIL", exact: true });
  await expect(email.locator(".external-action__destination")).toHaveText("mmanz2606@gmail.com");

  const borderPass = page.locator("[data-project-case='borderpass-ai'] .external-action--pending");
  await expect(borderPass).toHaveAttribute("aria-disabled", "true");
  await expect(borderPass.locator(".external-action__destination")).toHaveCount(0);
  await expect(borderPass.locator("svg")).toHaveCount(0);
  await expect(borderPass.locator(".external-action__status-mark")).toHaveCount(1);
  await expect(borderPass).toContainText("LINK_PENDING");
});
```

This test catches a regression where published destinations are not visible, URL schemes leak into display text, the Unicode arrow returns, or pending actions become links.

- [ ] **Step 2: Run the focused browser test and verify red**

Run:

```powershell
npm run build
npm run test:e2e:built -- tests/projects.spec.ts --project=desktop-chromium
```

Expected: the new test fails because the component does not yet render destination, icon-bay, or status-mark elements.

- [ ] **Step 3: Implement the formatter, SVG, and published module**

Replace the published branch in `src/components/portfolio/ExternalAction.tsx` and add the private helpers:

```tsx
function formatDestination(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^mailto:/, "");
}

function ExternalArrowIcon(): React.JSX.Element {
  return (
    <svg
      className="external-action__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
```

Render a published destination as:

```tsx
<a
  className="external-action"
  href={destination.url}
  rel="noreferrer"
  target="_blank"
  aria-label={label}
>
  <span className="external-action__content">
    <span className="external-action__label">{label}</span>
    <span className="external-action__destination" aria-hidden="true">
      {formatDestination(destination.url)}
    </span>
  </span>
  <span className="external-action__icon-bay" aria-hidden="true">
    <ExternalArrowIcon />
  </span>
</a>
```

- [ ] **Step 4: Implement the pending module structure**

Render a pending destination as:

```tsx
<span className="external-action external-action--pending" aria-disabled="true">
  <span className="external-action__content">
    <span className="external-action__label">{label}</span>
    <span className="external-action__pending-label">{pendingLabel}</span>
  </span>
  <span className="external-action__icon-bay" aria-hidden="true">
    <span className="external-action__status-mark" />
  </span>
</span>
```

- [ ] **Step 5: Run the focused browser test and verify green**

Run:

```powershell
npm run build
npm run test:e2e:built -- tests/projects.spec.ts --project=desktop-chromium
```

Expected: all desktop project tests pass, including the new semantic module test and the existing exact accessible-name assertions.

- [ ] **Step 6: Commit the semantic module**

Run:

```powershell
git --no-pager diff --check
git add tests/projects.spec.ts src/components/portfolio/ExternalAction.tsx
git commit -m "feat: build semantic external action modules"
```

### Task 2: Apply the Launch Module Visual System

**Files:**
- Modify: `tests/projects.spec.ts`
- Modify: `src/styles/sections.css`
- Modify: `src/styles/responsive.css`
- Modify: `src/styles/motion.css`

**Interfaces:**
- Consumes: the child classes created by Task 1
- Produces: two-column layout, red rail, icon-bay states, hover/focus motion, pending styling, truncation, and reduced-motion behavior

- [ ] **Step 1: Write the failing visual-state tests**

Add these tests to `tests/projects.spec.ts`:

```typescript
test("styles active actions as interactive launch modules", async ({ page }) => {
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  const iconBay = planner.locator(".external-action__icon-bay");

  await expect(planner).toHaveCSS("display", "grid");
  expect(await planner.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  )).toBe(2);
  await expect(iconBay).toHaveCSS("background-color", "rgb(238, 232, 222)");

  await planner.hover();
  await expect(iconBay).toHaveCSS("background-color", "rgb(231, 52, 43)");
  await expect.poll(() => planner.evaluate((element) =>
    getComputedStyle(element).transform,
  )).not.toBe("none");

  await planner.focus();
  await expect(planner).toBeFocused();
  await expect.poll(() => planner.evaluate((element) =>
    getComputedStyle(element).boxShadow,
  )).toContain("rgb(231, 52, 43)");
});

test("keeps launch-module motion still when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  await planner.hover();

  await expect(planner).toHaveCSS("transform", "none");
  await expect(planner.locator(".external-action__icon")).toHaveCSS("transform", "none");
});

test("keeps launch-module destinations inside the compact viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  const destination = planner.locator(".external-action__destination");
  const layout = await planner.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      left: bounds.left,
      right: bounds.right,
      viewport: document.documentElement.clientWidth,
    };
  });

  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport);
  await expect(destination).toHaveCSS("overflow", "hidden");
  await expect(destination).toHaveCSS("text-overflow", "ellipsis");
  await expect(destination).toHaveCSS("white-space", "nowrap");
});
```

- [ ] **Step 2: Run the focused browser tests and verify red**

Run:

```powershell
npm run build
npm run test:e2e:built -- tests/projects.spec.ts
```

Expected: the active module test fails because the action still uses `inline-flex`; the reduced-motion and compact truncation assertions also fail.

- [ ] **Step 3: Replace the base external-action styles**

Replace the existing `.external-action`, hover/focus, and pending rules in `src/styles/sections.css` with:

```css
.external-action {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 3.75rem;
  align-items: stretch;
  width: fit-content;
  min-width: min(20rem, 100%);
  max-width: 100%;
  min-height: 4rem;
  padding: 0;
  overflow: hidden;
  border: var(--scene-border);
  color: var(--color-bone);
  background:
    linear-gradient(90deg, var(--color-alert-dark), transparent 42%),
    var(--color-panel);
  box-shadow: inset 3px 0 0 var(--color-alert);
  font-family: var(--font-code);
  text-decoration: none;
  text-transform: uppercase;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.external-action__content {
  display: grid;
  align-content: center;
  min-width: 0;
  padding: 0.75rem 1rem 0.75rem 1.25rem;
}

.external-action__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.external-action__destination,
.external-action__pending-label {
  min-width: 0;
  margin-top: 0.35rem;
  overflow: hidden;
  color: var(--color-muted);
  font-size: 0.625rem;
  letter-spacing: 0.02em;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
}

.external-action__icon-bay {
  display: grid;
  place-items: center;
  border-left: var(--scene-border);
  color: var(--color-void);
  background: var(--color-bone);
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.external-action__icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: square;
  stroke-linejoin: miter;
  stroke-width: 1.7;
  transition: transform 180ms ease;
}

a.external-action:hover,
a.external-action:focus-visible {
  color: var(--color-bone);
  border-color: var(--color-bone);
  background:
    linear-gradient(90deg, var(--color-alert-dark), transparent 54%),
    #120f0e;
  box-shadow:
    inset 3px 0 0 var(--color-alert),
    0 14px 32px rgb(0 0 0 / 35%);
  transform: translateY(-2px);
}

a.external-action:focus-visible {
  box-shadow:
    var(--focus-ring),
    inset 3px 0 0 var(--color-alert),
    0 14px 32px rgb(0 0 0 / 35%);
}

a.external-action:hover .external-action__icon-bay,
a.external-action:focus-visible .external-action__icon-bay {
  color: var(--color-bone);
  background: var(--color-alert);
}

a.external-action:hover .external-action__icon,
a.external-action:focus-visible .external-action__icon {
  transform: translate(2px, -2px);
}

.external-action--pending {
  color: var(--color-muted);
  background: var(--color-panel);
  box-shadow: inset 3px 0 0 var(--color-line);
  cursor: not-allowed;
}

.external-action--pending .external-action__icon-bay {
  color: var(--color-muted);
  background: var(--color-void);
}

.external-action__status-mark {
  width: 1rem;
  height: 0.625rem;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
}

.project-evidence__item .external-action {
  width: min(100%, 27rem);
}

.proof-verdict__actions {
  align-items: stretch;
}

.proof-verdict__actions .external-action {
  flex: 1 1 20rem;
}
```

- [ ] **Step 4: Add compact and reduced-motion rules**

Replace the compact `.external-action` rule in `src/styles/responsive.css` with:

```css
.external-action {
  grid-template-columns: minmax(0, 1fr) 3.25rem;
  width: 100%;
  min-width: 0;
}

.external-action__content {
  padding-inline: 1rem;
}
```

Add this rule to the reduced-motion block in `src/styles/motion.css`:

```css
.external-action,
.external-action__icon {
  transform: none !important;
  transition: none !important;
}
```

- [ ] **Step 5: Run focused validation and verify green**

Run:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:e2e:built -- tests/projects.spec.ts
```

Expected: lint, type checking, build, and project tests pass on desktop and mobile.

- [ ] **Step 6: Perform real-browser visual QA**

Start the built portfolio:

```powershell
npm run start
```

Inspect `/` in the in-app browser at desktop and compact widths. Verify:

- QGC Planner and Ticket OCR show label, real destination, red rail, and SVG icon bay.
- Email and GitHub actions align as equal-height modules.
- BorderPass and experiment pending modules use the geometric status mark.
- Hover and keyboard focus use the approved red icon-bay state without layout shift.
- Long destinations truncate on compact screens and the page has no horizontal overflow.
- No rendered action contains the former Unicode arrow.

- [ ] **Step 7: Run the complete repository validation**

Run:

```powershell
npm run validate
```

Expected: content validation, content contract tests, ESLint, type checking, production build, Lighthouse audit, and the complete Playwright suite exit with code 0.

- [ ] **Step 8: Review and commit the visual system**

Run:

```powershell
git --no-pager diff --check
git --no-pager diff
git add tests/projects.spec.ts src/styles/sections.css src/styles/responsive.css src/styles/motion.css
git commit -m "style: redesign external actions as launch modules"
```

Confirm that no destinations, translated content, project images, navigation, or dependencies changed.

- [ ] **Step 9: Push the validated commits**

Run:

```powershell
git status --short --branch
git push origin main
```

Expected: local `main` is clean and synchronized with `origin/main`, allowing Vercel to redeploy the approved Launch Module design.
