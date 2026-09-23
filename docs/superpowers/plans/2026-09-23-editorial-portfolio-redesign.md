# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Turn Miquel Manzano's bilingual portfolio into a compact, recruiter-friendly editorial page that retains distinctive project visuals and purposeful animation.

**Architecture:** Keep the existing Next.js routes and locale-specific content modules. First deliver a complete static page in normal document flow, then refine its three project diagrams, then replace the old pinned GSAP scenes with short entrance and project animations. The static document remains the source of accessible content.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, CSS, GSAP 3, Playwright.

**Spec:** docs/superpowers/specs/2026-09-23-editorial-portfolio-redesign.md

## Global Constraints

- Preserve English at / and /en, Spanish at /es, and reciprocal locale links.
- Show QGC Planner, BorderPass AI, and Ticket OCR Scanner in that order with verified names, technologies, repositories, education, email, and GitHub.
- Use a warm off-white canvas, dark graphite text, controlled spacing, and one red accent derived from the current design.
- Keep informative project visuals and motion; do not portray conceptual diagrams as real screenshots.
- Use normal scrolling. Remove scroll pinning, scrubbed scenes, progress counting, evidence lens, scan overlays, and corruption effects.
- All core content and actions are visible without JavaScript and with reduced motion.
- Add no backend, service, or package.
- Work from the current dirty tree. Read the diff before changing a file, preserve unrelated edits, and stage only task files. Do not stage .gitignore or .playwright-cli/.
- Follow the repository's strict types, single-purpose functions, and existing integration-focused test strategy.

## Review Focus

1. JavaScript disabled: the hero, three project rows, education, and contact links remain visible. Task 1 pins this with an existing Playwright accessibility test.
2. Language switching: /, /en, and /es retain matching anchors and correct locale metadata. Task 1 pins this in portfolio-shell.spec.ts.
3. Narrow mobile width: project diagrams and long technology labels do not create horizontal overflow at 320px. Task 2 pins this in accessibility.spec.ts.
4. Reduced motion: all content and diagrams remain visible without pin spacers or animated transforms. Task 3 pins this in motion-experience.spec.ts.
5. Malformed URL fragments: loading /#% causes no page error and leaves the page usable. Task 3 pins this in motion-experience.spec.ts.

## File map

- src/content/types.ts defines the final shared content contract. src/content/portfolio.es.ts and portfolio.en.ts supply direct copy; src/content/destinations.ts stays authoritative for URLs. src/lib/content-validation.ts and scripts/test-content-validation.ts enforce the bilingual contract.
- src/components/portfolio/PortfolioPage.tsx owns section order. ExperienceHeader.tsx, ProofIntro.tsx, ProjectEvidence.tsx, ProjectCaseScene.tsx, BuildMethod.tsx, FormationTrace.tsx, ProofVerdict.tsx, and ExternalAction.tsx each render one visible concern. Old theatrical component files are removed after references are gone.
- src/components/previews/QgcPreview.tsx, BorderPassPreview.tsx, and OcrPreview.tsx render the three conceptual diagrams.
- src/styles/tokens.css, base.css, shell.css, sections.css, previews.css, responsive.css, and motion.css own visual styles according to their current roles. src/app/globals.css controls imports.
- src/motion/create-portfolio-motion.ts coordinates the new animation. src/components/motion/MotionExperience.tsx remains the client boundary; obsolete scene modules and progress helpers are removed when no longer imported.
- Existing Playwright files tests/portfolio-shell.spec.ts, projects.spec.ts, accessibility.spec.ts, and motion-experience.spec.ts check the rendered result. No new unit-test suite is added.

---

### Task 1: Build the readable static editorial page

**Files:**
- Modify: src/content/types.ts, src/content/portfolio.es.ts, src/content/portfolio.en.ts, src/lib/content-validation.ts, scripts/test-content-validation.ts
- Modify: src/components/portfolio/PortfolioPage.tsx, ExperienceHeader.tsx, ProofIntro.tsx, ProjectEvidence.tsx, ProjectCaseScene.tsx, BuildMethod.tsx, FormationTrace.tsx, ProofVerdict.tsx, ExternalAction.tsx
- Modify: src/styles/tokens.css, base.css, shell.css, sections.css, previews.css, responsive.css, src/app/globals.css
- Modify: tests/portfolio-shell.spec.ts, tests/projects.spec.ts, tests/accessibility.spec.ts, tests/motion-experience.spec.ts

