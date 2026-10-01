import { expect, test } from "@playwright/test";

test("shows three projects in the confirmed order with one illustration each", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-case] h3")).toHaveText([
    "QGC Planner",
    "BorderPass AI",
    "Ticket OCR Scanner",
  ]);
  await expect(page.locator("[data-project-case] .preview-frame")).toHaveCount(3);
  await expect(page.locator("[data-project-visual-stage]")).toHaveCount(0);
  await expect(page.locator("[data-project-case='qgc-planner'] [data-route]")).toHaveAttribute("pathLength", "1");
  await expect(page.locator("[data-project-case='borderpass-ai'] [data-decision-step]")).toHaveCount(3);
  await expect(page.locator("[data-project-case='ticket-ocr'] [data-output-row]")).toHaveCount(3);
  await expect(page.getByText("MAVLINK / CONNECTED")).toHaveCount(0);
  await expect(page.getByText("ANALYSIS READY")).toHaveCount(0);
});

test("keeps every diagram visible before its entrance animation runs", async ({ page }) => {
  await page.goto("/");
  const hiddenDiagramItems = await page.locator("[data-decision-step], [data-output-row]").evaluateAll((elements) => (
    elements.filter((element) => getComputedStyle(element).opacity === "0").length
  ));
  expect(hiddenDiagramItems).toBe(0);
});

test("keeps published project and contact destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "QGC Planner" })).toHaveAttribute("href", "https://github.com/Goti112/Mission-Planner-Demo");
  await expect(page.getByRole("link", { name: "BorderPass AI" })).toHaveAttribute("href", "https://github.com/Goti112/borderpass-ai");
  await expect(page.getByRole("link", { name: "Ticket OCR Scanner" })).toHaveAttribute("href", "https://github.com/Goti112/ticket_app");
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Goti112");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
});

for (const route of ["/", "/es"] as const) {
  test(`shows verified technologies on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"))
      .toHaveText(["TypeScript", "React", "Mapbox GL", "Cesium"]);
    await expect(page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"))
      .toHaveText(["Next.js", "TypeScript", "PostgreSQL", "Prisma"]);
    await expect(page.locator("[data-project-case='ticket-ocr'] .project-evidence__techs li"))
      .toHaveText(["Dart", "Flutter", "Google ML Kit", "XLSX"]);
  });
}

test("keeps project actions inside the mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  const planner = page.getByRole("link", { name: "QGC Planner" });
  const layout = await planner.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth };
  });
  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport);
});
