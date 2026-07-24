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

test("restores the direct method anchor after desktop pin geometry initializes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/#capabilities");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  const method = page.locator("#capabilities");
  await expect.poll(async (): Promise<number> => {
    const box = await method.boundingBox();
    return box?.y ?? Number.POSITIVE_INFINITY;
  }).toBeLessThan(100);
});

test("updates scene and project progress while scrolling", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  await page.locator("[data-scene='method']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "method");
  await page.locator("[data-project-case='borderpass-ai']").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "projects");
  await expect(root).toHaveAttribute("data-active-project", "borderpass-ai");
});

test("creates no more than three desktop pin spacers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop pin assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const pinCount = await page.locator(".pin-spacer").count();
  expect(pinCount).toBeGreaterThan(0);
  expect(pinCount).toBeLessThanOrEqual(3);
});

test("does not pin the compact experience", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Compact-only assertion");
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
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
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-project-case]")).toHaveCount(3);
  await expect(page.locator("[data-evidence-lens]")).toBeHidden();
});

test("restores claim and verdict scene state while scrolling back", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  const claim = page.locator("[data-scene='claim']");
  const scrollInsideSceneTrigger = async (selector: string): Promise<void> => {
    await page.locator(selector).evaluate((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, sectionTop - window.innerHeight * 0.65);
    });
  };

  await claim.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-active-scene", "claim");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await scrollInsideSceneTrigger("[data-scene='verdict']");
  await expect(root).toHaveAttribute("data-active-scene", "verdict");
  await scrollInsideSceneTrigger("[data-scene='claim']");
  await expect(root).toHaveAttribute("data-active-scene", "claim");
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