**Interfaces:**
- Consumes: getPortfolioContent(locale: Locale): PortfolioContent and existing ExternalDestination definitions.
- Produces: PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element with ids profile, projects, capabilities, education, contact; a revised PortfolioContent with intro, projects, method, education, and contact sections; one project preview inside each project row.

- [ ] **Step 1: Add failing browser checks for recruiter-first hierarchy and static access**

Replace old narrative assertions in tests/portfolio-shell.spec.ts and tests/accessibility.spec.ts with these checks, while retaining existing canonical, hreflang, skip-link, axe, and verified-destination assertions:

~~~tsx
test("shows identity, projects, and contact in a compact semantic order", async ({ page }) => {
  await page.goto("/es");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver proyectos" })).toHaveAttribute("href", "#projects");
  await expect(page.getByRole("link", { name: "Contactar" }).first()).toBeVisible();
  await expect(main.locator("section")).toHaveCount(5);
  await expect(main.locator("[data-project-case]")).toHaveCount(3);
  await expect(page.locator(".pin-spacer, .experience-progress, [data-evidence-lens]")).toHaveCount(0);
});

test("keeps hiring information usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/es");
    await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
    await expect(page.locator("[data-project-case]")).toHaveCount(3);
    await expect(page.locator("#education")).toBeVisible();
    await expect(page.getByRole("link", { name: "Correo" })).toHaveAttribute("href", "mailto:mmanz2606@gmail.com");
  } finally {
    await context.close();
  }
});
~~~

In tests/portfolio-shell.spec.ts also retain /, /en, /es route checks and assert that the four navigation targets are projects, capabilities, education, and contact in the same order in both languages. In tests/projects.spec.ts retain the three repository URLs and technology lists, replacing sticky-stage and launch-module styling checks with one inline visual and one working action per project. In tests/motion-experience.spec.ts replace scene/pin assertions temporarily with a single static-root check; Task 3 adds the new motion contract.

- [ ] **Step 2: Run the focused checks and confirm that the old layout fails**

Run: npm run build
Run: npx playwright test tests/portfolio-shell.spec.ts tests/projects.spec.ts tests/accessibility.spec.ts tests/motion-experience.spec.ts
Expected: the new hierarchy and static-access checks fail against the old scenes; record any unrelated pre-existing failure separately.

- [ ] **Step 3: Replace the content contract and bilingual copy**

Keep Locale, ExternalDestination, MethodStage, and EducationItem. Change NavigationItem.target to the four visible targets; remove PrimaryProject.caseLabel. Give PortfolioContent these section fields, with all properties required and readonly:

~~~ts
interface PortfolioContent {
  readonly locale: Locale;
  readonly meta: { readonly title: string; readonly description: string };
  readonly navigation: readonly NavigationItem[];
  readonly system: { readonly pendingLink: string; readonly languageLabel: string };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly role: string;
    readonly summary: string;
    readonly availability: string;
    readonly projectsLabel: string;
    readonly contactLabel: string;
  };
  readonly projects: { readonly eyebrow: string; readonly heading: string; readonly items: readonly PrimaryProject[] };
  readonly method: { readonly eyebrow: string; readonly heading: string; readonly stages: readonly [MethodStage, MethodStage, MethodStage, MethodStage] };
  readonly education: { readonly eyebrow: string; readonly heading: string; readonly currentLabel: string; readonly items: readonly EducationItem[] };
  readonly contact: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly emailLabel: string;
    readonly githubLabel: string;
    readonly email: ExternalDestination;
    readonly github: ExternalDestination;
  };
}
~~~

Use these exact introductory and navigation strings, translating the remaining section headings into equally direct language:

~~~ts
const spanishNavigation = [
  { label: "Proyectos", target: "projects" },
  { label: "Tecnologías", target: "capabilities" },
  { label: "Formación", target: "education" },
  { label: "Contacto", target: "contact" },
] as const;
const spanishIntro = {
  eyebrow: "Portfolio / desarrollo de aplicaciones",
  name: "Miquel Manzano",
  role: "Desarrollador de aplicaciones",
  summary: "Desarrollo aplicaciones web y móviles con interfaces claras y soluciones útiles.",
  availability: "En formación continua a través de proyectos reales.",
  projectsLabel: "Ver proyectos",
  contactLabel: "Contactar",
} as const;
~~~

