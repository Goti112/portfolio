import { expect, test } from "@playwright/test";

test("compresses the exported HTML document", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.headers()["content-encoding"]).toBe("br");
});

test("serves English as the default semantic document", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Miquel Manzano/);
  const identityHeading = page.getByRole("heading", { level: 1, name: "Miquel Manzano" });
  await expect(identityHeading).toBeVisible();
  const identityHeadingBox = await identityHeading.boundingBox();
  expect(identityHeadingBox?.width).toBeGreaterThan(120);
  expect(identityHeadingBox?.height).toBeGreaterThanOrEqual(16);
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "/");
  await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "/");
  await expect(page.locator("link[rel='alternate'][hreflang='es']")).toHaveAttribute("href", "/es");
  await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("serves Spanish at /es with reciprocal navigation", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "/es");
  await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "/");
  await expect(page.locator("link[rel='alternate'][hreflang='es']")).toHaveAttribute("href", "/es");
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
});

test("keeps /en as an English compatibility route", async ({ page }) => {
  const response = await page.goto("/en");
  expect(response).not.toBeNull();
  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "/");
  await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "/");
  await expect(page.locator("link[rel='alternate'][hreflang='es']")).toHaveAttribute("href", "/es");
  await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("exposes direct anchors for every narrative destination", async ({ page }) => {
  await page.goto("/");
  for (const id of ["profile", "capabilities", "projects", "education", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("renders confirmed profile, capabilities, education, and AI positioning", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByText("Disponible para crear, aprender y llevar ideas hasta producción.").first()).toBeVisible();
  await expect(page.getByText(/Uso la IA como acelerador/)).toBeVisible();
  await expect(page.getByText("TypeScript", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Docker", { exact: true })).toBeVisible();
  await expect(page.getByText(/Sistemas Microinformáticos y Redes/)).toBeVisible();
  await expect(page.getByText(/Desarrollo de Aplicaciones Web/)).toBeVisible();
  await expect(page.getByText("Institut Bernat el Ferrer", { exact: true })).toHaveCount(2);
});

test("renders the proof execution narrative in semantic order", async ({ page }, testInfo) => {
  await page.goto("/es");
  const main = page.getByRole("main");
  const challenge = main.locator("[data-scene='intro'] [data-motion-heading]");
  await expect(main.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(challenge).toBeVisible();
  await expect(challenge).toContainText("NO CONFÍES EN LO QUE DIGO.");
  await expect(challenge).toContainText("INSPECCIONA EL TRABAJO.");
  if (testInfo.project.name === "desktop-chromium") {
    await expect(challenge.locator(":scope > span")).toHaveCount(2);
  }
  await expect(main.getByText("CONVIERTO PROBLEMAS COMPLEJOS", { exact: true })).toBeVisible();
  await expect(page.locator("[data-method-stage]")).toHaveCount(4);
  await expect(main.getByText("PREPARADO PARA", { exact: true })).toBeVisible();
  await expect(main.getByText("CONSTRUIR LO SIGUIENTE.", { exact: true })).toBeVisible();
});

test("keeps the desktop proof challenge within the readable display cap", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only typography assertion");
  await page.goto("/");

  const fontSize = await page.locator(".proof-intro__challenge").evaluate((element) => {
    return Number.parseFloat(getComputedStyle(element).fontSize);
  });

  expect(fontSize).toBeLessThanOrEqual(112);
});

test("keeps the mobile proof challenge within the readable display cap", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only typography assertion");
  await page.goto("/");

  const fontSize = await page.locator(".proof-intro__challenge").evaluate((element) => {
    return Number.parseFloat(getComputedStyle(element).fontSize);
  });

  expect(fontSize).toBeLessThanOrEqual(60);
});

test("exposes every motion scene exactly once", async ({ page }) => {
  await page.goto("/");
  for (const scene of ["intro", "claim", "method", "projects", "experiments", "verdict"]) {
    await expect(page.locator(`[data-scene='${scene}']`)).toHaveCount(1);
  }
});
