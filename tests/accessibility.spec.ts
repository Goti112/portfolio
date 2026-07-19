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

test("flashes the corruption line once when Projects enters the center band", async ({ page }) => {
  await page.goto("/");
  const line = page.locator("[data-corruption-line]");
  const projects = page.locator("[data-motion-section='projects']");

  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(line).toHaveAttribute("data-corruption-active", "true");
  await expect.poll(async () => line.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await projects.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(line).not.toHaveAttribute("data-corruption-active", "true");
});

test("has no automatically detectable serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  // Scroll to the bottom to complete all GSAP scroll-triggered animations
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Wait for GSAP scrub lerp (0.6s) to settle
  await page.waitForTimeout(2000);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
