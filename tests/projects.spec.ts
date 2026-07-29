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

test("publishes the confirmed repositories and contact destinations", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "QGC Planner" }))
    .toHaveAttribute("href", "https://github.com/Goti112/Mission-Planner-Demo");
  await expect(page.getByRole("link", { name: "Ticket OCR Scanner" }))
    .toHaveAttribute("href", "https://github.com/Goti112/ticket_app");
  await expect(page.getByRole("link", { name: "EMAIL" }))
    .toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GITHUB" }))
    .toHaveAttribute("href", "https://github.com/Goti112");

  const borderPass = page.locator("[data-project-case='borderpass-ai']");
  await expect(borderPass.locator(".external-action--pending")).toHaveAttribute("aria-disabled", "true");
});

test("renders external actions as semantic launch modules", async ({ page }) => {
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  await expect(planner.locator(".external-action__label")).toHaveText("QGC Planner");
  await expect(planner.locator(".external-action__destination"))
    .toHaveText("github.com/Goti112/Mission-Planner-Demo");
  await expect(planner.locator(".external-action__icon-bay svg")).toHaveCount(1);
  await expect(planner).not.toContainText("↗");

  const email = page.getByRole("link", { name: "EMAIL", exact: true });
  await expect(email.locator(".external-action__destination")).toHaveText("mmanz2606@gmail.com");

  const borderPass = page.locator("[data-project-case='borderpass-ai'] .external-action--pending");
  await expect(borderPass).toHaveAttribute("aria-disabled", "true");
  await expect(borderPass.locator(".external-action__destination")).toHaveCount(0);
  await expect(borderPass.locator("svg")).toHaveCount(0);
  await expect(borderPass.locator(".external-action__status-mark")).toHaveCount(1);
  await expect(borderPass).toContainText("LINK_PENDING");
});

for (const route of ["/", "/es"] as const) {
  test(`shows verified project technologies on ${route}`, async ({ page }) => {
    await page.goto(route);

    await expect(
      page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"),
    ).toHaveText(["TypeScript", "React", "Mapbox GL", "Cesium"]);
    await expect(
      page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"),
    ).toHaveText(["AI", "CBAM"]);
    await expect(
      page.locator("[data-project-case='ticket-ocr'] .project-evidence__techs li"),
    ).toHaveText(["Dart", "Flutter", "Google ML Kit", "XLSX"]);
  });
}

test("renders secondary experiments without invented descriptions", async ({ page }) => {
  await page.goto("/");
  const montage = page.locator("[data-scene='experiments']");
  await expect(montage.getByText("Web Game", { exact: true }).first()).toBeVisible();
  await expect(montage.getByText("Roblox Game", { exact: true }).first()).toBeVisible();
  await expect(montage.getByText("AI Wrapped", { exact: true }).first()).toBeVisible();
});

test("keeps secondary work in one semantic three-card stage", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-experiment-stage]");
  const strip = stage.locator("[data-experiment-strip]");
  const cards = strip.locator("[data-experiment-card]");

  await expect(stage).toHaveCount(1);
  await expect(strip).toHaveCount(1);
  await expect(cards).toHaveCount(3);
  await expect(cards.locator(".experiment-montage__name")).toHaveText(["Web Game", "Roblox Game", "AI Wrapped"]);
});

test("uses a native horizontal snap strip for compact experiments", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  const strip = page.locator("[data-experiment-strip]");
  const lastCard = strip.locator("[data-experiment-card]").last();

  await expect(strip).toHaveCSS("grid-auto-flow", "column");
  await expect(strip).toHaveCSS("overflow-x", "auto");
  await expect(strip).toHaveCSS("scroll-snap-type", "x mandatory");

  const dimensions = await strip.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    pageHasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth);
  expect(dimensions.pageHasHorizontalOverflow).toBe(false);

  await strip.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" }));
  await expect.poll(async () => strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  const [stripBox, lastCardBox] = await Promise.all([strip.boundingBox(), lastCard.boundingBox()]);
  expect(stripBox).not.toBeNull();
  expect(lastCardBox).not.toBeNull();
  expect(lastCardBox!.x - stripBox!.x).toBeGreaterThanOrEqual(-1);
  expect(stripBox!.x + stripBox!.width - (lastCardBox!.x + lastCardBox!.width)).toBeGreaterThanOrEqual(-1);
});

test("pending destinations never render broken anchors", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
  await expect(page.locator(".external-action--pending[aria-disabled='true']")).toHaveCount(4);
  await expect(page.getByText("LINK_PENDING").first()).toBeVisible();
});
