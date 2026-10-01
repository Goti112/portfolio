import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("keeps hiring information usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/es");
    await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
    await expect(page.locator("[data-project-case]")).toHaveCount(3);
    await expect(page.locator("#education")).toBeVisible();
    await expect(page.getByRole("link", { name: "Correo" })).toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
    await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "static");
  } finally {
    await context.close();
  }
});

test("supports keyboard navigation and a visible skip link", async ({ page }) => {
  await page.goto("/es");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("main#main-content")).toBeFocused();
  const projectsLink = page.getByRole("link", { name: "Proyectos", exact: true });
  await projectsLink.focus();
  await projectsLink.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
});

test("contains diagrams and labels at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/es");
  const dimensions = await page.locator("body").evaluate((body) => ({
    content: body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.locator("[data-project-case] .preview-frame")).toHaveCount(3);
});

for (const route of ["/", "/es"] as const) {
  test(`has no automated accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
