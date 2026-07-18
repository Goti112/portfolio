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

test("has no automatically detectable serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
