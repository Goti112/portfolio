import { expect, test } from "@playwright/test";

test("shows three projects in the confirmed order with one illustration each", async ({ page }) => {
  await page.goto("/en");
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

for (const viewport of [
  { label: "desktop", width: 1440 },
  { label: "mobile", width: 390 },
] as const) {
  test(`uses readable Wired surfaces for project diagrams on ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 1000 });
    await page.goto("/en");

    const previews = page.locator(".preview-frame");
    await expect(previews).toHaveCount(3);
    for (const preview of await previews.all()) {
      await expect(preview).toHaveCSS("background-color", "rgb(35, 45, 50)");
      await expect(preview.locator(".preview-caption")).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Miquel Manzano" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View projects" })).toHaveAttribute("href", "#projects");
  });
}

test("keeps every diagram visible before its entrance animation runs", async ({ page }) => {
  await page.goto("/");
  const hiddenDiagramItems = await page.locator("[data-decision-step], [data-output-row]").evaluateAll((elements) => (
    elements.filter((element) => getComputedStyle(element).opacity === "0").length
  ));
  expect(hiddenDiagramItems).toBe(0);
});

test("keeps published project and contact destinations", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("[data-project-case]").getByRole("link", { name: "QGC Planner", exact: true })).toHaveAttribute("href", "https://github.com/Goti112/Mission-Planner-Demo");
  await expect(page.locator("[data-project-case]").getByRole("link", { name: "BorderPass AI", exact: true })).toHaveAttribute("href", "https://github.com/Goti112/borderpass-ai");
  await expect(page.locator("[data-project-case]").getByRole("link", { name: "Ticket OCR Scanner", exact: true })).toHaveAttribute("href", "https://github.com/Goti112/ticket_app");
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Goti112");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
});

for (const route of ["/", "/en"] as const) {
  test(`shows verified technologies on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"))
      .toHaveText(["TypeScript", "React", "Vite", "Mapbox GL", "Cesium"]);
    await expect(page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"))
      .toHaveText(["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Playwright"]);
    await expect(page.locator("[data-project-case='ticket-ocr'] .project-evidence__techs li"))
      .toHaveText(["Dart", "Flutter", "Google ML Kit", "XLSX"]);
  });
}

test("keeps project actions inside the mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  const planner = page.locator("[data-project-case]").getByRole("link", { name: "QGC Planner", exact: true });
  const layout = await planner.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth };
  });
  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport);
});

test("gives each project a scannable channel card", async ({ page }) => {
  await page.goto("/en");
  const index = page.getByRole("navigation", { name: "Project channels" });
  await expect(index.getByRole("link")).toHaveCount(3);
  await expect(index.getByRole("link", { name: /BorderPass AI/ })).toHaveAttribute("href", "#project-borderpass-ai");
  for (const card of await page.locator("[data-project-case]").all()) {
    await expect(card.locator("dt")).toHaveText(["What it does", "What I built", "Stack"]);
    await expect(card.locator(".project-evidence__highlights li")).toHaveCount(3);
  }
  await expect(page.locator("#project-ticket-ocr .project-evidence__bar")).toContainText("CH.03");
});

test("uses Spanish project labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-case='qgc-planner'] dt")).toHaveText(["Qué hace", "Qué construí", "Stack"]);
});