The English intro uses "Application developer", "I build web and mobile applications with clear interfaces and practical solutions.", "Continuing to learn through real projects.", "View projects", and "Contact". Keep each existing project technology array and destination unchanged. Use direct summaries of the verified scope, such as "Aplicación Flutter que escanea tickets y extrae información estructurada con OCR." Preserve all education values. In content-validation.ts require four matching navigation targets, three projects, three education entries, equivalent immutable technology and destination signatures, non-empty new copy fields, and valid published URL protocols. Update the current empty-verdict case in scripts/test-content-validation.ts to an empty contact.heading case and keep its existing mismatch cases.

Use "Proyectos" and "Tecnologías" for the Spanish project and method headings, and "Projects" and "Technologies" in English. Set the Spanish contact heading to "¿Hablamos?", emailLabel to "Correo", and githubLabel to "GitHub"; use "Let's talk", "Email", and "GitHub" in English. Keep contactDestinations.email and contactDestinations.github unchanged.

- [ ] **Step 4: Render the static page and remove scene dependency**

Make PortfolioPage.tsx render this order and remove the old MotionExperienceRoot and EvidenceLens until Task 3:

~~~tsx
export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell" data-motion-root data-motion-state="static">
      <ExperienceHeader content={content} />
      <main id="main-content" tabIndex={-1}>
        <ProofIntro content={content.intro} email={content.contact.email} pendingLabel={content.system.pendingLink} />
        <ProjectEvidence {...content.projects} pendingLabel={content.system.pendingLink} />
        <BuildMethod method={content.method} />
        <FormationTrace content={content.education} />
        <ProofVerdict content={content.contact} pendingLabel={content.system.pendingLink} />
      </main>
    </div>
  );
}
~~~

ExperienceHeader renders a compact name link, four anchors, locale switch, and a #contact link; it has no progress element. ProofIntro renders one h1, role, summary, availability, #projects action, and an ExternalAction using the verified email. ProjectEvidence maps three ProjectCaseScene rows with each existing preview rendered once inside its row; remove the duplicated visual stage. BuildMethod renders the four existing skill groups without connectors and no longer nests FormationTrace. FormationTrace stays a compact dated list. ProofVerdict renders a direct contact heading with the existing email and GitHub destinations. ExternalAction keeps published and pending states; use a direct mailto link without target=_blank, and preserve a descriptive HTTPS link.

Keep data-scene="intro" on the introduction. Set data-motion-reveal on its heading, summary, and action group. Set data-motion-section on each later section heading and project row. These are visible, semantic elements in the static document and become Task 3's animation hooks.

- [ ] **Step 5: Apply the editorial layout**

Replace the full-viewport sizing, dramatic dark gradients, giant uppercase headings, sticky preview stage, and tall mobile navigation. Use the existing CSS files and these layout values as the starting contract:

~~~css
:root {
  --color-canvas: #f7f4ee;
  --color-surface: #fffdf8;
  --color-ink: #202529;
  --color-muted: #596269;
  --color-line: #d9d3ca;
  --color-accent: #bf4737;
  --content-max: 74rem;
  --page-inline: clamp(1.25rem, 4vw, 4rem);
  --section-block: clamp(3.5rem, 6vw, 6rem);
}
.proof-intro,
.project-evidence,
.build-method,
.formation-trace,
.proof-verdict {
  min-height: 0;
  padding: var(--section-block) var(--page-inline);
}
.project-evidence__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}
@media (max-width: 760px) {
  .project-evidence__item { grid-template-columns: minmax(0, 1fr); }
}
~~~

Retain visible focus and skip-link styles. Place education outside capabilities as its own short section. Remove the obsolete motion stylesheet import from globals.css for the static milestone.
Update old color and spacing token references in base.css, shell.css, sections.css, responsive.css, and the temporarily retained previews.css so the static milestone has no undefined CSS variables. Task 2 replaces the preview-specific visual rules.

