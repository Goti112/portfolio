import { expect, test } from "@playwright/test";

const cssColorChannels = (color: string): [number, number, number] => {
  const channels = color.match(/\d+(?:\.\d+)?/g);
  if (channels === null || channels.length !== 3) {
    throw new Error(`Expected an RGB color, received ${color}`);
  }
  return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
};

const relativeLuminance = (color: string): number => {
  const [red, green, blue] = cssColorChannels(color);
  const linearChannel = (channel: number): number => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearChannel(red) + 0.7152 * linearChannel(green) + 0.0722 * linearChannel(blue);
};

const contrastRatio = (foreground: string, background: string): number => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

test("compresses the exported HTML document", async ({ page }) => {
  const response = await page.goto("/");
  expect(response).not.toBeNull();
  expect(response?.headers()["content-encoding"]).toBe("br");
});

for (const route of ["/", "/es"] as const) {
  test(`keeps portfolio surfaces dark and body copy readable on ${route}`, async ({ page }) => {
    await page.goto(route);

    const backgrounds = await page.locator("body, .project-evidence, .build-method, .formation-trace, .proof-verdict")
      .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).backgroundColor));
    expect(backgrounds).toHaveLength(5);
    for (const background of backgrounds) {
      expect(relativeLuminance(background)).toBeLessThan(0.04);
    }

    const bodyColors = await page.locator("body").evaluate((body) => ({
      background: getComputedStyle(body).backgroundColor,
      foreground: getComputedStyle(body).color,
    }));
    expect(contrastRatio(bodyColors.foreground, bodyColors.background)).toBeGreaterThanOrEqual(7);
  });
}

for (const route of ["/", "/en", "/es"] as const) {
  test(`serves ${route} with the right locale and reciprocal links`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const locale = route === "/en" ? "en" : "es";
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page).toHaveTitle(/Miquel Manzano/);
    await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", locale === "es" ? "/" : "/en");
    await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute("href", "/en");
    await expect(page.locator("link[rel='alternate'][hreflang='es']")).toHaveAttribute("href", "/");
    await expect(page.getByRole("link", { name: locale === "es" ? "English" : "Español" })).toHaveAttribute("href", locale === "es" ? "/en" : "/");
  });
}

for (const route of ["/", "/en", "/es"] as const) {
  test(`shows recruiter information in order on ${route}`, async ({ page }) => {
    await page.goto(route);
    const isSpanish = route !== "/en";
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
    await expect(main.locator("section")).toHaveCount(5);
    expect(await main.locator("section").evaluateAll((sections) => sections.map((section) => section.id))).toEqual([
      "profile",
      "capabilities",
      "projects",
      "education",
      "contact",
    ]);
    await expect(main.locator("[data-project-case]")).toHaveCount(3);
    await expect(page.locator(".pin-spacer, .experience-progress, [data-evidence-lens]")).toHaveCount(0);
    const projectsLabel = isSpanish ? "Ver proyectos" : "View projects";
    await expect(page.getByRole("link", { name: projectsLabel, exact: true })).toHaveAttribute("href", "#projects");
    await expect(page.locator(".experience-header__navigation a").first()).toHaveAttribute("href", "#capabilities");
    await expect(page.locator(".experience-header__navigation a")).toHaveCount(4);
    await expect(page.locator(".experience-header__navigation a").nth(1)).toHaveAttribute("href", "#projects");
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

test("keyboard navigation focuses the capabilities section", async ({ page }) => {
  await page.goto("/");
  const capabilitiesLink = page.locator(".experience-header__navigation a[href='#capabilities']");
  await capabilitiesLink.focus();
  await page.keyboard.press("Enter");

  const focusState = await page.locator("#capabilities").evaluate((section) => {
    const title = section.querySelector(".build-method__title");
    if (title === null) {
      throw new Error("Capabilities title must exist for the keyboard focus check");
    }
    return {
      active: document.activeElement === section,
      within: section.matches(":focus-within"),
      focusVisible: section.matches(":focus-visible"),
      focusRing: getComputedStyle(section).boxShadow,
      titleAnimation: getComputedStyle(title).animationName,
    };
  });
  expect(focusState).toEqual({
    active: true,
    within: true,
    focusVisible: true,
    focusRing: expect.not.stringMatching(/^none$/),
    titleAnimation: "wired-glitch",
  });
});

test("renders capabilities as wired nodes with linked status", async ({ page }) => {
  await page.goto("/es");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".build-method__node")).toHaveCount(29);
  await expect(section.locator(".build-method__node .build-method__status")).toHaveCount(10);
  await expect(section.locator(".build-method__status")).toHaveCount(11);
  await expect(section.locator(".build-method__legend")).toContainText("usada en proyectos reales");
  await expect(section.locator(".build-method__legend a")).toHaveAttribute("href", "#projects");
  await expect(section.getByText("[OK]")).toHaveCount(0);
  await expect(section.locator('.build-method__node[data-linked="true"]').filter({ hasText: "TypeScript" })).toHaveCount(1);
  await expect(section.locator('.build-method__node[data-linked="false"]').filter({ hasText: "Docker" })).toHaveCount(1);
  await expect(section.locator(".build-method__node").first()).toHaveCSS("opacity", "1");
});

test("aligns the carrier strip with capabilities content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const lefts = await page.locator("#capabilities").evaluate((section) =>
    [".build-method__carrier", ".scene-eyebrow", ".build-method__title", ".build-method__stages"].map(
      (selector) => section.querySelector(selector)?.getBoundingClientRect().left ?? -1,
    ),
  );
  expect(Math.max(...lefts) - Math.min(...lefts)).toBeLessThanOrEqual(1);
});

