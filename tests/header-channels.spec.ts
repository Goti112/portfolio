import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

test("marks the current channel while scrolling", async ({ page }) => {
  await page.goto("/es");
  const osd = page.locator(".experience-header__osd");
  await expect(osd).toBeHidden();

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));

  const projectsLink = page.locator(".experience-header__navigation a[href='#projects']");
  await expect(projectsLink).toHaveAttribute("aria-current", "location");
  await expect(projectsLink).toHaveAttribute("data-active", "true");
  await expect(osd).toBeVisible();
  await expect(osd).toContainText("Proyectos");
  await expect(page.locator(".experience-header__navigation a[aria-current]")).toHaveCount(1);

  const channelSpacing = await osd.evaluate((display) => {
    const channel = display.querySelector("span[aria-hidden='true']");
    const arrow = display.querySelector(".experience-header__osd-arrow");
    const label = display.querySelector(".experience-header__osd-label");
    if (channel === null || arrow === null || label === null) throw new Error("The channel display parts must exist.");
    if (getComputedStyle(arrow).display === "none") return null;
    return {
      beforeArrow: arrow.getBoundingClientRect().left - channel.getBoundingClientRect().right,
      afterArrow: label.getBoundingClientRect().left - arrow.getBoundingClientRect().right,
    };
  });
  if (channelSpacing !== null) {
    expect(channelSpacing.beforeArrow).toBeGreaterThan(0);
    expect(channelSpacing.afterArrow).toBeGreaterThanOrEqual(3);
  }
});

test("activates contact at the bottom of the page", async ({ page }) => {
  await page.goto("/es");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".experience-header__navigation a[href='#contact']")).toHaveAttribute("aria-current", "location");
});

test("keeps the scroll spy working without IntersectionObserver", async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, "IntersectionObserver");
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));

  await expect(page.locator(".experience-header__navigation a[href='#projects']")).toHaveAttribute("aria-current", "location");
});

test("clears the bottom channel when returning to the top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");

  await page.locator(".experience-header__navigation a[href='#projects']").click();
  await expect(page.locator(".experience-header__osd")).toContainText("Proyectos");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".experience-header__navigation a[href='#contact']")).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".experience-header__osd")).toContainText("Contacto");

  await page.evaluate(() => window.scrollTo(0, 0));

  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "docked");
  await expect(page.locator(".experience-header__osd")).toContainText("PERFIL");
  await expect(page.locator(".experience-header__navigation a[aria-current]")).toHaveCount(0);
});

test("channel numbers do not change link names", async ({ page }) => {
  await page.goto("/es");
  const navigation = page.locator(".experience-header__navigation");
  for (const name of ["Tecnologías", "Proyectos", "Formación", "Contacto"]) {
    await expect(navigation.getByRole("link", { name, exact: true })).toHaveCount(1);
  }
  await expect(page.getByRole("link", { name: "Miquel Manzano", exact: true })).toHaveCount(1);
});

test("header no longer duplicates the contact button", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__contact")).toHaveCount(0);
});

test("language switch shows the current locale", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__lang-option[data-current='true']")).toHaveText("ES");
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
});

test("keeps header groups separated at narrow desktop widths", async ({ page }) => {
  await page.setViewportSize({ width: 801, height: 900 });
  await page.goto("/es");

  const brand = await page.locator(".experience-header__brand").boundingBox();
  const navigation = await page.locator(".experience-header nav").boundingBox();
  const language = await page.locator(".experience-header__language").boundingBox();

  if (brand === null || navigation === null || language === null) {
    throw new Error("Expected all header groups to have layout boxes.");
  }

  expect(brand.x + brand.width).toBeLessThanOrEqual(navigation.x);
  expect(navigation.x + navigation.width).toBeLessThanOrEqual(language.x);
});

