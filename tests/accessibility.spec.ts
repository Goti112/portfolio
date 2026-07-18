import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("initializes enhanced motion without hiding semantic content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await expect(page.getByRole("heading", { name: "Miquel Manzano" })).toBeVisible();
});

test.describe("reduced motion", () => {
  test("exposes stable final content", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "reduced");
    await expect(page.locator("[data-project-id]")).toHaveCount(3);
    await expect(page.locator("[data-motion-section][aria-hidden='true']")).toHaveCount(0);
  });
});

test("has no automatically detectable serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