test("keeps the capabilities legend link together on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  const linkRects = await page.locator(".build-method__legend a").evaluate((link) => link.getClientRects().length);
  expect(linkRects).toBe(1);
});

test("highlights capability panels and channels on hover", async ({ page }) => {
  await page.goto("/es");
  const stage = page.locator(".build-method__stage").first();
  const channel = stage.locator(".build-method__channel");
  const initialStyles = await stage.evaluate((element) => ({
    boxShadow: getComputedStyle(element).boxShadow,
    borderColor: getComputedStyle(element).borderColor,
    channelColor: getComputedStyle(element.querySelector(".build-method__channel")!).color,
  }));
  await stage.hover();
  await expect(stage).toHaveCSS("border-color", "rgba(216, 137, 141, 0.55)");
  const hoverStyles = await stage.evaluate((element) => ({
    boxShadow: getComputedStyle(element).boxShadow,
    channelColor: getComputedStyle(element.querySelector(".build-method__channel")!).color,
  }));
  expect(hoverStyles.boxShadow).not.toBe(initialStyles.boxShadow);
  expect(hoverStyles.channelColor).not.toBe(initialStyles.channelColor);
  await expect(channel).toHaveCSS("color", "rgb(216, 137, 141)");
});

test("keeps the capabilities side note beside panels on wide screens", async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/es");
    const section = page.locator("#capabilities");
    const note = section.locator(".build-method__side-note");
    await expect(note).toBeVisible();
    await expect(note).toHaveCSS("opacity", "0.14");
    const noteBox = await note.boundingBox();
    const panelBoxes = await section.locator(".build-method__stage").evaluateAll((panels) =>
      panels.map((panel) => {
        const bounds = panel.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
      }),
    );
    if (noteBox === null) throw new Error("The capabilities side note must have measurable bounds");
    const overlaps = panelBoxes.map((panel) =>
      noteBox.x < panel.right && noteBox.x + noteBox.width > panel.left &&
      noteBox.y < panel.bottom && noteBox.y + noteBox.height > panel.top,
    );
    expect(overlaps).toEqual([false, false, false, false]);
  }
});

