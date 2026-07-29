import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoAccessibilityViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("keeps enhanced motion additive to semantic content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Miquel Manzano" })).toBeVisible();
});

test("keeps the complete hiring argument available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/es");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.locator(".experience-progress")).toBeHidden();
  await expect(page.locator("[data-method-stage]")).toHaveCount(4);
  await expect(page.locator("[data-project-case]")).toHaveCount(3);
  const futureProjects = page.locator("[data-experiment-card]");
  await expect(futureProjects).toHaveCount(3);
  await expect(futureProjects.locator(".experiment-montage__placeholder")).toHaveText(["?", "?", "?"]);
  await expect(futureProjects.nth(0)).toHaveAttribute("aria-label", "Próximo proyecto 01");
  await expect(page.getByText("CONSTRUIR LO SIGUIENTE.", { exact: true })).toBeVisible();
  await context.close();
});

test("keeps static project previews inline", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only assertion");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  const inlinePreviews = page.locator("[data-project-inline-preview]");

  await expect(page.locator("[data-project-visual-stage]")).toBeHidden();
  await expect(inlinePreviews).toHaveCount(3);
  for (const preview of await inlinePreviews.all()) {
    await expect(preview).toBeVisible();
  }
  await context.close();
});

test("uses the shared project stage only for full desktop motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only assertion");
  await page.goto("/");
  await page.locator("[data-motion-root]").evaluate((root) => root.setAttribute("data-motion-state", "ready"));
  const inlinePreviews = page.locator("[data-project-inline-preview]");

  await expect(page.locator("[data-project-visual-stage]")).toBeVisible();
  await expect(inlinePreviews).toHaveCount(3);
  for (const preview of await inlinePreviews.all()) {
    await expect(preview).toBeHidden();
  }
});

test("keeps compact project previews inline when motion is ready", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  await page.locator("[data-motion-root]").evaluate((root) => root.setAttribute("data-motion-state", "ready"));
  const inlinePreviews = page.locator("[data-project-inline-preview]");

  await expect(page.locator("[data-project-visual-stage]")).toBeHidden();
  await expect(inlinePreviews).toHaveCount(3);
  for (const preview of await inlinePreviews.all()) {
    await expect(preview).toBeVisible();
  }
});

test("presents experiments as a subordinate montage", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only assertion");
  await page.goto("/");

  const projectCaseHeight = await page.locator("[data-project-case]").first().evaluate((element) => element.clientHeight);
  const experimentStrip = page.locator("[data-experiment-strip]");
  const experimentItemHeight = await experimentStrip.locator("article").first().evaluate((element) => element.clientHeight);
  const columnCount = await experimentStrip.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length,
  );

  expect(columnCount).toBe(3);
  expect(experimentItemHeight).toBeLessThan(projectCaseHeight);
});

for (const { route, heading } of [
  { route: "/es", heading: "ARCHIVOS SECUNDARIOS" },
  { route: "/", heading: "SECONDARY FILES" },
] as const) {
  test(`gives the compact experiment strip a localized keyboard entry point on ${route}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Compact-only assertion");
    await page.goto(route);
    const strip = page.getByRole("region", { name: heading });
    await expect(strip).toHaveAttribute("tabindex", "0");
    await strip.focus();
    await expect(strip).toBeFocused();
    const focusBoxShadow = await strip.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(focusBoxShadow).toContain("inset");
  });
}

test.describe("reduced motion", () => {
  test("exposes stable final content", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("[data-project-id]")).toHaveCount(3);
    await expect(page.locator("[data-motion-section][aria-hidden='true']")).toHaveCount(0);
  });
});

test("supports a keyboard-only skip and project navigation path", async ({ page }) => {
  await page.goto("/es");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("main#main-content")).toBeFocused();

  const projectsLink = page.getByRole("link", { name: "Proyectos" });
  await projectsLink.focus();
  await projectsLink.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
});

test("keeps the full narrative usable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  const challengeBox = await page.locator(".proof-intro__challenge").boundingBox();
  const viewportHeight = page.viewportSize()?.height;
  expect(challengeBox).not.toBeNull();
  expect(challengeBox?.y ?? 0).toBeGreaterThanOrEqual(0);
  expect((challengeBox?.y ?? 0) + (challengeBox?.height ?? 0))
    .toBeLessThanOrEqual(viewportHeight ?? Number.POSITIVE_INFINITY);
  await expect(page.locator("[data-project-id]")).toHaveCount(3);
  const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
  const viewportWidth = page.viewportSize()?.width;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth ?? bodyWidth);
});

test("keeps the compact composition inside the mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  const dimensions = await page.locator("body").evaluate((body) => ({
    content: body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("keeps mobile header navigation in a visible single-column flow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");

  const layout = await page.locator(".experience-header").evaluate((header) => {
    const language = header.querySelector<HTMLElement>(".experience-header__language");
    const navigation = header.querySelector<HTMLElement>("nav");
    const navigationList = header.querySelector<HTMLElement>(".experience-header__navigation");
    const headerRect = header.getBoundingClientRect();
    const languageRect = language?.getBoundingClientRect();

    return {
      headerHasHorizontalOverflow: header.scrollWidth > header.clientWidth,
      headerColumnCount: getComputedStyle(header).gridTemplateColumns.split(" ").length,
      languageIsFullyVisible:
        languageRect !== undefined &&
        languageRect.left >= headerRect.left &&
        languageRect.right <= headerRect.right,
      navigationHasHorizontalOverflow:
        navigation !== null && navigation.scrollWidth > navigation.clientWidth,
      navigationColumnCount:
        navigationList === null
          ? 0
          : getComputedStyle(navigationList).gridTemplateColumns.split(" ").length,
    };
  });

  expect(layout).toEqual({
    headerHasHorizontalOverflow: false,
    headerColumnCount: 1,
    languageIsFullyVisible: true,
    navigationHasHorizontalOverflow: false,
    navigationColumnCount: 1,
  });
});

test("has no automatically detectable accessibility violations before scrolling", async ({ page }) => {
  await page.goto("/");
  await expectNoAccessibilityViolations(page);
});

test("has no automatically detectable accessibility violations during the scroll narrative", async ({ page }) => {
  await page.goto("/");

  await page.locator("[data-scene='method']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await expectNoAccessibilityViolations(page);

  await page.locator("[data-project-case='borderpass-ai']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await expectNoAccessibilityViolations(page);

  await page.locator("[data-scene='verdict']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await expectNoAccessibilityViolations(page);
});
