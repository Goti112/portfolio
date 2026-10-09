import { expect, test } from "@playwright/test";

test("shows two projects in the confirmed order with a real screenshot each", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("[data-project-case] h3")).toHaveText(["QGC Planner", "BorderPass AI"]);
  await expect(page.locator("[data-project-case] [data-project-shot] img")).toHaveCount(2);
  await expect(page.locator("[data-project-case='qgc-planner'] img")).toHaveAttribute("src", "/projects/qgc-planner.webp");
  await expect(page.locator("[data-project-case='borderpass-ai'] img")).toHaveAttribute("src", "/projects/borderpass-ai.webp");
  await expect(page.locator("[data-project-case='ticket-ocr']")).toHaveCount(0);
});

for (const viewport of [
  { label: "desktop", width: 1440 },
  { label: "mobile", width: 390 },
] as const) {
  test(`loads project screenshots inside the viewport on ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 1000 });
    await page.goto("/en");
    for (const shot of await page.locator("[data-project-shot] img").all()) {
      await shot.scrollIntoViewIfNeeded();
      await expect(shot).toHaveJSProperty("complete", true);
      expect(await shot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const box = await shot.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
      expect(await shot.getAttribute("alt")).toMatch(/screenshot/);
    }
  });
}

test("keeps published project and contact destinations", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("[data-project-case]").getByRole("link", { name: "QGC Planner", exact: true })).toHaveAttribute("href", "https://github.com/Goti112/Mission-Planner-Demo");
  await expect(page.locator("[data-project-case]").getByRole("link", { name: "BorderPass AI", exact: true })).toHaveAttribute("href", "https://github.com/Goti112/borderpass-ai");
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Goti112");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
});

for (const route of ["/", "/en"] as const) {
  test(`shows verified technologies on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("[data-project-case='qgc-planner'] .project-evidence__techs li"))
      .toHaveText(["TypeScript", "React", "Vite", "Mapbox GL", "Cesium", "Vitest"]);
    await expect(page.locator("[data-project-case='borderpass-ai'] .project-evidence__techs li"))
      .toHaveText(["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"]);
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
  await expect(index.getByRole("link")).toHaveCount(2);
  await expect(index.getByRole("link", { name: /BorderPass AI/ })).toHaveAttribute("href", "#project-borderpass-ai");
  for (const card of await page.locator("[data-project-case]").all()) {
    await expect(card.locator("dt")).toHaveText(["What it does", "What I built", "Stack"]);
    await expect(card.locator(".project-evidence__highlights li")).toHaveCount(3);
  }
  await expect(page.locator("#project-borderpass-ai .project-evidence__bar")).toContainText("CH.02");
});

test("uses Spanish project labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-case='qgc-planner'] dt")).toHaveText(["Qué hace", "Qué construí", "Stack"]);
});
