import { expect, test } from "@playwright/test";

test("enhances the editorial page without pinning sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".pin-spacer, .experience-progress, [data-evidence-lens]")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
});

test("keeps static visuals for reduced-motion visitors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "reduced");
  await expect(page.locator("[data-project-case]")).toHaveCount(2);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("keeps hero copy still when normal motion is reserved for project screenshots", async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");

  const headingTransform = await page.locator(".proof-intro h1").evaluate(
    (heading) => getComputedStyle(heading).transform,
  );
  expect(headingTransform).toBe("none");
});

test("ignores malformed fragments without a page error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#%");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("leaves content visible when a screenshot hook is missing", async ({ page }) => {
  await page.addInitScript(() => {
    const observer = new MutationObserver((): void => {
      const shots = document.querySelectorAll("[data-project-shot]");
      if (shots.length === 2) {
        shots.forEach((shot) => shot.removeAttribute("data-project-shot"));
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "static");
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
