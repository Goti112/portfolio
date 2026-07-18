import { expect, test } from "@playwright/test";

test("renders the three confirmed primary projects in order", async ({ page }) => {
  await page.goto("/");
  const evidence = page.locator("#projects");
  await expect(evidence.getByRole("heading", { name: "QGC Planner" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "BorderPass AI" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "Ticket OCR Scanner" })).toBeVisible();
  await expect(evidence.locator("[data-project-id]")).toHaveCount(3);
});

test("renders secondary experiments without invented descriptions", async ({ page }) => {
  await page.goto("/");
  const recoveredFiles = page.locator("[data-section='experiments']");
  await expect(recoveredFiles.getByText("Web Game", { exact: true }).first()).toBeVisible();
  await expect(recoveredFiles.getByText("Roblox Game", { exact: true }).first()).toBeVisible();
  await expect(recoveredFiles.getByText("AI Wrapped", { exact: true }).first()).toBeVisible();
});

test("pending destinations never render broken anchors", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
  await expect(page.locator("[aria-disabled='true']")).toHaveCount(8);
  await expect(page.getByText("ENLACE_PENDIENTE").first()).toBeVisible();
});