- [ ] **Step 6: Verify the static deliverable and commit only its scoped files**

Run: npm run validate:content
Run: npm run test:content
Run: npm run lint
Run: npm run typecheck
Run: npm run build
Run: npx playwright test tests/portfolio-shell.spec.ts tests/projects.spec.ts tests/accessibility.spec.ts tests/motion-experience.spec.ts
Expected: all pass with static content; no pin spacer exists. Run git --no-pager diff --check and inspect git --no-pager diff plus git status --short. Stage only the Task 1 paths, inspect git --no-pager diff --cached --name-only, then commit with message "feat: present a compact editorial portfolio". Preserve unrelated pre-existing edits.

### Task 2: Turn the project previews into editorial diagrams

**Files:**
- Modify: src/components/previews/QgcPreview.tsx, BorderPassPreview.tsx, OcrPreview.tsx
- Modify: src/styles/previews.css, src/styles/responsive.css
- Modify: tests/projects.spec.ts, tests/accessibility.spec.ts

**Interfaces:**
- Consumes: the three inline preview components used by ProjectEvidence; each remains a zero-argument React component.
- Produces: one static visual per project with data-route, data-decision-step, or data-output-row hooks for Task 3. All visuals remain aria-hidden because nearby text explains the project.

- [ ] **Step 1: Add failing project-visual and narrow-width browser checks**

~~~tsx
test("shows one informative illustration inside each project row", async ({ page }) => {
  await page.goto("/");
  const route = page.locator("[data-project-case='qgc-planner'] [data-route]");
  await expect(route).toHaveCount(1);
  await expect(route).toHaveAttribute("pathLength", "1");
  await expect(page.locator("[data-project-case='borderpass-ai'] [data-decision-step]")).toHaveCount(3);
  await expect(page.locator("[data-project-case='ticket-ocr'] [data-output-row]")).toHaveCount(3);
  await expect(page.locator("[data-project-visual-stage]")).toHaveCount(0);
  await expect(page.getByText("MAVLINK / CONNECTED")).toHaveCount(0);
  await expect(page.getByText("ANALYSIS READY")).toHaveCount(0);
});

