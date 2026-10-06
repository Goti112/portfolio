import { expect, test } from "@playwright/test";

test("compresses the exported HTML document", async ({ page }) => {
  const response = await page.goto("/");
  expect(response).not.toBeNull();
  expect(response?.headers()["content-encoding"]).toBe("br");
});

for (const route of ["/", "/en", "/es"] as const) {
  test(`serves ${route} with the right locale and reciprocal links`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const locale = route === "/es" ? "es" : "en";
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page).toHaveTitle(/Miquel Manzano/);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", locale === "es" ? "/es" : "/");
    await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "/");
    await expect(page.locator("link[rel='alternate'][hreflang='es']")).toHaveAttribute("href", "/es");
    await expect(page.getByRole("link", { name: locale === "es" ? "English" : "Español" })).toHaveAttribute("href", locale === "es" ? "/" : "/es");
  });
}

for (const route of ["/", "/es"] as const) {
  test(`shows recruiter information in order on ${route}`, async ({ page }) => {
    await page.goto(route);
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
    await expect(main.locator("section")).toHaveCount(5);
    await expect(main.locator("[data-project-case]")).toHaveCount(3);
    await expect(page.locator(".pin-spacer, .experience-progress, [data-evidence-lens]")).toHaveCount(0);
    const projectsLabel = route === "/es" ? "Ver proyectos" : "View projects";
    await expect(page.getByRole("link", { name: projectsLabel })).toHaveAttribute("href", "#projects");
    await expect(page.locator(".experience-header__navigation a").first()).toHaveAttribute("href", "#projects");
    await expect(page.locator(".experience-header__navigation a")).toHaveCount(4);
    await expect(page.locator(".experience-header__navigation a").nth(1)).toHaveAttribute("href", "#capabilities");
    await expect(page.locator(".experience-header__navigation a").nth(2)).toHaveAttribute("href", "#education");
    await expect(page.locator(".experience-header__navigation a").nth(3)).toHaveAttribute("href", "#contact");
  });
}

test("shows the existing education and capabilities", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("[data-method-stage]")).toHaveCount(4);
  await expect(page.getByText("TypeScript", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Docker", { exact: true })).toBeVisible();
  await expect(page.getByText(/Sistemas Microinformáticos y Redes/)).toBeVisible();
  await expect(page.getByText(/Desarrollo de Aplicaciones Web/)).toBeVisible();
  await expect(page.getByText(/Desarrollo de Aplicaciones Multiplataforma/)).toBeVisible();
  await expect(page.getByText("En curso", { exact: true })).toBeVisible();
  await expect(page.getByText("Institut Bernat el Ferrer", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Institut Gabriela Mistral", { exact: true })).toHaveCount(1);
});

test("centers the current study below the completed education entries", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/es");

  const studyList = page.locator(".formation-trace__list");
  const list = await studyList.boundingBox();
  const studyItems = page.locator(".formation-trace__item");
  const smx = await studyItems.nth(0).boundingBox();
  const daw = await studyItems.nth(1).boundingBox();
  const dam = await studyItems.nth(2).boundingBox();
  if (list === null || smx === null || daw === null || dam === null) {
    throw new Error("Education entries must have measurable layout boxes");
  }

  expect(Math.abs(smx.y - daw.y)).toBeLessThanOrEqual(1);
  expect(dam.y).toBeGreaterThan(daw.y);
  expect(Math.abs(dam.x + dam.width / 2 - (list.x + list.width / 2))).toBeLessThanOrEqual(2);
  await expect(studyItems.nth(2).getByText("Institut Gabriela Mistral", { exact: true })).toBeVisible();
});

test("gives the recruiter introduction a full editorial text column", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/es");

  const introductionCopy = await page.locator(".proof-intro__copy").boundingBox();
  if (introductionCopy === null) {
    throw new Error("Recruiter introduction must have a measurable layout box");
  }

  expect(introductionCopy.width).toBeGreaterThanOrEqual(800);
});

for (const viewport of [
  { label: "desktop", width: 1440 },
  { label: "mobile", width: 390 },
] as const) {
  test(`separates recruiter copy and contact actions on ${viewport.label}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: viewport.width, height: 1000 });
    await page.goto("/es");

    const role = await page.locator(".proof-intro__role").boundingBox();
    const summary = await page.locator(".proof-intro__summary").boundingBox();
    const heroActions = await page.locator(".proof-intro__actions").boundingBox();
    const availability = await page.locator(".proof-intro__availability").boundingBox();
    const contactHeading = await page.locator(".proof-verdict h2").boundingBox();
    const contactActions = await page.locator(".proof-verdict__actions").boundingBox();
    if (
      role === null || summary === null || heroActions === null || availability === null
      || contactHeading === null || contactActions === null
    ) {
      throw new Error("Recruiter copy and contact actions must have measurable layout boxes");
    }

    expect(heroActions.y - (role.y + role.height)).toBeGreaterThanOrEqual(124);
    expect(heroActions.y - (summary.y + summary.height)).toBeGreaterThanOrEqual(36);
    expect(availability.y - (heroActions.y + heroActions.height)).toBeGreaterThanOrEqual(28);
    expect(contactActions.y - (contactHeading.y + contactHeading.height)).toBeGreaterThanOrEqual(44);
  });
}