test("places a decorative prompt at the end of each capability list", async ({ page }) => {
  await page.goto("/es");
  const promptLines = page.locator(".build-method__prompt-line");
  await expect(promptLines).toHaveCount(4);
  const promptMarkup = await promptLines.evaluateAll((lines) =>
    lines.map((line) => ({
      role: line.getAttribute("role"),
      hidden: line.getAttribute("aria-hidden"),
      prompt: line.querySelector(".build-method__prompt")?.textContent ?? "",
      cursor: line.querySelector(".build-method__cursor")?.textContent ?? "",
    })),
  );
  expect(promptMarkup).toEqual(Array.from({ length: 4 }, () => ({
    role: "presentation",
    hidden: "true",
    prompt: ">",
    cursor: "_",
  })));
  const promptIsLast = await page.locator(".build-method__nodes").evaluateAll((lists) =>
    lists.map((list) => list.lastElementChild?.matches(".build-method__prompt-line[role='presentation'][aria-hidden='true']") ?? false),
  );
  expect(promptIsLast).toEqual([true, true, true, true]);
});

test("sizes capability panels to their own content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await expect(page.locator(".build-method__stages")).toHaveCSS("align-items", "start");
});

test("keeps decorative RGB text out of the accessible heading name", async ({ page }) => {
  for (const [path, heading] of [["/", "Tecnologías"], ["/en", "Technologies"]] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 2, name: heading, exact: true })).toHaveCount(1);
  }
});

test("triggers wired glitch and RGB layers when capabilities reveal", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-wired-reveal", "done");
  const title = section.locator(".build-method__title");
  await expect(title).toHaveCSS("animation-name", "wired-glitch");
  const pseudoAnimations = await title.evaluate((element) => ({
    before: getComputedStyle(element, "::before").animationName,
    after: getComputedStyle(element, "::after").animationName,
  }));
  expect(pseudoAnimations).toEqual({ before: "wired-slice-a", after: "wired-slice-b" });
});

test("replays the capabilities glitch on keyboard focus after reveal finishes", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-wired-reveal", "done");
  await page.waitForTimeout(500);
  const capabilitiesLink = page.locator(".experience-header__navigation a[href='#capabilities']");
  await capabilitiesLink.focus();
  await page.keyboard.press("Enter");
  await expect(section).toBeFocused();
  const title = section.locator(".build-method__title");
  const glitchStates = async () => title.evaluate((element) =>
    element.getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSAnimation)
      .map((animation) => ({
        name: animation.animationName,
        playState: animation.playState,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  );
  expect(await glitchStates()).toEqual([
    { name: "wired-glitch", playState: "running" },
    { name: "wired-slice-a", playState: "running" },
    { name: "wired-slice-b", playState: "running" },
  ]);
});

test("replays the capabilities glitch on title hover after reveal finishes", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-wired-reveal", "done");
  const title = section.locator(".build-method__title");
  await expect(title).toHaveCSS("animation-name", "wired-glitch");
  await page.waitForTimeout(500);
  const revealAnimations = await title.evaluate((element) => element.getAnimations({ subtree: true }));
  expect(revealAnimations).toHaveLength(0);
  await section.hover({ position: { x: 8, y: 8 } });
  await expect(title).toHaveCSS("animation-name", "none");
  await title.hover();
  await expect(title).toHaveCSS("animation-name", "wired-glitch");
  const glitchStates = await title.evaluate((element) =>
    element.getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSAnimation)
      .map((animation) => ({
        name: animation.animationName,
        playState: animation.playState,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  );
  expect(glitchStates).toEqual([
    { name: "wired-glitch", playState: "running" },
    { name: "wired-slice-a", playState: "running" },
    { name: "wired-slice-b", playState: "running" },
  ]);
});

test("disables wired animations with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-wired-reveal", "done");
  const animations = await section.evaluate((element) => {
    const title = element.querySelector(".build-method__title");
    const cursor = element.querySelector(".build-method__cursor");
    if (title === null || cursor === null) throw new Error("Capabilities title and cursor must exist");
    return {
      title: getComputedStyle(title).animationName,
      before: getComputedStyle(title, "::before").animationName,
      after: getComputedStyle(title, "::after").animationName,
      cursor: getComputedStyle(cursor).animationName,
    };
  });
  expect(animations).toEqual({ title: "none", before: "none", after: "none", cursor: "none" });
});