test("contains project illustrations at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/es");
  const dimensions = await page.locator("body").evaluate((body) => ({
    content: body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
~~~

- [ ] **Step 2: Run the focused visual checks and see the old art fail**

Run: npm run build
Run: npx playwright test tests/projects.spec.ts tests/accessibility.spec.ts
Expected: the normalized route and removal of fictional status labels fail against the old preview markup.

- [ ] **Step 3: Rebuild the three existing preview components**

QgcPreview keeps one SVG route with waypoints and sets pathLength="1" on its route path. BorderPassPreview uses three numbered decision nodes linked in order; OcrPreview uses a receipt outline and three structured result rows. Preserve the hooks below exactly for Task 3:

~~~tsx
<svg className="preview-route" viewBox="0 0 200 100" aria-hidden="true">
  <polyline data-route pathLength="1" points="12,75 52,31 103,59 159,24 188,46" />
</svg>
<div className="preview-decision-steps" aria-hidden="true">
  <span data-decision-step>01</span><span data-decision-step>02</span><span data-decision-step>03</span>
</div>
<div className="preview-output" aria-hidden="true">
  <span data-output-row>01</span><span data-output-row>02</span><span data-output-row>03</span>
</div>
~~~

Use shapes and labels as conceptual explanations, not screenshots or claims of a live product state. Remove "MAVLINK / CONNECTED" and "ANALYSIS READY" text.

- [ ] **Step 4: Style and visually inspect the diagrams**

~~~css
.preview-frame {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: 1.25rem;
  background: #ece7dc;
}
.preview-route polyline {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
~~~

Use one graphic style shared by all three diagrams: warm paper surface, fine graphite lines, and selective red emphasis. Keep each complete visual within its card at 320px, the default desktop viewport, and the existing Pixel 7 viewport. Remove obsolete dark scan, grid, and sticky-stage selectors from previews.css and responsive.css.

- [ ] **Step 5: Verify diagrams and commit their scoped files**

Run: npm run build
Run: npx playwright test tests/projects.spec.ts tests/accessibility.spec.ts
Expected: visual hooks, project actions, and mobile containment pass. Inspect both locales at desktop and mobile sizes. Run git --no-pager diff --check and inspect staged paths before committing with message "feat: show editorial project diagrams".

### Task 3: Add purposeful motion and remove obsolete scenes

**Files:**
- Modify: src/components/portfolio/PortfolioPage.tsx, src/motion/create-portfolio-motion.ts, src/motion/types.ts, src/styles/motion.css, src/app/globals.css
- Reuse: src/components/motion/MotionExperience.tsx, src/motion/contracts.ts
- Remove after import search: src/motion/create-scene-progress.ts and the old create-intro-scene.ts, create-execution-claim-scene.ts, create-build-method-scene.ts, create-project-evidence-scene.ts, create-verdict-scene.ts, create-evidence-lens.ts modules; obsolete ExecutionClaim.tsx and EvidenceLens.tsx components
- Modify: tests/motion-experience.spec.ts, tests/accessibility.spec.ts

**Interfaces:**
- Consumes: PortfolioExperienceRoot and the Task 2 data-route, data-decision-step, and data-output-row hooks.
- Produces: createPortfolioMotion(root: HTMLElement): () => void. The return value cleans up all GSAP work. data-motion-state is static, ready, or reduced; the document stays visible in every state.

- [ ] **Step 1: Add failing interaction checks**

Replace old pin, progress, and scene-count tests in tests/motion-experience.spec.ts with:

~~~tsx
test("enhances the portfolio without pinning sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".pin-spacer, .experience-progress, [data-evidence-lens]")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
});

test("keeps the static visual for reduced-motion visitors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "reduced");
  await expect(page.locator("[data-project-case]")).toHaveCount(3);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("ignores malformed fragments without a page error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#%");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  expect(errors).toEqual([]);
});
~~~

Keep keyboard and axe checks in accessibility.spec.ts. Add this contract-failure check to motion-experience.spec.ts:

~~~tsx
test("leaves content visible when a diagram hook is missing", async ({ page }) => {
  await page.addInitScript(() => {
    const observer = new MutationObserver((): void => {
      const route = document.querySelector("[data-route]");
      if (route !== null) {
        route.removeAttribute("data-route");
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "static");
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
~~~

- [ ] **Step 2: Run the focused checks against the static milestone**

Run: npm run build
Run: npx playwright test tests/motion-experience.spec.ts tests/accessibility.spec.ts
Expected: the ready-state and diagram-motion assertions fail while static and reduced-motion behavior remains readable.

- [ ] **Step 3: Replace the motion coordinator with short, self-cleaning animations**

Return PortfolioPage to PortfolioExperienceRoot. In create-portfolio-motion.ts keep createPortfolioMotion as the public entry point, use gsap.matchMedia for reduced-motion changes, validate all required selectors before starting tweens, and split the behavior into single-purpose functions:
Import gsap, ScrollTrigger, requireElement, requireElements, and SceneCleanup at the top of the file; register ScrollTrigger and remove the unused Flip registration.

~~~ts
function createHeroEntrance(root: HTMLElement): SceneCleanup {
  const hero = requireElement<HTMLElement>(root, "hero", "[data-scene='intro']");
  const items = requireElements<HTMLElement>(hero, "hero", "[data-motion-reveal]");
  const tween = gsap.from(items, { y: 24, opacity: 0, duration: 0.65, stagger: 0.1, ease: "power2.out", clearProps: "all" });
  return (): void => { tween.revert(); };
}

function createSectionReveals(root: HTMLElement): SceneCleanup {
  const items = requireElements<HTMLElement>(root, "sections", "[data-motion-section]");
  const tweens = items.map((item) => gsap.from(item, {
    y: 28, opacity: 0, duration: 0.6, ease: "power2.out", clearProps: "all",
    scrollTrigger: { trigger: item, start: "top 86%", once: true },
  }));
  return (): void => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.revert();
    });
  };
}
~~~

Add createDiagramMotion(root: HTMLElement): SceneCleanup in the same file. Resolve all hooks before starting a tween, then animate each diagram once when its row enters view:

~~~ts
function createDiagramMotion(root: HTMLElement): SceneCleanup {
  const qgc = requireElement<HTMLElement>(root, "qgc", "[data-project-case='qgc-planner']");
  const borderPass = requireElement<HTMLElement>(root, "borderpass", "[data-project-case='borderpass-ai']");
  const ocr = requireElement<HTMLElement>(root, "ocr", "[data-project-case='ticket-ocr']");
  const route = requireElement<SVGPolylineElement>(qgc, "qgc", "[data-route]");
  const decisions = requireElements<HTMLElement>(borderPass, "borderpass", "[data-decision-step]");
  const outputs = requireElements<HTMLElement>(ocr, "ocr", "[data-output-row]");
  const routeTween = gsap.fromTo(route,
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: qgc, start: "top 80%", once: true } },
  );
  const decisionTween = gsap.from(decisions, {
    y: 12, opacity: 0, duration: 0.5, stagger: 0.1, clearProps: "all",
    scrollTrigger: { trigger: borderPass, start: "top 80%", once: true },
  });
  const outputTween = gsap.from(outputs, {
    y: 12, opacity: 0, duration: 0.5, stagger: 0.1, clearProps: "all",
    scrollTrigger: { trigger: ocr, start: "top 80%", once: true },
  });
  const tweens = [routeTween, decisionTween, outputTween] as const;
  return (): void => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.revert();
    });
  };
}
~~~

