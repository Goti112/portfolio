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

test.describe("reduced motion", () => {
  test("exposes stable final content", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("[data-project-id]")).toHaveCount(3);
    await expect(page.locator("[data-motion-section][aria-hidden='true']")).toHaveCount(0);
    await expect(page.locator("[data-forensic-cursor]")).toBeHidden();
    await expect(page.locator("[data-corruption-line]")).toBeHidden();
  });
});

test("supports a keyboard-only skip and project navigation path", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#profile$/);

  const projectsLink = page.getByRole("link", { name: "Proyectos" });
  await projectsLink.focus();
  await projectsLink.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
});

test("keeps the full narrative usable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.locator("[data-project-id]")).toHaveCount(3);
  const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
  const viewportWidth = page.viewportSize()?.width;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth ?? bodyWidth);
});

test("keeps the mobile language switch visible while primary navigation scrolls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");

  const layout = await page.locator(".session-nav").evaluate((header) => {
    const language = header.querySelector<HTMLElement>(".session-nav__language");
    const navigation = header.querySelector<HTMLElement>("nav");
    const headerRect = header.getBoundingClientRect();
    const languageRect = language?.getBoundingClientRect();

    return {
      headerHasHorizontalOverflow: header.scrollWidth > header.clientWidth,
      languageIsFullyVisible:
        languageRect !== undefined &&
        languageRect.left >= headerRect.left &&
        languageRect.right <= headerRect.right,
      navigationCanScroll: navigation !== null && navigation.scrollWidth > navigation.clientWidth,
      navigationScrollbarWidth: navigation === null ? "missing" : getComputedStyle(navigation).scrollbarWidth,
    };
  });

  expect(layout).toEqual({
    headerHasHorizontalOverflow: false,
    languageIsFullyVisible: true,
    navigationCanScroll: true,
    navigationScrollbarWidth: "none",
  });
});

test("activates the forensic probe over project evidence on fine pointers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Fine-pointer assertion");
  await page.goto("/");

  const cursor = page.locator("[data-forensic-cursor]");
  await expect(cursor).not.toHaveAttribute("data-cursor-active", "true");
  await page.locator("[data-project-id='qgc-planner']").hover();
  await expect(cursor).toHaveAttribute("data-cursor-active", "true");
});

test("keeps the forensic probe hidden on coarse pointers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Coarse-pointer assertion");
  await page.goto("/");
  await expect(page.locator("[data-forensic-cursor]")).toBeHidden();
});

test("flashes the corruption line once when Projects enters the center band", async ({ page }) => {
  await page.goto("/");
  const line = page.locator("[data-corruption-line]");
  const projects = page.locator("[data-motion-section='projects']");

  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(line).toHaveAttribute("data-corruption-active", "true");
  const animation = await line.evaluate((element) => {
    const [activeAnimation] = element.getAnimations();

    if (!(activeAnimation instanceof CSSAnimation)) {
      throw new Error("The corruption line did not start its CSS animation");
    }

    const effect = activeAnimation.effect;

    if (!(effect instanceof KeyframeEffect)) {
      throw new Error("The corruption flash did not expose a keyframe effect");
    }

    const keyframes = effect.getKeyframes();
    return {
      duration: effect.getTiming().duration,
      maxOpacity: Math.max(...keyframes.map((keyframe) => Number(keyframe.opacity ?? 0))),
      name: activeAnimation.animationName,
    };
  });

  expect(animation).toEqual({
    duration: 220,
    maxOpacity: 0.7,
    name: "corruption-flash",
  });
  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(300);
  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
});

test("renders the decorative motion layers with visible geometry", async ({ page }) => {
  await page.goto("/");
  const corruptionLine = page.locator("[data-corruption-line]");
  const scanlineOverlay = page.locator("[data-scanline-overlay]");
  await expect(corruptionLine).toHaveAttribute("aria-hidden", "true");
  await expect(scanlineOverlay).toHaveAttribute("aria-hidden", "true");

  const corruptionBox = await corruptionLine.boundingBox();
  const scanlineBox = await scanlineOverlay.boundingBox();
  expect(corruptionBox?.width).toBeGreaterThan(100);
  expect(corruptionBox?.height).toBeGreaterThan(0);
  expect(scanlineBox?.width).toBeGreaterThan(100);
  expect(scanlineBox?.height).toBeGreaterThan(100);
});

test("has no automatically detectable accessibility violations before scrolling", async ({ page }) => {
  await page.goto("/");
  await expectNoAccessibilityViolations(page);
});

test("has no automatically detectable accessibility violations during the scroll narrative", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.35));
  await page.waitForTimeout(800);
  await expectNoAccessibilityViolations(page);
});