test("keeps capability panel headers on one line on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  const offsets = await page.locator(".build-method__stage-header").evaluateAll((headers) =>
    headers.map((header) => {
      const title = header.querySelector("h3")!.getBoundingClientRect();
      const count = header.querySelector(".build-method__count")!.getBoundingClientRect();
      return Math.abs(title.top - count.top);
    }),
  );
  for (const offset of offsets) expect(offset).toBeLessThanOrEqual(4);
});

test("shows a focus ring on the capabilities legend link", async ({ page }) => {
  await page.goto("/es");
  const link = page.locator(".build-method__legend a");
  await expect(link).toHaveAttribute("href", "#projects");
  await link.focus();
  const boxShadow = await link.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(boxShadow).not.toBe("none");
});

test("adds dotted leaders between capability names and linked statuses", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  const section = page.locator("#capabilities");
  await expect(section.locator(".build-method__leader")).toHaveCount(10);
  await expect(section.locator(".build-method__leader").first()).toHaveCSS("border-bottom-style", "dotted");
  await expect(section.locator(".build-method__leader").first()).toHaveCSS("flex-grow", "1");
  await expect(section.locator(".build-method__status").first()).toHaveCSS("margin-left", "0px");
  await expect(section.locator(".build-method__nodes").first()).toHaveCSS("max-width", "544px");
});

test("capabilities section has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const overflow = await page.locator("#capabilities").evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("keeps capability nodes visible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  await expect(page.locator(".build-method__node").first()).toHaveCSS("opacity", "1");
});

test("keeps capability content visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:3000", javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/es");
    await expect(page.locator(".build-method__node").first()).toBeVisible();
  } finally {
    await context.close();
  }
});

test("places all education entries in one horizontal row on wide screens", async ({ page }) => {
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
  expect(Math.abs(daw.y - dam.y)).toBeLessThanOrEqual(1);
  expect(smx.x).toBeLessThan(daw.x);
  expect(daw.x).toBeLessThan(dam.x);
  await expect(studyItems.nth(2).getByText("Institut Gabriela Mistral", { exact: true })).toBeVisible();
});

test("aligns the education study grid with its heading on wide screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1748, height: 612 });
  await page.goto("/");

  const heading = await page.locator(".formation-trace__heading").boundingBox();
  const studyList = await page.locator(".formation-trace__list").boundingBox();
  if (heading === null || studyList === null) {
    throw new Error("Education heading and study list must have measurable layout boxes");
  }

  expect(Math.abs(studyList.x - heading.x)).toBeLessThanOrEqual(2);
});

test("uses a flex column for the education section and keeps its responsive study grid", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const sectionLayout = await page.locator("#education").evaluate((section) => ({
    display: getComputedStyle(section).display,
    flexDirection: getComputedStyle(section).flexDirection,
  }));
  const listDisplay = await page.locator(".formation-trace__list").evaluate((list) => getComputedStyle(list).display);

  expect(sectionLayout).toEqual({ display: "flex", flexDirection: "column" });
  expect(listDisplay).toBe("grid");
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

test("uses the first viewport for the introduction on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = await page.locator(".experience-header").boundingBox();
  const introduction = await page.locator("#profile").boundingBox();
  if (header === null || introduction === null) {
    throw new Error("Header and introduction must have measurable layout boxes");
  }

  expect(introduction.height).toBeGreaterThanOrEqual(900 - header.height - 1);
});

test("uses a legible system display font in the introduction", async ({ page }) => {
  await page.goto("/");
  const fontFamily = await page.locator("#profile h1").evaluate((heading) => getComputedStyle(heading).fontFamily);
  expect(fontFamily.toLowerCase()).toContain("system-ui");
});

for (const viewport of [
  { label: "desktop", width: 1440 },
  { label: "mobile", width: 390 },
] as const) {
  test(`separates recruiter copy and contact actions on ${viewport.label}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: viewport.width, height: 1000 });
    await page.goto("/");

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