Retain the existing cleanupScenes helper and its AggregateError behavior. Use gsap.matchMedia to switch between the following branches; on every failure reset the root to static and rethrow the specific cause:

~~~ts
export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  try {
    media.add("(prefers-reduced-motion: reduce)", () => {
      root.dataset.motionState = "reduced";
      return (): void => { root.dataset.motionState = "static"; };
    }, root);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: SceneCleanup[] = [];
      try {
        cleanups.push(createHeroEntrance(root));
        cleanups.push(createSectionReveals(root));
        cleanups.push(createDiagramMotion(root));
        root.dataset.motionState = "ready";
      } catch (error: unknown) {
        try {
          cleanupScenes(cleanups);
        } catch (cleanupError: unknown) {
          root.dataset.motionState = "static";
          throw new AggregateError([error, cleanupError], "Editorial motion initialization and rollback failed");
        }
        root.dataset.motionState = "static";
        throw error;
      }
      return (): void => {
        try {
          cleanupScenes(cleanups);
        } finally {
          root.dataset.motionState = "static";
        }
      };
    }, root);
  } catch (error: unknown) {
    try {
      media.revert();
    } catch (revertError: unknown) {
      root.dataset.motionState = "static";
      throw new AggregateError([error, revertError], "Editorial motion initialization and media rollback failed");
    }
    root.dataset.motionState = "static";
    throw error;
  }
  return (): void => {
    try {
      media.revert();
    } finally {
      root.dataset.motionState = "static";
    }
  };
}
~~~

Keep the MotionErrorBoundary in MotionExperience.tsx so a motion error never removes the server-rendered page.

- [ ] **Step 4: Replace motion CSS and remove dead scene code**

~~~css
[data-motion-root] [data-motion-reveal],
[data-motion-root] [data-motion-section] { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
~~~

Remove selectors for scanlines, corruption flash, evidence lens, claim assembly, and sticky preview crossfades. Import the replacement motion.css in globals.css. Search imports with rg before deleting each old module or component. Keep no hidden base state in CSS.

- [ ] **Step 5: Run final validation, visual review, and scoped commit**

Run: npm run validate
Expected: content checks, lint, typecheck, production build, performance audit, and existing browser suite pass. Inspect English and Spanish pages at desktop and mobile widths, reduced motion, keyboard focus, project hover, and each diagram's entrance. If a specific check fails, fix its cause and rerun that check; repeat the full validation only if the fix could affect another gate. Run git --no-pager diff --check, inspect git --no-pager diff and git status --short, stage only Task 3 paths, verify git --no-pager diff --cached --name-only, and commit with message "feat: animate the editorial portfolio".

## Completion review

Compare the finished page with every success criterion in the spec. Confirm that the three projects and contact methods are discoverable quickly, no theatrical labels or pinned scenes remain, both locales match, and the original uncommitted work outside the scoped files is still present. Do not push or deploy unless the user asks.