test("keeps brand and channel display apart at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/es");
  await page.evaluate(() => window.scrollTo(0, 400));

  const osd = page.locator(".experience-header__osd");
  await expect(osd).toBeVisible();
  await expect(page.getByRole("link", { name: "Miquel Manzano", exact: true })).toHaveCount(1);
  await expect(page.locator(".experience-header__brand-short")).toHaveText("M. MANZANO");
  await expect(page.locator(".experience-header__brand-short")).toBeVisible();

  const [brand, display] = await Promise.all([
    page.locator(".experience-header__brand").boundingBox(),
    osd.boundingBox(),
  ]);
  expect(brand !== null && display !== null && brand.x + brand.width + 8 <= display.x).toBe(true);

  const touchHeights = await page.locator(".experience-header__navigation a, .experience-header__language").evaluateAll((controls) =>
    controls.map((control) => control.getBoundingClientRect().height),
  );
  expect(touchHeights.every((height) => height >= 44)).toBe(true);

  const labelBounds = await page.locator(".experience-header__channel-label").evaluateAll((labels) =>
    labels.map((label) => {
      const bounds = label.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right };
    }),
  );
  for (let index = 0; index < labelBounds.length - 1; index += 1) {
    const currentLabel = labelBounds.at(index);
    const nextLabel = labelBounds.at(index + 1);
    if (currentLabel === undefined || nextLabel === undefined) throw new Error("Expected each mobile channel label to have a neighboring cell.");
    expect(currentLabel.right).toBeLessThanOrEqual(nextLabel.left);
  }
});

test("shows the active channel clearly on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");

  const projectsLink = page.locator(".experience-header__navigation a[href='#projects']");
  await projectsLink.click();
  await expect(projectsLink).toHaveAttribute("aria-current", "location");
  await expect(projectsLink).toHaveCSS("background-color", "rgba(166, 83, 87, 0.16)");
  await expect(projectsLink).toHaveCSS("min-height", "44px");
  const underlineDisplay = await projectsLink.evaluate((link) => getComputedStyle(link, "::after").display);
  expect(underlineDisplay).toBe("block");

  const languageHeight = await page.locator(".experience-header__language").evaluate((language) => language.getBoundingClientRect().height);
  expect(languageHeight).toBeGreaterThanOrEqual(44);
});

test("keeps English channel labels inside their cells across narrow layouts", async ({ page }) => {
  for (const width of [320, 361, 481]) {
    await page.setViewportSize({ width, height: 760 });
    await page.goto("/en");

    const cells = await page.locator(".experience-header__navigation li").evaluateAll((items) =>
      items.map((item) => {
        const itemBounds = item.getBoundingClientRect();
        const link = item.querySelector("a");
        const label = item.querySelector(".experience-header__channel-label");
        if (link === null || label === null) throw new Error("Every channel cell must contain a link and label.");
        const linkBounds = link.getBoundingClientRect();
        const textRange = document.createRange();
        textRange.selectNodeContents(label);
        const textRects = Array.from(textRange.getClientRects());
        if (textRects.length === 0) throw new Error("Every channel label must render text.");
        return {
          cellLeft: itemBounds.left,
          cellRight: itemBounds.right,
          linkLeft: linkBounds.left,
          linkRight: linkBounds.right,
          textLeft: Math.min(...textRects.map((bounds) => bounds.left)),
          textRight: Math.max(...textRects.map((bounds) => bounds.right)),
        };
      }),
    );

    expect(cells).toHaveLength(4);
    for (const cell of cells) {
      expect(cell.linkLeft).toBeGreaterThanOrEqual(cell.cellLeft - 1);
      expect(cell.linkRight).toBeLessThanOrEqual(cell.cellRight + 1);
      expect(cell.textLeft).toBeGreaterThanOrEqual(cell.cellLeft - 1);
      expect(cell.textRight).toBeLessThanOrEqual(cell.cellRight + 1);
    }
    for (let index = 0; index < cells.length - 1; index += 1) {
      const currentCell = cells.at(index);
      const nextCell = cells.at(index + 1);
      if (currentCell === undefined || nextCell === undefined) throw new Error("Expected neighboring channel cells.");
      expect(currentCell.textRight).toBeLessThanOrEqual(nextCell.textLeft + 1);
    }
  }
});

