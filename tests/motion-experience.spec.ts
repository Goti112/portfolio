import { expect, test } from "@playwright/test";

test("enhances the semantic page through one scoped motion boundary", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  await expect(root).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator("script[src='/browser/portfolio-effects.js']")).toHaveCount(0);
  await expect(page.locator("[data-scene]")).toHaveCount(6);
});

test("does not emit motion contract errors during initialization", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  expect(errors).toEqual([]);
});

test("updates scene and project progress while scrolling", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  await page.locator("[data-scene='method']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "method");
  await page.locator("[data-project-case='borderpass-ai']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "projects");
  await expect(root).toHaveAttribute("data-active-project", "borderpass-ai");
});

test("creates no more than three desktop pin spacers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const pinCount = await page.locator(".pin-spacer").count();
  expect(pinCount).toBeGreaterThan(0);
  expect(pinCount).toBeLessThanOrEqual(3);
});

test("restores claim and verdict scene state while scrolling back", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  const claim = page.locator("[data-scene='claim']");
  const scrollInsideSceneTrigger = async (selector: string): Promise<void> => {
    await page.locator(selector).evaluate((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, sectionTop - window.innerHeight * 0.65);
    });
  };

  await claim.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "claim");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await scrollInsideSceneTrigger("[data-scene='verdict']");
  await expect(root).toHaveAttribute("data-active-scene", "verdict");
  await scrollInsideSceneTrigger("[data-scene='claim']");
  await expect(root).toHaveAttribute("data-active-scene", "claim");
});

test("normalizes all method connector paths", async ({ page }) => {
  await page.goto("/");
  const connectors = page.locator("[data-method-connector]");
  await expect(connectors).toHaveCount(3);
  const pathLengths = await connectors.evaluateAll(
    (paths) => paths.map((path) => path.getAttribute("pathLength")),
  );
  expect(pathLengths).toEqual(["1", "1", "1"]);
});
