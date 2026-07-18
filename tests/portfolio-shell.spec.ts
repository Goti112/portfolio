import { expect, test } from "@playwright/test";

test("serves Spanish as the default semantic document", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).toHaveTitle(/Miquel Manzano/);
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
});

test("serves the English document with reciprocal navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("exposes direct anchors for every narrative destination", async ({ page }) => {
  await page.goto("/");
  for (const id of ["profile", "capabilities", "projects", "education", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});