test("keeps mobile touch targets inside the channel frame", async ({ page }) => {
  for (const width of [375, 481]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/es");

    const navigation = await page.locator(".experience-header__navigation").boundingBox();
    const language = await page.locator(".experience-header__language").boundingBox();
    const targets = await page.locator(".experience-header__navigation a").evaluateAll((links) =>
      links.map((link) => {
        const bounds = link.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom, height: bounds.height };
      }),
    );
    if (navigation === null || language === null) throw new Error("Expected navigation and language controls to have layout boxes.");

    expect(targets.every((target) => target.top >= navigation.y && target.bottom <= navigation.y + navigation.height)).toBe(true);
    expect(targets.every((target) => target.height >= 44)).toBe(true);
    expect(Math.abs(navigation.height - language.height)).toBeLessThanOrEqual(1);
  }
});

test("keeps the project heading below the floating mobile header", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));

  const header = page.locator(".experience-header");
  await expect(header).toHaveAttribute("data-mode", "floating");
  const [headerBounds, headingBounds] = await Promise.all([
    header.boundingBox(),
    page.locator("#projects .project-evidence__heading").boundingBox(),
  ]);
  if (headerBounds === null || headingBounds === null) throw new Error("Expected the floating header and project heading to have layout boxes.");

  expect(headingBounds.y).toBeGreaterThanOrEqual(headerBounds.y + headerBounds.height);
});

test("floating header keeps a gap from the viewport top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView());
  const header = page.locator(".experience-header");
  await expect(header).toHaveAttribute("data-mode", "floating");
  await expect.poll(() => header.evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(6);

  const position = await header.evaluate((element) => ({
    transform: getComputedStyle(element).transform,
    stickyTop: getComputedStyle(element).top,
    backgroundImage: getComputedStyle(element).backgroundImage,
  }));
  expect(position.transform).toBe("none");
  expect(Number.parseFloat(position.stickyTop)).toBeGreaterThanOrEqual(6);
  expect(position.backgroundImage).toContain("signal-noise.svg");
});

test("aligns header modules vertically", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");

  const layout = await page.locator(".experience-header").evaluate((header) => {
    const readElement = (selector: string): HTMLElement => {
      const element = header.querySelector(selector);
      if (element === null) throw new Error(`Missing header module: ${selector}`);
      if (!(element instanceof HTMLElement)) throw new Error(`Header module is not an HTML element: ${selector}`);
      return element;
    };
    const navigationElement = readElement(".experience-header__navigation");
    const brandElement = readElement(".experience-header__brand");
    const languageElement = readElement(".experience-header__language");
    const navigation = navigationElement.getBoundingClientRect();
    const brand = brandElement.getBoundingClientRect();
    const language = languageElement.getBoundingClientRect();
    return {
      centers: [navigation, brand, language].map((box) => box.top + box.height / 2),
      navigationHeight: navigation.height,
      languageHeight: language.height,
      navigationBorder: getComputedStyle(navigationElement).border,
      languageBorder: getComputedStyle(languageElement).border,
      navigationBackground: getComputedStyle(navigationElement).backgroundColor,
      languageBackground: getComputedStyle(languageElement).backgroundColor,
    };
  });

  expect(Math.max(...layout.centers) - Math.min(...layout.centers)).toBeLessThanOrEqual(1);
  expect(layout.navigationHeight).toBe(layout.languageHeight);
  expect(layout.navigationBorder).toBe(layout.languageBorder);
  expect(layout.navigationBackground).toBe(layout.languageBackground);
});

