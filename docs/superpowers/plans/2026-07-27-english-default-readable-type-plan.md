# English-First Portfolio and Readable Display Type Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` English-first, preserve Spanish at `/es` and English compatibility at `/en`, and reduce display typography to a readable editorial scale.

**Architecture:** The English route group owns `/` and `/en`; the Spanish group owns `/es`. Existing localized records and `PortfolioPage` stay unchanged. CSS continues to own the display scale through existing section, preview, and responsive rules.

**Tech Stack:** Next.js static export, React, TypeScript, CSS clamp sizing, Playwright, Lighthouse CI.

## Global Constraints

- `/` uses English with `lang="en"`, canonical `/`, and a link to `/es`.
- `/es` uses Spanish with `lang="es"`, canonical `/es`, and a link to `/`.
- `/en` serves English compatibility content with canonical `/`; do not add a server redirect.
- Shared desktop display headings use `clamp(2.75rem, 7.5vw, 7rem)`.
- Shared mobile display headings use `clamp(2.4rem, 11vw, 3.75rem)`.
- Primary-project, project-case, experiment-heading, experiment-card, and mobile-project maxima are `4.75rem`, `3.25rem`, `3.25rem`, `2rem`, and `3.5rem`.
- Preserve content, font families, body type, spacing, colors, motion, anchors, keyboard navigation, reduced motion, no-JavaScript output, and performance budgets.

---

### Task 1: Establish English-first and Spanish routes

**Files:**

- Move `src/app/(en)/en/layout.tsx` to `src/app/(en)/layout.tsx`.
- Move `src/app/(en)/en/page.tsx` to `src/app/(en)/page.tsx`.
- Create `src/app/(en)/en/page.tsx`.
- Move `src/app/(es)/layout.tsx` to `src/app/(es)/es/layout.tsx`.
- Move `src/app/(es)/page.tsx` to `src/app/(es)/es/page.tsx`.
- Modify `src/components/portfolio/ExperienceHeader.tsx` and route-sensitive tests.

**Interfaces:**

- Consumes `getPortfolioContent(locale: Locale): PortfolioContent` and `PortfolioPage({ content })`.
- Produces English routes `/` and `/en`, Spanish route `/es`, and reciprocal links `/es` and `/`.

- [ ] **Step 1: Write failing locale contracts in `tests/portfolio-shell.spec.ts`**

```ts
test("serves English as the default semantic document", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("serves Spanish at /es with reciprocal navigation", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
});

test("keeps /en as an English compatibility route", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "/");
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
npm run build
npm run test:e2e:built -- tests/portfolio-shell.spec.ts --project=desktop-chromium --grep "default semantic|Spanish at /es|compatibility"
```

Expected: `/` remains Spanish, `/es` is absent, and Spanish still links to `/en`.

- [ ] **Step 3: Move pages and layouts, preserving one data flow**

Set the new English root page to:

```tsx
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { getPortfolioContent } from "@/content/index";

export default function EnglishPage(): React.JSX.Element {
  return <PortfolioPage content={getPortfolioContent("en")} />;
}
```

Use the same component body for the new `/en` page. Set English layout alternates to:

```ts
alternates: { canonical: "/", languages: { en: "/", es: "/es" } },
```

Set Spanish layout alternates to:

```ts
alternates: { canonical: "/es", languages: { en: "/", es: "/es" } },
```

- [ ] **Step 4: Update language control and Spanish-only tests**

Use this destination in `ExperienceHeader.tsx`:

```ts
const targetHref = content.locale === "es" ? "/" : "/es";
```

Keep generic structure/motion tests at `/`. Change only Spanish-copy and Spanish-keyboard tests in `tests/accessibility.spec.ts` to `/es`, including JavaScript-disabled absolute URLs.

- [ ] **Step 5: Verify and commit**

```bash
npm run build
npm run test:e2e:built -- tests/portfolio-shell.spec.ts tests/accessibility.spec.ts
git add src/app src/components/portfolio/ExperienceHeader.tsx tests/portfolio-shell.spec.ts tests/accessibility.spec.ts
git commit -m "feat: make English the default portfolio locale"
```

Expected: `/`, `/es`, and `/en` render expected document language, metadata intent, navigation, content, and anchors.

---

### Task 2: Reduce display type without weakening hierarchy

**Files:**

- Modify `src/styles/sections.css`, `src/styles/previews.css`, `src/styles/responsive.css`, and `tests/portfolio-shell.spec.ts`.

**Interfaces:**

- Consumes the existing display-heading selectors and media breakpoints.
- Produces approved readable caps with no body-type or motion changes.

- [ ] **Step 1: Write failing computed-size tests**

```ts
test("keeps desktop display headings within the readable cap", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop typography assertion");
  await page.goto("/");
  const size = await page.locator(".proof-intro__challenge").evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(size).toBeLessThanOrEqual(112);
});

test("keeps mobile display headings within the readable cap", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile typography assertion");
  await page.goto("/");
  const size = await page.locator(".proof-intro__challenge").evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(size).toBeLessThanOrEqual(60);
});
```

- [ ] **Step 2: Verify RED**

```bash
npm run build
npm run test:e2e:built -- tests/portfolio-shell.spec.ts --grep "readable cap"
```

Expected: current maxima of `10rem` (160px) and `4.5rem` (72px) fail the assertions.

- [ ] **Step 3: Apply approved CSS values**

In `sections.css` set shared display headings to:

```css
font-size: clamp(2.75rem, 7.5vw, 7rem);
```

In `previews.css` use:

```css
.project-evidence__heading { font-size: clamp(2.25rem, 6vw, 4.75rem); }
.project-evidence__name { font-size: clamp(2rem, 4vw, 3.25rem); }
.experiment-montage__heading { font-size: clamp(1.75rem, 4vw, 3.25rem); }
.experiment-montage__name { font-size: clamp(1.25rem, 2.5vw, 2rem); }
```

In `responsive.css` use:

```css
.proof-intro__challenge,
.execution-claim h2,
.build-method > h2,
.proof-verdict h2 { font-size: clamp(2.4rem, 11vw, 3.75rem); }
.project-evidence__heading { font-size: clamp(2.25rem, 12vw, 3.5rem); }
```

Do not alter body copy, labels, spacing, colors, family, or motion CSS.

- [ ] **Step 4: Verify, validate, and commit**

```bash
npm run build
npm run test:e2e:built -- tests/portfolio-shell.spec.ts tests/accessibility.spec.ts --grep "readable cap|mobile viewport|compact composition"
npm run validate
git --no-pager diff --check
git add src/styles/sections.css src/styles/previews.css src/styles/responsive.css tests/portfolio-shell.spec.ts
git commit -m "style: improve portfolio display readability"
```

Expected: display caps, responsive overflow checks, full validation, and Lighthouse budgets pass.
