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
  await expect(page.getByText("Institut Bernat el Ferrer", { exact: true })).toHaveCount(3);
});