test("clicking a distant channel tunes the display only once", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await page.evaluate(() => {
    const record = { labels: [] as string[], tuneStarts: 0 };
    (window as unknown as { __osdRecord: typeof record }).__osdRecord = record;
    const osd = document.querySelector(".experience-header__osd");
    if (osd === null) throw new Error("The channel display must exist before observing it.");
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          if (osd.getAttribute("data-tuning") === "true" && mutation.oldValue !== "true") record.tuneStarts += 1;
        } else {
          record.labels.push(osd.textContent ?? "");
        }
      }
    }).observe(osd, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-tuning"],
      attributeOldValue: true,
    });
  });
  await page.locator(".experience-header__navigation a[href='#contact']").click();
  await expect(page.locator(".experience-header__navigation a[href='#contact']")).toHaveAttribute("aria-current", "location");
  await page.waitForTimeout(1200);

  const record = await page.evaluate(() => (window as unknown as { __osdRecord: { labels: string[]; tuneStarts: number } }).__osdRecord);
  expect(record.labels.length).toBeGreaterThan(0);
  expect(record.labels.some((label) => /Proyectos|Formación/.test(label))).toBe(false);
  expect(record.tuneStarts).toBe(1);
});

test("does not tune the display on first load", async ({ page }) => {
  await page.goto("/es");
  const osd = page.locator(".experience-header__osd");
  await expect(osd).not.toHaveAttribute("data-tuning", "true");
  await expect(osd).toHaveCSS("animation-name", "none");
});

test("disables header motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");

  await expect(page.locator(".experience-header__rec-dot")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".experience-header__osd")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".experience-header__osd")).toHaveCSS("transition-property", "none");
  await page.locator(".experience-header__navigation a").first().hover();
  await expect(page.locator(".experience-header__channel-label").first()).toHaveCSS("animation-name", "none");
});

test("captures the requested header states", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop-chromium", "Capture the visual artifacts once.");
  const outputDirectory = resolve("output/playwright");
  await mkdir(outputDirectory, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "docked");
  await expect(page.locator(".experience-header__osd")).toBeHidden();
  await page.screenshot({ path: resolve(outputDirectory, "header-docked-desktop-es.png"), animations: "disabled" });

  await page.goto("/en");
  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "docked");
  await expect(page.locator(".experience-header__osd")).toBeHidden();
  await page.screenshot({ path: resolve(outputDirectory, "header-docked-desktop-en.png"), animations: "disabled" });

  await page.goto("/es");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));
  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "floating");
  await expect.poll(() => page.locator(".experience-header").evaluate((header) => header.getBoundingClientRect().top)).toBeGreaterThanOrEqual(6);
  const [desktopHeader, desktopHeading] = await Promise.all([
    page.locator(".experience-header").boundingBox(),
    page.locator("#projects .project-evidence__heading").boundingBox(),
  ]);
  if (desktopHeader === null || desktopHeading === null) throw new Error("Expected the desktop floating header and project heading to have layout boxes.");
  expect(desktopHeading.y).toBeGreaterThanOrEqual(desktopHeader.y + desktopHeader.height);
  await page.screenshot({ path: resolve(outputDirectory, "header-floating-desktop-es.png"), animations: "disabled" });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  await page.screenshot({ path: resolve(outputDirectory, "header-mobile-es.png"), animations: "disabled" });

  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));
  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "floating");
  await expect.poll(() => page.locator(".experience-header").evaluate((header) => header.getBoundingClientRect().top)).toBeGreaterThanOrEqual(6);
  const [mobileHeader, mobileHeading] = await Promise.all([
    page.locator(".experience-header").boundingBox(),
    page.locator("#projects .project-evidence__heading").boundingBox(),
  ]);
  if (mobileHeader === null || mobileHeading === null) throw new Error("Expected the mobile floating header and project heading to have layout boxes.");
  expect(mobileHeading.y).toBeGreaterThanOrEqual(mobileHeader.y + mobileHeader.height);
  await page.screenshot({ path: resolve(outputDirectory, "header-floating-mobile-es.png"), animations: "disabled" });

  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/en");
  await page.screenshot({ path: resolve(outputDirectory, "header-mobile-320-en.png"), animations: "disabled" });

  await page.goto("/es");
  await page.screenshot({ path: resolve(outputDirectory, "header-mobile-320-es.png"), animations: "disabled" });
});
