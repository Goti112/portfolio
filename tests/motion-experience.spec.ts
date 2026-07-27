import { expect, test } from "@playwright/test";

test("enhances the semantic page through one scoped motion boundary", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  await expect(root).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator("script[src^='/browser/']")).toHaveCount(0);
  await expect(page.locator("[data-scene]")).toHaveCount(6);
});

test("does not emit motion contract errors during initialization", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  expect(errors).toEqual([]);
});

test("reverts partial motion when a later scene contract fails", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const observer = new MutationObserver((): void => {
      const claim = document.querySelector("[data-scene='claim']");
      if (claim === null) {
        return;
      }
      claim.querySelectorAll("[data-claim-fragment]")
        .forEach((fragment) => fragment.removeAttribute("data-claim-fragment"));
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "static");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const viewport = page.viewportSize();
  if (viewport === null) {
    throw new Error("Failure rollback test requires a configured viewport");
  }
  await page.setViewportSize({
    width: viewport.width >= 960 ? 959 : 960,
    height: viewport.height,
  });
  await page.waitForTimeout(250);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("restores the direct method anchor after desktop pin geometry initializes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/#capabilities");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  const method = page.locator("#capabilities");
  await expect.poll(async (): Promise<number> => {
    const box = await method.boundingBox();
    return box?.y ?? Number.POSITIVE_INFINITY;
  }).toBeLessThan(100);
  const methodBox = await method.boundingBox();
  expect(methodBox?.y).toBeGreaterThanOrEqual(-1);
});

test("keeps every intro argument line legible during the desktop pin", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
  await page.waitForTimeout(250);

  const visibleRatios = await page.locator("[data-scene='intro'] [data-motion-heading] span").evaluateAll((lines) =>
    lines.map((line): number => {
      const lineRect = line.getBoundingClientRect();
      let visibleTop = Math.max(0, lineRect.top);
      let visibleBottom = Math.min(window.innerHeight, lineRect.bottom);
      let ancestor = line.parentElement;
      while (ancestor !== null) {
        const overflow = getComputedStyle(ancestor).overflow;
        if (overflow === "hidden" || overflow === "clip") {
          const ancestorRect = ancestor.getBoundingClientRect();
          visibleTop = Math.max(visibleTop, ancestorRect.top);
          visibleBottom = Math.min(visibleBottom, ancestorRect.bottom);
        }
        ancestor = ancestor.parentElement;
      }
      return Math.max(0, visibleBottom - visibleTop) / lineRect.height;
    }),
  );

  expect(visibleRatios).toHaveLength(2);
  expect(Math.min(...visibleRatios)).toBeGreaterThanOrEqual(0.8);
});

test("ignores malformed external fragments without emitting a page error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#%");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await page.waitForTimeout(250);
  expect(errors).toEqual([]);
});

test("restores encoded external fragments after motion geometry initializes", async ({ page }) => {
  await page.goto("/#%63apabilities");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  const capabilities = page.locator("#capabilities");
  await expect.poll(async () => {
    const box = await capabilities.boundingBox();
    return box?.y ?? Number.POSITIVE_INFINITY;
  }).toBeLessThan(100);
  const capabilitiesBox = await capabilities.boundingBox();
  expect(capabilitiesBox?.y).toBeGreaterThanOrEqual(-1);
});

