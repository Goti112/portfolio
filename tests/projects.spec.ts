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
  await expect(page.getByRole("link", { name: "BorderPass AI" }))
    .toHaveAttribute("href", "https://github.com/Goti112/borderpass-ai");
  await expect(page.getByRole("link", { name: "Ticket OCR Scanner" }))
    .toHaveAttribute("href", "https://github.com/Goti112/ticket_app");
  await expect(page.getByRole("link", { name: "EMAIL" }))
    .toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GITHUB" }))
    .toHaveAttribute("href", "https://github.com/Goti112");

  const borderPass = page.locator("[data-project-case='borderpass-ai']");
  await expect(borderPass.getByRole("link", { name: "BorderPass AI" })).toHaveCount(1);
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

  const borderPass = page.locator("[data-project-case='borderpass-ai']").getByRole("link", { name: "BorderPass AI" });
  await expect(borderPass.locator(".external-action__label")).toHaveText("BorderPass AI");
  await expect(borderPass.locator(".external-action__destination"))
    .toHaveText("github.com/Goti112/borderpass-ai");
  await expect(borderPass.locator(".external-action__icon-bay svg")).toHaveCount(1);
});

test("styles active actions as interactive launch modules", async ({ page }) => {
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  const iconBay = planner.locator(".external-action__icon-bay");

  await expect(planner).toHaveCSS("display", "grid");
  expect(await planner.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").length,
  )).toBe(2);
  await expect(iconBay).toHaveCSS("background-color", "rgb(238, 232, 222)");

  await planner.hover();
  await expect(iconBay).toHaveCSS("background-color", "rgb(231, 52, 43)");
  await expect.poll(() => planner.evaluate((element) =>
    getComputedStyle(element).transform,
  )).not.toBe("none");

  await planner.focus();
  await expect(planner).toBeFocused();
  await expect.poll(() => planner.evaluate((element) =>
    getComputedStyle(element).boxShadow,
  )).toContain("rgb(231, 52, 43)");
});

test("keeps launch-module motion still when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  await planner.hover();

  await expect(planner).toHaveCSS("transform", "none");
  await expect(planner).toHaveCSS("transition-duration", "0s");
  await expect(planner.locator(".external-action__icon")).toHaveCSS("transform", "none");
});

test("keeps launch-module destinations inside the compact viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");

  const planner = page.getByRole("link", { name: "QGC Planner", exact: true });
  const destination = planner.locator(".external-action__destination");
  const layout = await planner.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      left: bounds.left,
      right: bounds.right,
      viewport: document.documentElement.clientWidth,
    };
  });

  expect(layout.left).toBeGreaterThanOrEqual(0);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport);
  await expect(destination).toHaveCSS("overflow", "hidden");
  await expect(destination).toHaveCSS("text-overflow", "ellipsis");
  await expect(destination).toHaveCSS("white-space", "nowrap");
});

for (const route of ["/", "/es"] as const) {
  test(`shows verified project technologies on ${route}`, async ({ page }) => {
    await page.goto(route);

    await expect(
      page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"),
    ).toHaveText(["TypeScript", "React", "Mapbox GL", "Cesium"]);
    await expect(
      page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"),
    ).toHaveText(["Next.js", "TypeScript", "PostgreSQL", "Prisma"]);
    await expect(
      page.locator("[data-project-case='ticket-ocr'] .project-evidence__techs li"),
    ).toHaveText(["Dart", "Flutter", "Google ML Kit", "XLSX"]);
  });
}

test("renders accessible future project placeholders in both locales", async ({ page }) => {
  for (const [route, labels] of [
    ["/", ["Future project 01", "Future project 02", "Future project 03"]],
    ["/es", ["Próximo proyecto 01", "Próximo proyecto 02", "Próximo proyecto 03"]],
  ] as const) {
    await page.goto(route);
    const cards = page.locator("[data-experiment-card]");
    await expect(cards).toHaveCount(3);
    await expect(cards.locator(".experiment-montage__placeholder")).toHaveText(["?", "?", "?"]);
    await expect(cards.locator(".external-action")).toHaveCount(0);
    for (const [index, label] of labels.entries()) {
      await expect(cards.nth(index)).toHaveAttribute("aria-label", label);
    }
  }
});

test("keeps secondary work in one semantic three-card stage", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-experiment-stage]");
  const strip = stage.locator("[data-experiment-strip]");
  const cards = strip.locator("[data-experiment-card]");

  await expect(stage).toHaveCount(1);
  await expect(strip).toHaveCount(1);
  await expect(cards).toHaveCount(3);
  await expect(cards.locator(".experiment-montage__placeholder")).toHaveText(["?", "?", "?"]);
  await expect(cards.locator(".external-action")).toHaveCount(0);
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

test("does not render pending external actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
  await expect(page.locator(".external-action--pending[aria-disabled='true']")).toHaveCount(0);
  await expect(page.getByText("LINK_PENDING")).toHaveCount(0);
});
