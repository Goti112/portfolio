import { expect, test } from "@playwright/test";

test("renders the three confirmed primary projects in order", async ({ page }) => {
  await page.goto("/");
  const evidence = page.locator("#projects");
  await expect(evidence.getByRole("heading", { name: "QGC Planner" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "BorderPass AI" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "Ticket OCR Scanner" })).toBeVisible();
  await expect(evidence.locator("[data-project-id]")).toHaveCount(3);
});

test("renders each primary project as a motion-ready semantic case", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-project-stage]");
  await expect(stage).toHaveCount(1);
  await expect(stage.locator("[data-project-case]")).toHaveCount(3);
  await expect(stage.locator("[data-project-preview]")).toHaveCount(3);
  await expect(stage.locator("[data-project-case='qgc-planner']")).toContainText("QGC Planner");
  await expect(stage.locator("[data-project-case='borderpass-ai']")).toContainText("BorderPass AI");
  await expect(stage.locator("[data-project-case='ticket-ocr']")).toContainText("Ticket OCR Scanner");
});

test("renders secondary experiments without invented descriptions", async ({ page }) => {
  await page.goto("/");
  const montage = page.locator("[data-scene='experiments']");
  await expect(montage.getByText("Web Game", { exact: true }).first()).toBeVisible();
  await expect(montage.getByText("Roblox Game", { exact: true }).first()).toBeVisible();
  await expect(montage.getByText("AI Wrapped", { exact: true }).first()).toBeVisible();
});

test("keeps secondary work in a subordinate montage", async ({ page }) => {
  await page.goto("/");
  const montage = page.locator("[data-experiment-strip]");
  await expect(montage).toHaveCount(1);
  await expect(montage.locator("article")).toHaveCount(3);
});

test("pending destinations never render broken anchors", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
  await expect(page.locator(".external-action--pending[aria-disabled='true']")).toHaveCount(8);
  await expect(page.getByText("ENLACE_PENDIENTE").first()).toBeVisible();
});