test("updates scene and project progress while scrolling", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  const progress = page.locator("[data-progress-value]");
  await page.locator("[data-scene='method']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "method");
  await expect(progress).toHaveText("03");
  await page.locator("[data-project-case='borderpass-ai']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "projects");
  await expect(root).toHaveAttribute("data-active-project", "borderpass-ai");
  await expect(progress).toHaveText("04");
});

for (const route of ["/", "/en"] as const) {
  test(`pins and traverses every experiment card on ${route}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
    await page.goto(route);
    const root = page.locator("[data-motion-root]");
    await expect(root).toHaveAttribute("data-motion-state", "ready");

    const section = page.locator("[data-scene='experiments']");
    const spacer = section.locator("..");
    await expect(spacer).toHaveClass(/pin-spacer/);
    const pinGeometry = await spacer.evaluate((element) => {
      const experimentSection = element.querySelector<HTMLElement>("[data-scene='experiments']");
      if (experimentSection === null) {
        throw new Error("Experiment pin spacer is missing its section");
      }
      return {
        top: element.getBoundingClientRect().top + window.scrollY,
        distance: element.clientHeight - experimentSection.clientHeight,
      };
    });
    expect(pinGeometry.distance).toBeGreaterThan(0);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), pinGeometry.top);
    await page.waitForTimeout(250);

    const stage = page.locator("[data-experiment-stage]");
    const strip = page.locator("[data-experiment-strip]");
    const cards = page.locator("[data-experiment-card]");
    await expect(cards).toHaveCount(3);
    const startGeometry = await stage.evaluate((element) => {
      const experimentStrip = element.querySelector<HTMLElement>("[data-experiment-strip]");
      const firstCard = element.querySelector<HTMLElement>("[data-experiment-card]");
      if (experimentStrip === null || firstCard === null) {
        throw new Error("Experiment stage is missing its strip or first card");
      }
      const stripX = new DOMMatrixReadOnly(getComputedStyle(experimentStrip).transform).m41;
      return {
        cardCenter: firstCard.offsetLeft + firstCard.offsetWidth / 2 + stripX,
        stageCenter: element.clientWidth / 2,
        stripX,
      };
    });
    expect(Math.abs(startGeometry.cardCenter - startGeometry.stageCenter)).toBeLessThanOrEqual(1);

    await page.evaluate(
      ({ top, distance }) => window.scrollTo({ top: top + distance * 0.5, behavior: "instant" }),
      pinGeometry,
    );
    await page.waitForTimeout(250);
    const middleStripX = await strip.evaluate(
      (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41,
    );
    expect(Math.abs(middleStripX - startGeometry.stripX)).toBeGreaterThan(50);
    await expect(root).toHaveAttribute("data-active-scene", "experiments");

    await page.evaluate(
      ({ top, distance }) => window.scrollTo({ top: top + distance * 0.99, behavior: "instant" }),
      pinGeometry,
    );
    await page.waitForTimeout(250);
    const finalGeometry = await stage.evaluate((element) => {
      const experimentCards = Array.from(element.querySelectorAll<HTMLElement>("[data-experiment-card]"));
      const firstCard = experimentCards[0];
      const finalCard = experimentCards[2];
      if (firstCard === undefined || finalCard === undefined) {
        throw new Error("Experiment stage does not contain three cards");
      }
      const stageBounds = element.getBoundingClientRect();
      const finalBounds = finalCard.getBoundingClientRect();
      return {
        bodyHasHorizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth,
        firstScale: new DOMMatrixReadOnly(getComputedStyle(firstCard).transform).m11,
        finalScale: new DOMMatrixReadOnly(getComputedStyle(finalCard).transform).m11,
        leftInset: finalBounds.left - stageBounds.left,
        rightInset: stageBounds.right - finalBounds.right,
      };
    });
    expect(finalGeometry.leftInset).toBeGreaterThanOrEqual(-1);
    expect(finalGeometry.rightInset).toBeGreaterThanOrEqual(-1);
    expect(finalGeometry.finalScale).toBeGreaterThan(finalGeometry.firstScale);
    expect(finalGeometry.bodyHasHorizontalOverflow).toBe(false);
  });
}

test("creates no more than four approved desktop pin spacers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const pinCount = await page.locator(".pin-spacer").count();
  expect(pinCount).toBeGreaterThan(0);
  expect(pinCount).toBeLessThanOrEqual(4);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(1);
});

test("does not pin the compact experience", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Compact-only assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-scene='experiments']").locator("..")).not.toHaveClass(/pin-spacer/);
});

test("keeps compact and desktop motion exhaustive at the breakpoint", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Boundary assertion");
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    const observedQueries = new Set<string>();
    Object.defineProperty(window, "__observedMotionQueries", {
      configurable: false,
      get: (): readonly string[] => Array.from(observedQueries),
    });
    const boundaryMatches = new Map<string, boolean>([
      ["(max-width: 959px)", false],
      ["(max-width: 959.98px)", true],
      ["(min-width: 960px)", false],
    ]);
    window.matchMedia = (query: string): MediaQueryList => {
      observedQueries.add(query);
      const mediaQueryList = nativeMatchMedia(query);
      const forcedMatch = boundaryMatches.get(query);
      if (forcedMatch === undefined) {
        return mediaQueryList;
      }
      return new Proxy(mediaQueryList, {
        get(target, property, receiver): unknown {
          if (property === "matches") {
            return forcedMatch;
          }
          const value = Reflect.get(target, property, receiver) as unknown;
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    };
  });

  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  const observedQueries = await page.evaluate(
    () => (window as unknown as { readonly __observedMotionQueries: readonly string[] }).__observedMotionQueries,
  );
  expect(observedQueries).toContain("(max-width: 959.98px)");
  const conditions = await page.evaluate(() => ({
    compact: matchMedia("(max-width: 959.98px)").matches,
    desktop: matchMedia("(min-width: 960px)").matches,
  }));
  expect(conditions).toEqual({ compact: true, desktop: false });

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("creates no GSAP pinning or split wrappers with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "reduced");
  await expect(page.locator(".experience-progress")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-project-case]")).toHaveCount(3);
  await expect(page.locator("[data-evidence-lens]")).toBeHidden();
  const experimentStyles = await page.locator("[data-scene='experiments']").evaluate((section) => {
    const strip = section.querySelector<HTMLElement>("[data-experiment-strip]");
    if (strip === null) {
      throw new Error("Reduced-motion experiment section is missing its strip");
    }
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-experiment-card]"));
    return {
      cardOpacities: cards.map((card) => getComputedStyle(card).opacity),
      cardTransforms: cards.map((card) => getComputedStyle(card).transform),
      stripTransform: getComputedStyle(strip).transform,
    };
  });
  expect(experimentStyles.cardOpacities).toEqual(["1", "1", "1"]);
  expect(experimentStyles.cardTransforms).toEqual(["none", "none", "none"]);
  expect(experimentStyles.stripTransform).toBe("none");
});

test("remounts one experiment pin across desktop and compact breakpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop lifecycle assertion");
  const originalViewport = page.viewportSize();
  if (originalViewport === null) {
    throw new Error("Experiment lifecycle test requires a configured viewport");
  }
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(1);

  await page.setViewportSize({ width: 959, height: originalViewport.height });
  await page.waitForTimeout(350);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(0);
  await expect(page.locator("[data-experiment-strip]")).toHaveCSS("transform", "none");

  await page.setViewportSize(originalViewport);
  await page.waitForTimeout(350);
  await expect(page.locator(".pin-spacer [data-scene='experiments']")).toHaveCount(1);
});

test("restores claim and verdict scene state while scrolling back", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  const progress = page.locator("[data-progress-value]");
  const claim = page.locator("[data-scene='claim']");
  const scrollInsideSceneTrigger = async (selector: string): Promise<void> => {
    await page.locator(selector).evaluate((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, sectionTop - window.innerHeight * 0.65);
    });
  };

  await claim.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "claim");
  await expect(progress).toHaveText("02");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await scrollInsideSceneTrigger("[data-scene='verdict']");
  await expect(root).toHaveAttribute("data-active-scene", "verdict");
  await expect(progress).toHaveText("06");
  await scrollInsideSceneTrigger("[data-scene='claim']");
  await expect(root).toHaveAttribute("data-active-scene", "claim");
  await expect(progress).toHaveText("02");
});

test("normalizes all method connector paths", async ({ page }) => {
  await page.goto("/");
  const connectors = page.locator("[data-method-connector]");
  await expect(connectors).toHaveCount(3);
  const pathLengths = await connectors.evaluateAll(
    (paths) => paths.map((path) => path.getAttribute("pathLength")),
  );
  expect(pathLengths).toEqual(["1", "1", "1"]);
});
