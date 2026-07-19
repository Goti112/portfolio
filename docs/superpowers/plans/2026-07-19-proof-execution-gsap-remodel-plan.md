# PROOF → EXECUTION GSAP Portfolio Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the bilingual portfolio as a cinematic PROOF → EXECUTION hiring narrative with GSAP choreography, accessible static content, responsive behavior, and the existing performance budgets.

**Architecture:** Keep all localized content and semantic page structure server-rendered, then add one scoped React client boundary that initializes independent GSAP scene factories. CSS owns final readable states and responsive composition; GSAP owns only narrative sequencing, pinning, SplitText, Flip, and scoped pointer effects.

**Tech Stack:** Next.js 16 App Router static export, React 19, strict TypeScript, CSS, GSAP, `@gsap/react`, ScrollTrigger, SplitText, Flip, Playwright, axe-core, Lighthouse CI.

## Global Constraints

- Preserve all pre-existing worktree changes. Several overlap `package.json`, `PortfolioPage.tsx`, styles, and tests; before Task 1, obtain approval for a baseline checkpoint commit containing those changes. Do not stage them accidentally with a feature commit.
- Use only GSAP core, `@gsap/react`, ScrollTrigger, SplitText, and Flip. Do not add ScrollSmoother, Three.js, WebGL, Canvas, or another animation library.
- Keep native scroll behavior. Do not change scroll speed or direction and do not add mandatory snap.
- Use no more than three pinned sequences: cold open, build method, and primary project evidence.
- Desktop full-motion behavior starts at `min-width: 960px`; compact behavior is below `960px`; reduced motion overrides both.
- Preserve the direct anchors `profile`, `capabilities`, `projects`, `education`, and `contact`.
- Preserve LCP ≤ 2.5 seconds and CLS ≤ 0.1 for `/` and `/en`.
- Do not invent project metrics, contributions, implementation details, results, descriptions, destinations, screenshots, or videos.
- Keep `ExternalDestination` pending/published behavior and the three-project `PrimaryProjectId` union.
- Keep all essential content available with JavaScript disabled and with `prefers-reduced-motion: reduce`.
- Comments are English only. Use strict types, pure functions, explicit parameters, top-level imports, and single-purpose files.

## File Structure

### Content and validation

- Modify `src/content/types.ts` — approved narrative and method-stage types.
- Modify `src/content/portfolio.es.ts` — Spanish PROOF → EXECUTION copy.
- Modify `src/content/portfolio.en.ts` — English PROOF → EXECUTION copy.
- Modify `src/lib/content-validation.ts` — validate new required fields and cross-locale method-stage parity.
- Modify `scripts/test-content-validation.ts` — dataset-level validation regression coverage.

### Semantic presentation

- Create `src/components/portfolio/ExperienceHeader.tsx` — navigation, locale, progress labels.
- Create `src/components/portfolio/ProofIntro.tsx` — identity and opening challenge.
- Create `src/components/portfolio/ExecutionClaim.tsx` — professional positioning.
- Create `src/components/portfolio/BuildMethod.tsx` — method, capabilities, and formation shell.
- Create `src/components/portfolio/FormationTrace.tsx` — education list inside the method scene.
- Create `src/components/portfolio/ProjectCaseScene.tsx` — one semantic case.
- Modify `src/components/portfolio/ProjectEvidence.tsx` — three-case container and preview registry.
- Create `src/components/portfolio/ExperimentMontage.tsx` — secondary experiments.
- Create `src/components/portfolio/ProofVerdict.tsx` — availability and actions.
- Create `src/components/portfolio/EvidenceLens.tsx` — inert fine-pointer visual layer.
- Modify `src/components/portfolio/PortfolioPage.tsx` — complete narrative composition and motion boundary.
- Delete superseded `SessionNavigation.tsx`, `SessionIntro.tsx`, `IdentityTrace.tsx`, `CapabilityAnalysis.tsx`, `RecoveredFiles.tsx`, `EducationLog.tsx`, and `SessionExit.tsx` only after no imports remain.

### Motion

- Create `src/components/motion/MotionExperience.tsx` — one client integration boundary.
- Create `src/motion/contracts.ts` — strict DOM contract resolution and `MotionContractError`.
- Create `src/motion/types.ts` — shared motion conditions and cleanup types.
- Create `src/motion/create-portfolio-motion.ts` — plugin registration, media conditions, scene orchestration.
- Create `src/motion/scenes/create-intro-scene.ts`.
- Create `src/motion/scenes/create-execution-claim-scene.ts`.
- Create `src/motion/scenes/create-build-method-scene.ts`.
- Create `src/motion/scenes/create-project-evidence-scene.ts`.
- Create `src/motion/scenes/create-experiment-montage-scene.ts`.
- Create `src/motion/scenes/create-verdict-scene.ts`.
- Create `src/motion/scenes/create-evidence-lens.ts`.
- Delete `src/browser/portfolio-effects.ts` and its generated-script integration after confirming no remaining consumer.

### Styling and tests

- Modify `src/styles/tokens.css`, `base.css`, `shell.css`, `sections.css`, `previews.css`, `motion.css`, and `responsive.css`.
- Modify `tests/portfolio-shell.spec.ts`, `projects.spec.ts`, and `accessibility.spec.ts`.
- Create `tests/motion-experience.spec.ts` — real-browser motion contracts.
- Modify `package.json` and `package-lock.json` — dependencies and removal of the obsolete browser bundle step.

---

### Task 1: Replace the Unknown Session content model with PROOF → EXECUTION

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/portfolio.es.ts`
- Modify: `src/content/portfolio.en.ts`
- Modify: `src/lib/content-validation.ts`
- Modify: `scripts/test-content-validation.ts`

**Interfaces:**
- Produces: `MethodStageId`, `MethodStage`, and the revised `PortfolioContent` sections consumed by every presentation task.
- Preserves: `PrimaryProject`, `Experiment`, `EducationItem`, `ExternalDestination`, and `NavigationItem`.

- [ ] **Step 1: Add failing validation assertions for method-stage parity and required narrative copy**

Append these fixtures and assertions before the final `process.stdout.write` in `scripts/test-content-validation.ts`:

```ts
const methodStageMismatch: PortfolioContent = {
  ...portfolioEnglish,
  method: {
    ...portfolioEnglish.method,
    stages: portfolioEnglish.method.stages.map((stage, index) => index === 0
      ? { ...stage, id: "ship" }
      : stage),
  },
};

const emptyVerdict: PortfolioContent = {
  ...portfolioEnglish,
  verdict: {
    ...portfolioEnglish.verdict,
    headingLines: ["", portfolioEnglish.verdict.headingLines[1]],
  },
};

assert.throws(
  () => validatePortfolioPair(portfolioSpanish, methodStageMismatch),
  /Method stage order differs between Spanish and English content/,
);
assert.throws(
  () => validatePortfolioPair(portfolioSpanish, emptyVerdict),
  /Required content is empty for en:verdict.headingLines/,
);
```

- [ ] **Step 2: Run the content contract test and confirm the model is missing**

Run: `npm run test:content`

Expected: TypeScript compilation fails because `PortfolioContent` does not contain `method` or `verdict`.

- [ ] **Step 3: Define the approved narrative types**

Replace the narrative portion of `PortfolioContent` in `src/content/types.ts` with these exact contracts while keeping the existing project, experiment, education, destination, and navigation types:

```ts
export type MethodStageId = "question" | "model" | "build" | "ship";

export interface MethodStage {
  readonly id: MethodStageId;
  readonly label: string;
  readonly description: string;
  readonly capabilities: readonly string[];
}

export interface PortfolioContent {
  readonly locale: Locale;
  readonly meta: { readonly title: string; readonly description: string };
  readonly navigation: readonly NavigationItem[];
  readonly system: {
    readonly pendingLink: string;
    readonly languageLabel: string;
    readonly progressLabel: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly role: string;
    readonly challengeLines: readonly [string, string];
    readonly availability: string;
  };
  readonly claim: {
    readonly eyebrow: string;
    readonly problemLines: readonly [string, string, string];
    readonly headingLines: readonly [string, string];
    readonly body: string;
    readonly aiPosition: string;
  };
  readonly method: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string, string];
    readonly stages: readonly [MethodStage, MethodStage, MethodStage, MethodStage];
  };
  readonly projects: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly PrimaryProject[];
  };
  readonly experiments: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly Experiment[];
  };
  readonly education: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly EducationItem[];
  };
  readonly verdict: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string];
    readonly availability: string;
    readonly emailLabel: string;
    readonly githubLabel: string;
    readonly email: ExternalDestination;
    readonly github: ExternalDestination;
  };
}
```

- [ ] **Step 4: Populate both locales with the approved copy and four method stages**

Replace the old `system`, `intro`, `identity`, `capabilities`, and `exit` objects with the following Spanish structure, then add the semantically equivalent English structure shown below. Keep the existing project, experiment, and education arrays byte-for-byte except for their approved scene headings.

```ts
const spanishSystem = {
  pendingLink: "ENLACE_PENDIENTE",
  languageLabel: "Cambiar idioma",
  progressLabel: "Progreso de evidencia",
} as const;

const spanishIntro = {
  eyebrow: "MIQUEL MANZANO / DESARROLLADOR FULL-STACK",
  name: "Miquel Manzano",
  role: "Desarrollador full-stack",
  challengeLines: ["NO CONFÍES EN LO QUE DIGO.", "INSPECCIONA EL TRABAJO."],
  availability: "Disponible para crear, aprender y llevar ideas hasta producción.",
} as const;

const spanishClaim = {
  eyebrow: "POSICIONAMIENTO / DE LA INCERTIDUMBRE A LA EJECUCIÓN",
  problemLines: ["PROBLEMA COMPLEJO", "RUTA INCIERTA", "SEÑAL LIMITADA"],
  headingLines: ["CONVIERTO PROBLEMAS COMPLEJOS", "EN PRODUCTOS QUE FUNCIONAN."],
  body: "Desarrollador full-stack formado en sistemas y desarrollo web. Convierto dominios desconocidos en productos funcionales.",
  aiPosition: "Uso la IA como acelerador para abordar mayor complejidad, apoyándome en una base técnica que puedo aplicar de forma autónoma.",
} as const;

const spanishMethod = {
  eyebrow: "MÉTODO / PREGUNTAR → MODELAR → CONSTRUIR → LLEVAR A PRODUCCIÓN",
  headingLines: ["EL CAOS", "SE CONVIERTE", "EN SISTEMA."],
  stages: [
    { id: "question", label: "PREGUNTAR", description: "Aclarar el problema, el contexto y las restricciones.", capabilities: ["HTTP", "REST APIs", "JSON", "Linux", "Terminal"] },
    { id: "model", label: "MODELAR", description: "Convertir el dominio en relaciones, datos y decisiones.", capabilities: ["MySQL", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD", "MVC"] },
    { id: "build", label: "CONSTRUIR", description: "Materializar el sistema con una base técnica adaptable.", capabilities: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "Java", "Python", "Flutter", "Object-oriented programming"] },
    { id: "ship", label: "LLEVAR A PRODUCCIÓN", description: "Probar, desplegar y mantener una experiencia utilizable.", capabilities: ["Git", "GitHub", "Docker", "Web deployment", "Responsive design", "Web accessibility"] },
  ],
} as const;
```

```ts
const englishSystem = {
  pendingLink: "LINK_PENDING",
  languageLabel: "Change language",
  progressLabel: "Evidence progress",
} as const;

const englishIntro = {
  eyebrow: "MIQUEL MANZANO / FULL-STACK DEVELOPER",
  name: "Miquel Manzano",
  role: "Full-stack developer",
  challengeLines: ["DON'T TRUST THE CLAIM.", "INSPECT THE WORK."],
  availability: "Available to create, learn, and take ideas all the way to production.",
} as const;

const englishClaim = {
  eyebrow: "POSITIONING / FROM UNCERTAINTY TO EXECUTION",
  problemLines: ["COMPLEX PROBLEM", "UNCERTAIN PATH", "LIMITED SIGNAL"],
  headingLines: ["I TURN COMPLEX PROBLEMS", "INTO WORKING PRODUCTS."],
  body: "Full-stack developer trained in systems and web development. I turn unfamiliar domains into working products.",
  aiPosition: "I use AI as an accelerator for greater complexity, supported by a technical foundation I can apply independently.",
} as const;

const englishMethod = {
  eyebrow: "METHOD / QUESTION → MODEL → BUILD → SHIP",
  headingLines: ["CHAOS", "BECOMES", "SYSTEM."],
  stages: [
    { id: "question", label: "QUESTION", description: "Clarify the problem, context, and constraints.", capabilities: ["HTTP", "REST APIs", "JSON", "Linux", "Terminal"] },
    { id: "model", label: "MODEL", description: "Turn the domain into relationships, data, and decisions.", capabilities: ["MySQL", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD", "MVC"] },
    { id: "build", label: "BUILD", description: "Materialize the system with an adaptable technical foundation.", capabilities: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "Java", "Python", "Flutter", "Object-oriented programming"] },
    { id: "ship", label: "SHIP", description: "Test, deploy, and maintain a usable experience.", capabilities: ["Git", "GitHub", "Docker", "Web deployment", "Responsive design", "Web accessibility"] },
  ],
} as const;
```

Set the Spanish verdict heading to `["PREPARADO PARA", "CONSTRUIR LO SIGUIENTE."]` and the English verdict heading to `["READY TO BUILD", "THE NEXT ONE."]`. Reuse the existing confirmed availability and destination values.

- [ ] **Step 5: Validate the new fields and immutable stage order**

Add these pure helpers to `src/lib/content-validation.ts` and call them from `validatePortfolioPair`:

```ts
function methodSignature(stages: PortfolioContent["method"]["stages"]): string {
  return stages.map((stage) => stage.id).join(",");
}

function methodCapabilitySignature(stages: PortfolioContent["method"]["stages"]): string {
  return stages.map((stage) => `${stage.id}:${stage.capabilities.join(",")}`).join("|");
}

function validateNarrative(content: PortfolioContent): void {
  const locale = content.locale;
  assertNonEmpty(content.system.progressLabel, `${locale}:system.progressLabel`);
  assertNonEmpty(content.intro.role, `${locale}:intro.role`);
  for (const line of content.intro.challengeLines) assertNonEmpty(line, `${locale}:intro.challengeLines`);
  for (const line of content.claim.problemLines) assertNonEmpty(line, `${locale}:claim.problemLines`);
  for (const line of content.claim.headingLines) assertNonEmpty(line, `${locale}:claim.headingLines`);
  assertNonEmpty(content.claim.body, `${locale}:claim.body`);
  assertNonEmpty(content.claim.aiPosition, `${locale}:claim.aiPosition`);
  for (const line of content.method.headingLines) assertNonEmpty(line, `${locale}:method.headingLines`);
  for (const stage of content.method.stages) {
    assertNonEmpty(stage.label, `${locale}:method.${stage.id}.label`);
    assertNonEmpty(stage.description, `${locale}:method.${stage.id}.description`);
    for (const capability of stage.capabilities) assertNonEmpty(capability, `${locale}:method.${stage.id}.capability`);
  }
  for (const line of content.verdict.headingLines) assertNonEmpty(line, `${locale}:verdict.headingLines`);
}
```

```ts
assertCondition(
  methodSignature(spanish.method.stages) === methodSignature(english.method.stages),
  "Method stage order differs between Spanish and English content",
);
assertCondition(
  methodCapabilitySignature(spanish.method.stages) === methodCapabilitySignature(english.method.stages),
  "Method capabilities differ between Spanish and English content",
);
```

Remove validation for deprecated `readOnly`, `command`, `identity`, `capabilities`, and `exit` fields, then call `validateNarrative(content)` for each locale.

- [ ] **Step 6: Run content validation and type checking**

Run: `npm run test:content && npm run validate:content && npm run typecheck`

Expected: all three commands exit 0.

- [ ] **Step 7: Commit the content contract**

```bash
git add src/content/types.ts src/content/portfolio.es.ts src/content/portfolio.en.ts src/lib/content-validation.ts scripts/test-content-validation.ts
git commit -m "feat: define proof execution content model"
```

### Task 2: Build the semantic PROOF → EXECUTION page shell

**Files:**
- Create: `src/components/portfolio/ExperienceHeader.tsx`
- Create: `src/components/portfolio/ProofIntro.tsx`
- Create: `src/components/portfolio/ExecutionClaim.tsx`
- Create: `src/components/portfolio/BuildMethod.tsx`
- Create: `src/components/portfolio/FormationTrace.tsx`
- Create: `src/components/portfolio/ProofVerdict.tsx`
- Create: `src/components/portfolio/EvidenceLens.tsx`
- Modify: `src/components/portfolio/PortfolioPage.tsx`
- Modify: `tests/portfolio-shell.spec.ts`

**Interfaces:**
- Consumes: revised `PortfolioContent` from Task 1 and existing `ExternalAction`.
- Produces: stable `data-scene`, heading, anchor, method-stage, and verdict contracts consumed by motion and browser tests.

- [ ] **Step 1: Replace old narrative-marker assertions with the approved semantic contract**

In `tests/portfolio-shell.spec.ts`, replace the old status-marker test with:

```ts
test("renders the proof execution narrative in semantic order", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(main.getByText("NO CONFÍES EN LO QUE DIGO.", { exact: true })).toBeVisible();
  await expect(main.getByText("INSPECCIONA EL TRABAJO.", { exact: true })).toBeVisible();
  await expect(main.getByText("CONVIERTO PROBLEMAS COMPLEJOS", { exact: true })).toBeVisible();
  await expect(page.locator("[data-method-stage]")).toHaveCount(4);
  await expect(main.getByText("PREPARADO PARA", { exact: true })).toBeVisible();
  await expect(main.getByText("CONSTRUIR LO SIGUIENTE.", { exact: true })).toBeVisible();
});

test("exposes every motion scene exactly once", async ({ page }) => {
  await page.goto("/");
  for (const scene of ["intro", "claim", "method", "projects", "experiments", "verdict"]) {
    await expect(page.locator(`[data-scene='${scene}']`)).toHaveCount(1);
  }
});
```

- [ ] **Step 2: Run the focused shell test and confirm it fails**

Run: `npm run build && npm run test:e2e:built -- tests/portfolio-shell.spec.ts --project=desktop-chromium`

Expected: FAIL because the approved copy and `data-scene` contracts are not rendered.

- [ ] **Step 3: Create the semantic section components**

Use these contracts exactly:

```tsx
// ProofIntro.tsx
import type { PortfolioContent } from "@/content/types";

interface ProofIntroProps { readonly content: PortfolioContent["intro"]; }

export function ProofIntro({ content }: ProofIntroProps): React.JSX.Element {
  return (
    <section id="profile" className="proof-intro" data-scene="intro">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <h1>{content.name}</h1>
      <p className="proof-intro__role">{content.role}</p>
      <div className="proof-intro__challenge" data-motion-heading data-motion-reveal>
        {content.challengeLines.map((line) => <span key={line}>{line}</span>)}
      </div>
      <p className="proof-intro__availability">{content.availability}</p>
      <div className="proof-intro__evidence-window" data-intro-window aria-hidden="true" />
      <div className="proof-intro__scan" data-intro-scan aria-hidden="true" />
    </section>
  );
}
```

```tsx
// ExecutionClaim.tsx
import type { PortfolioContent } from "@/content/types";

interface ExecutionClaimProps { readonly content: PortfolioContent["claim"]; }

export function ExecutionClaim({ content }: ExecutionClaimProps): React.JSX.Element {
  return (
    <section className="execution-claim" data-scene="claim">
      <p className="scene-eyebrow">{content.eyebrow}</p>
      <div className="execution-claim__fragments" aria-hidden="true">
        {content.problemLines.map((line) => <span key={line} data-claim-fragment>{line}</span>)}
      </div>
      <h2 data-motion-heading data-motion-reveal>{content.headingLines.map((line) => <span key={line}>{line}</span>)}</h2>
      <p data-motion-reveal>{content.body}</p>
      <p className="execution-claim__ai" data-motion-reveal>{content.aiPosition}</p>
    </section>
  );
}
```

`BuildMethod` must render one `<article data-method-stage={stage.id}>` per stage, place `id="capabilities"` on the section, and render `<FormationTrace content={education} />` inside it. `FormationTrace` must place `id="education"` on its semantic wrapper and render the existing two-item ordered list unchanged.

Between the stage grid and `FormationTrace`, render one decorative `<svg aria-hidden="true">` with exactly three `<path data-method-connector>` children. Give each path a stable `d` attribute in CSS-independent viewBox coordinates so the motion contract does not depend on layout-generated SVG.

Add `data-motion-reveal` to each method-stage article, verdict heading/action group, experiment article, and project-case article. These are the only generic compact entrance targets.

`ProofVerdict` must place `id="contact"`, `data-scene="verdict"`, and `data-motion-heading`; render the existing `ExternalAction` behavior for email and GitHub; and use `content.verdict` rather than the deprecated exit model.

`EvidenceLens` is a pure decorative component:

```tsx
export function EvidenceLens(): React.JSX.Element {
  return <div className="evidence-lens" data-evidence-lens aria-hidden="true" />;
}
```

- [ ] **Step 4: Compose the new page shell and navigation**

`ExperienceHeader` must preserve the skip link, five anchor destinations, reciprocal locale link, and a six-step decorative progress meter:

```tsx
<div className="experience-progress" aria-label={progressLabel}>
  <span data-progress-value>01</span><span aria-hidden="true"> / 06</span>
</div>
```

Replace `PortfolioPage` with the following composition, leaving the project and experiment components imported from their current paths until Task 3 replaces them:

```tsx
<div className="portfolio-shell" data-motion-root data-motion-state="static">
  <ExperienceHeader content={content} />
  <main id="main-content">
    <ProofIntro content={content.intro} />
    <ExecutionClaim content={content.claim} />
    <BuildMethod method={content.method} education={content.education} />
    <ProjectEvidence {...content.projects} pendingLabel={content.system.pendingLink} />
    <RecoveredFiles {...content.experiments} pendingLabel={content.system.pendingLink} />
    <ProofVerdict content={content.verdict} pendingLabel={content.system.pendingLink} />
  </main>
  <EvidenceLens />
</div>
```

Task 3 replaces `RecoveredFiles` with `ExperimentMontage`; keeping the existing component here allows Task 2 to compile independently.

- [ ] **Step 5: Run shell and content tests**

Run: `npm run test:content && npm run build && npm run test:e2e:built -- tests/portfolio-shell.spec.ts --project=desktop-chromium`

Expected: PASS.

- [ ] **Step 6: Commit the semantic shell**

```bash
git add src/components/portfolio/ExperienceHeader.tsx src/components/portfolio/ProofIntro.tsx src/components/portfolio/ExecutionClaim.tsx src/components/portfolio/BuildMethod.tsx src/components/portfolio/FormationTrace.tsx src/components/portfolio/ProofVerdict.tsx src/components/portfolio/EvidenceLens.tsx src/components/portfolio/PortfolioPage.tsx tests/portfolio-shell.spec.ts
git commit -m "feat: build proof execution narrative shell"
```

### Task 3: Rebuild project evidence and experiment montage

**Files:**
- Create: `src/components/portfolio/ProjectCaseScene.tsx`
- Modify: `src/components/portfolio/ProjectEvidence.tsx`
- Create: `src/components/portfolio/ExperimentMontage.tsx`
- Modify: `tests/projects.spec.ts`
- Delete after passing tests: `src/components/portfolio/RecoveredFiles.tsx`

**Interfaces:**
- Consumes: `PrimaryProject`, `Experiment`, `ExternalAction`, and the exhaustive preview registry.
- Produces: `data-project-stage`, `data-project-case`, `data-project-preview`, and `data-experiment-strip` contracts.

- [ ] **Step 1: Write failing project-stage behavior assertions**

Add to `tests/projects.spec.ts`:

```ts
test("renders each primary project as a motion-ready semantic case", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-project-stage]");
  await expect(stage).toHaveCount(1);
  await expect(stage.locator("[data-project-case]")).toHaveCount(3);
  await expect(stage.locator("[data-project-preview]")).toHaveCount(3);
  await expect(stage.locator("[data-project-case='qgc-planner']")).toContainText("QGC Planner");
  await expect(stage.locator("[data-project-case='borderpass-ai']")).toContainText("BorderPass AI");
  await expect(stage.locator("[data-project-case='ticket-ocr']")).toContainText("Ticket OCR Scanner");
});

test("keeps secondary work in a subordinate montage", async ({ page }) => {
  await page.goto("/");
  const montage = page.locator("[data-experiment-strip]");
  await expect(montage).toHaveCount(1);
  await expect(montage.locator("article")).toHaveCount(3);
});
```

- [ ] **Step 2: Run the focused project tests and confirm failure**

Run: `npm run build && npm run test:e2e:built -- tests/projects.spec.ts --project=desktop-chromium`

Expected: FAIL because the new stage and montage contracts do not exist.

- [ ] **Step 3: Implement `ProjectCaseScene`**

Create a pure server component with this public interface:

```ts
interface ProjectCaseSceneProps {
  readonly project: PrimaryProject;
  readonly pendingLabel: string;
  readonly preview: () => React.JSX.Element;
}
```

Render an `<article data-project-case={project.id}>` containing the heading, summary, technologies, `ExternalAction`, and an inline preview marked `data-project-inline-preview={project.id}` for compact and static layouts. Do not hide semantic case text for animation.

- [ ] **Step 4: Implement the stage and montage**

Keep the existing exhaustive preview mapping:

```ts
const previewByProjectId: Readonly<Record<PrimaryProjectId, () => React.JSX.Element>> = Object.freeze({
  "qgc-planner": QgcPreview,
  "borderpass-ai": BorderPassPreview,
  "ticket-ocr": OcrPreview,
});
```

`ProjectEvidence` must render `<section id="projects" data-scene="projects" data-project-stage>`, its heading, a `[data-project-copy-track]` containing three `ProjectCaseScene` children in content order, and one sibling `[data-project-visual-stage]` containing three decorative previews marked `data-project-preview={project.id}`. Mark the shared visual stage `aria-hidden="true"`. CSS shows inline previews in static/compact layouts and the shared stage only in full desktop motion.

`ExperimentMontage` must render `<section data-scene="experiments">` with a child `<div data-experiment-strip>` containing three semantic articles and their existing pending actions.

- [ ] **Step 5: Run project and shell tests**

Run: `npm run build && npm run test:e2e:built -- tests/projects.spec.ts tests/portfolio-shell.spec.ts --project=desktop-chromium`

Expected: PASS.

- [ ] **Step 6: Remove superseded components after verifying no imports**

Run: `rg -n "SessionNavigation|SessionIntro|IdentityTrace|CapabilityAnalysis|RecoveredFiles|EducationLog|SessionExit" src`

Expected: matches only in the superseded files themselves. Delete those seven files with an approved, explicit file operation, then rerun `npm run typecheck` and expect exit 0.

- [ ] **Step 7: Commit evidence components**

```bash
git add src/components/portfolio tests/projects.spec.ts
git commit -m "feat: rebuild portfolio evidence scenes"
```

### Task 4: Establish the static visual system before animation

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/shell.css`
- Modify: `src/styles/sections.css`
- Modify: `src/styles/previews.css`
- Modify: `src/styles/responsive.css`
- Modify: `tests/accessibility.spec.ts`

**Interfaces:**
- Consumes: Task 2 and Task 3 class names and data contracts.
- Produces: complete final-state layout with no reliance on JavaScript.

- [ ] **Step 1: Add failing no-JavaScript and mobile-layout tests**

Add to `tests/accessibility.spec.ts`:

```ts
test("keeps the complete hiring argument available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.locator("[data-method-stage]")).toHaveCount(4);
  await expect(page.locator("[data-project-case]")).toHaveCount(3);
  await expect(page.getByText("CONSTRUIR LO SIGUIENTE.", { exact: true })).toBeVisible();
  await context.close();
});

test("keeps the compact composition inside the mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  const dimensions = await page.locator("body").evaluate((body) => ({
    content: body.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
```

- [ ] **Step 2: Run accessibility tests and confirm final-state layout failure**

Run: `npm run build && npm run test:e2e:built -- tests/accessibility.spec.ts`

Expected: at least one failure because the new sections do not yet have their approved responsive styles.

- [ ] **Step 3: Implement the visual tokens and final-state layout**

Keep the existing palette values and add only these layout tokens in `tokens.css`:

```css
:root {
  --scene-inline: clamp(1rem, 4vw, 4.5rem);
  --scene-block: clamp(5rem, 10vw, 10rem);
  --scene-border: 1px solid var(--color-line);
  --content-max: 96rem;
}
```

Implement static final states with these required layout contracts:

```css
.proof-intro,
.execution-claim,
.build-method,
.project-evidence,
.experiment-montage,
.proof-verdict {
  position: relative;
  min-height: 100svh;
  padding: var(--scene-block) var(--scene-inline);
  overflow: clip;
}

.proof-intro__challenge,
.execution-claim h2,
.build-method > h2,
.proof-verdict h2 {
  font-size: clamp(3.25rem, 10vw, 10rem);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.07em;
  text-transform: uppercase;
}

.build-method {
  background: var(--color-bone);
  color: var(--color-void);
}

.project-evidence__layout {
  display: grid;
  grid-template-columns: minmax(18rem, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 5vw, 6rem);
}

[data-project-case] {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: var(--scene-border);
}

[data-project-visual-stage],
[data-project-inline-preview] {
  aspect-ratio: 16 / 10;
  min-width: 0;
}

[data-project-visual-stage] {
  display: none;
  align-self: start;
  position: relative;
  height: min(70vh, 48rem);
}

@media (min-width: 960px) {
  [data-motion-state="ready"] [data-project-visual-stage] { display: block; }
  [data-motion-state="ready"] [data-project-inline-preview] { display: none; }
}
```

At widths below `960px`, switch project cases, method stages, header navigation, and verdict actions to single-column flow. Do not hide text to make the layout fit.

- [ ] **Step 4: Run browser accessibility and shell tests**

Run: `npm run build && npm run test:e2e:built -- tests/accessibility.spec.ts tests/portfolio-shell.spec.ts tests/projects.spec.ts`

Expected: PASS for desktop and mobile projects.

- [ ] **Step 5: Commit the static redesign**

```bash
git add src/styles tests/accessibility.spec.ts
git commit -m "feat: establish proof execution visual system"
```

### Task 5: Restore GSAP through one scoped client boundary

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/components/motion/MotionExperience.tsx`
- Create: `src/motion/contracts.ts`
- Create: `src/motion/types.ts`
- Create: `src/motion/create-portfolio-motion.ts`
- Modify: `src/components/portfolio/PortfolioPage.tsx`
- Create: `tests/motion-experience.spec.ts`
- Delete after verification: `src/browser/portfolio-effects.ts`

**Interfaces:**
- Produces: `PortfolioExperienceRoot`, `MotionExperience`, `MotionContractError`, `requireElement`, `requireElements`, `MotionConditions`, `SceneCleanup`, and `createPortfolioMotion(root)`.

- [ ] **Step 1: Write a failing enhanced-motion boundary test**

Create `tests/motion-experience.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("enhances the semantic page through one scoped motion boundary", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("[data-motion-root]");
  await expect(root).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator("script[src='/browser/portfolio-effects.js']")).toHaveCount(0);
  await expect(page.locator("[data-scene]")).toHaveCount(6);
});

test("does not emit motion contract errors during initialization", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Run the motion test and confirm failure**

Run: `npm run build && npm run test:e2e:built -- tests/motion-experience.spec.ts --project=desktop-chromium`

Expected: FAIL because the root remains `static` and the standalone script still exists.

- [ ] **Step 3: Install the project dependencies**

Run: `npm install gsap @gsap/react`

Expected: `package.json` contains both dependencies and `package-lock.json` resolves them in the project environment.

- [ ] **Step 4: Implement strict DOM contracts**

Create `src/motion/contracts.ts`:

```ts
export class MotionContractError extends Error {
  public constructor(scene: string, selector: string, route: string) {
    super(`Motion contract failed for scene ${scene} on ${route}: missing ${selector}`);
    this.name = "MotionContractError";
  }
}

export function requireElement<T extends Element>(root: ParentNode, scene: string, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) throw new MotionContractError(scene, selector, window.location.pathname);
  return element;
}

export function requireElements<T extends Element>(root: ParentNode, scene: string, selector: string): readonly T[] {
  const elements = Array.from(root.querySelectorAll<T>(selector));
  if (elements.length === 0) throw new MotionContractError(scene, selector, window.location.pathname);
  return elements;
}
```

Create `src/motion/types.ts`:

```ts
export interface MotionConditions {
  readonly isDesktop: boolean;
  readonly isCompact: boolean;
  readonly reduceMotion: boolean;
  readonly finePointer: boolean;
}

export type SceneCleanup = () => void;
```

- [ ] **Step 5: Implement the client boundary and empty orchestrator**

`MotionExperience` must use `useGSAP` with a root ref passed explicitly from `PortfolioPage`; it must not query the global document for its root.

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

interface MotionExperienceProps { readonly root: RefObject<HTMLDivElement | null>; }

export function MotionExperience({ root }: MotionExperienceProps): null {
  useGSAP(() => {
    const element = root.current;
    if (element === null) throw new Error("MotionExperience could not resolve its root");
    return createPortfolioMotion(element);
  }, { scope: root });
  return null;
}

interface PortfolioExperienceRootProps { readonly children: ReactNode; }

export function PortfolioExperienceRoot({ children }: PortfolioExperienceRootProps): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} className="portfolio-shell" data-motion-root data-motion-state="static">
      {children}
      <MotionExperience root={root} />
    </div>
  );
}
```

Because a server component cannot own the required ref, introduce a minimal client `PortfolioExperienceRoot` wrapper in the same file. It receives `children: ReactNode`, owns the `useRef<HTMLDivElement>(null)`, renders the root div, and mounts `MotionExperience` inside it. `PortfolioPage` remains a server component and passes the complete semantic tree as children.

The initial orchestrator sets `data-motion-state` to `ready` for full/compact conditions and `reduced` for reduced motion, creates no timelines yet, and deletes transient data attributes during cleanup:

```ts
export function createPortfolioMotion(root: HTMLElement): () => void {
  const media = gsap.matchMedia();
  media.add({
    isDesktop: "(min-width: 960px)",
    isCompact: "(max-width: 959px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
    finePointer: "(pointer: fine)",
  }, (context) => {
    const conditions = context.conditions as unknown as MotionConditions;
    root.dataset.motionState = conditions.reduceMotion ? "reduced" : "ready";
  }, root);
  return (): void => {
    media.revert();
    delete root.dataset.activeScene;
    delete root.dataset.activeProject;
    root.dataset.motionState = "static";
  };
}
```

- [ ] **Step 6: Remove the obsolete standalone browser entry**

Run: `rg -n "portfolio-effects|build:browser|/browser/" src package.json next.config.ts scripts tests`

Expected before cleanup: matches in `PortfolioPage`, `package.json`, and `src/browser/portfolio-effects.ts`. Remove the script tag, delete the browser source, remove `build:browser` and `predev`, and change `build` to `npm run build:server && next build`. Preserve `build:server`, `start`, and all validation scripts.

- [ ] **Step 7: Run the motion boundary and static fallback tests**

Run: `npm run typecheck && npm run build && npm run test:e2e:built -- tests/motion-experience.spec.ts tests/accessibility.spec.ts`

Expected: PASS.

- [ ] **Step 8: Commit the motion foundation**

```bash
git add package.json package-lock.json src/components/motion/MotionExperience.tsx src/motion src/components/portfolio/PortfolioPage.tsx tests/motion-experience.spec.ts
git commit -m "feat: add scoped gsap motion foundation"
```

### Task 6: Implement desktop scene choreography

**Files:**
- Create: `src/motion/scenes/create-intro-scene.ts`
- Create: `src/motion/scenes/create-execution-claim-scene.ts`
- Create: `src/motion/scenes/create-build-method-scene.ts`
- Create: `src/motion/scenes/create-project-evidence-scene.ts`
- Create: `src/motion/scenes/create-experiment-montage-scene.ts`
- Create: `src/motion/scenes/create-verdict-scene.ts`
- Create: `src/motion/scenes/create-evidence-lens.ts`
- Modify: `src/motion/create-portfolio-motion.ts`
- Modify: `src/styles/motion.css`
- Modify: `tests/motion-experience.spec.ts`

**Interfaces:**
- Each scene function consumes `(root: HTMLElement, conditions: MotionConditions)` and returns `SceneCleanup`.
- The orchestrator creates scenes in document order and calls every cleanup exactly once.

- [ ] **Step 1: Add failing observable scene-state tests**

Append to `tests/motion-experience.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run the scene tests and confirm failure**

Run: `npm run build && npm run test:e2e:built -- tests/motion-experience.spec.ts --project=desktop-chromium`

Expected: FAIL because active scene/project attributes and pins are not created.

- [ ] **Step 3: Implement the intro, claim, and method scenes**

Register plugins once in `create-portfolio-motion.ts`:

```ts
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { gsap } from "gsap";

gsap.registerPlugin(Flip, ScrollTrigger, SplitText);
```

Implement the intro as one pinned timeline with `scrub: 0.6`, animate only children of the pinned section, and use SplitText `autoSplit: true` with line masks for the challenge. The claim scene captures a Flip state for `[data-claim-fragment]`, applies its assembled CSS class, and animates from the captured state. The method scene pins `[data-scene='method']`, sequences four `[data-method-stage]` elements, and draws SVG connectors through `strokeDashoffset`.

Every scene creates a separate top-level ScrollTrigger that sets `root.dataset.activeScene` on enter and enter-back. Do not place ScrollTrigger on child tweens inside a timeline.

Implement the claim as a discrete Flip transition:

```ts
export function createExecutionClaimScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "claim";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='claim']");
  const fragments = requireElements<HTMLElement>(section, scene, "[data-claim-fragment]");
  let animation: gsap.core.Timeline | null = null;
  const activate = (): void => {
    if (animation !== null) return;
    const state = Flip.getState(fragments);
    section.dataset.claimAssembled = "true";
    animation = Flip.from(state, { duration: 0.9, ease: "power3.inOut", stagger: 0.06 });
    root.dataset.activeScene = scene;
  };
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top 65%",
    once: true,
    onEnter: activate,
  });
  return (): void => {
    trigger.kill();
    animation?.kill();
    delete section.dataset.claimAssembled;
  };
}
```

Use this scene shape for the intro:

```ts
export function createIntroScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "intro";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='intro']");
  const heading = requireElement<HTMLElement>(section, scene, "[data-motion-heading]");
  const evidenceWindow = requireElement<HTMLElement>(section, scene, "[data-intro-window]");
  const scan = requireElement<HTMLElement>(section, scene, "[data-intro-scan]");
  let activeTimeline: gsap.core.Timeline | null = null;

  const split = SplitText.create(heading, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(instance) {
      activeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: conditions.isDesktop,
          scrub: 0.6,
          onEnter: () => { root.dataset.activeScene = scene; },
          onEnterBack: () => { root.dataset.activeScene = scene; },
        },
      })
        .from(instance.lines, { yPercent: 110, autoAlpha: 0, stagger: 0.08 })
        .from(evidenceWindow, { xPercent: 22, rotation: 4, autoAlpha: 0 }, "<")
        .fromTo(scan, { yPercent: -100 }, { yPercent: 700, ease: "none" }, 0);
      return activeTimeline;
    },
  });

  return (): void => {
    activeTimeline?.scrollTrigger?.kill();
    activeTimeline?.kill();
    split.revert();
  };
}
```

Use one top-level method timeline:

```ts
export function createBuildMethodScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "method";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='method']");
  const stages = requireElements<HTMLElement>(section, scene, "[data-method-stage]");
  const connectors = Array.from(section.querySelectorAll<SVGPathElement>("[data-method-connector]"));
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: conditions.isDesktop,
      scrub: 0.7,
      onEnter: () => { root.dataset.activeScene = scene; },
      onEnterBack: () => { root.dataset.activeScene = scene; },
    },
  });

  timeline
    .from(stages, { yPercent: 24, rotation: (index: number) => index % 2 === 0 ? -3 : 3, autoAlpha: 0, stagger: 0.16 })
    .fromTo(connectors, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.08 }, 0.2);

  return (): void => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
```

- [ ] **Step 4: Implement project evidence, experiment montage, and verdict scenes**

The project scene creates one desktop stage timeline and one ScrollTrigger per semantic case for active-project state. It must not reparent or hide the semantic articles. Preview layers may translate and crossfade with `autoAlpha`; the corresponding text remains in document flow.

The experiment scene translates `[data-experiment-strip]` only on desktop and does not pin. The verdict scene performs a short non-scrubbed reveal and leaves actions interactive throughout.

`createEvidenceLens` adds pointer listeners only when `finePointer && !reduceMotion`, moves the lens with `x` and `y` through `gsap.quickTo`, and removes all listeners in its cleanup.

The project implementation must pin only the decorative visual stage. Semantic case articles remain in normal document flow:

```ts
export function createProjectEvidenceScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "projects";
  const section = requireElement<HTMLElement>(root, scene, "[data-project-stage]");
  const cases = requireElements<HTMLElement>(section, scene, "[data-project-case]");
  const visualStage = requireElement<HTMLElement>(section, scene, "[data-project-visual-stage]");
  const previews = requireElements<HTMLElement>(visualStage, scene, "[data-project-preview]");
  const pin = ScrollTrigger.create({
    trigger: section,
    endTrigger: cases[cases.length - 1],
    start: "top top",
    end: "bottom bottom",
    pin: visualStage,
    pinSpacing: false,
    onEnter: () => { root.dataset.activeScene = scene; },
    onEnterBack: () => { root.dataset.activeScene = scene; },
  });

  gsap.set(previews, { autoAlpha: 0 });
  gsap.set(previews[0], { autoAlpha: 1 });
  const caseTriggers = cases.map((projectCase, index) => {
    const projectId = projectCase.dataset.projectCase;
    if (projectId === undefined) throw new MotionContractError(scene, "data-project-case value", window.location.pathname);
    const activate = (): void => {
      root.dataset.activeProject = projectId;
      gsap.to(previews, { autoAlpha: (previewIndex: number) => previewIndex === index ? 1 : 0, duration: 0.45, overwrite: "auto" });
    };
    return ScrollTrigger.create({
      trigger: projectCase,
      start: "top center",
      end: "bottom center",
      onEnter: activate,
      onEnterBack: activate,
    });
  });

  return (): void => {
    pin.kill();
    caseTriggers.forEach((trigger) => trigger.kill());
    gsap.set(previews, { clearProps: "all" });
  };
}
```

The pointer cleanup must be explicit:

```ts
export function createEvidenceLens(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  if (!conditions.finePointer || conditions.reduceMotion) return (): void => undefined;
  const lens = requireElement<HTMLElement>(root, "evidence-lens", "[data-evidence-lens]");
  const previews = requireElements<HTMLElement>(root, "evidence-lens", "[data-project-preview]");
  const moveX = gsap.quickTo(lens, "x", { duration: 0.2, ease: "power2.out" });
  const moveY = gsap.quickTo(lens, "y", { duration: 0.2, ease: "power2.out" });
  const onMove = (event: PointerEvent): void => { moveX(event.clientX); moveY(event.clientY); };
  const onEnter = (): void => { lens.dataset.active = "true"; };
  const onLeave = (): void => { delete lens.dataset.active; };
  root.addEventListener("pointermove", onMove, { passive: true });
  previews.forEach((preview) => {
    preview.addEventListener("pointerenter", onEnter);
    preview.addEventListener("pointerleave", onLeave);
  });
  return (): void => {
    root.removeEventListener("pointermove", onMove);
    previews.forEach((preview) => {
      preview.removeEventListener("pointerenter", onEnter);
      preview.removeEventListener("pointerleave", onLeave);
    });
  };
}
```

Use these non-pinned factories for the final two scenes:

```ts
export function createExperimentMontageScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "experiments";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='experiments']");
  if (!conditions.isDesktop) return (): void => undefined;
  const strip = requireElement<HTMLElement>(section, scene, "[data-experiment-strip]");
  const tween = gsap.to(strip, {
    x: () => Math.min(0, window.innerWidth - strip.scrollWidth - 64),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top 78%",
      end: "bottom 25%",
      scrub: 0.5,
      onEnter: () => { root.dataset.activeScene = scene; },
      onEnterBack: () => { root.dataset.activeScene = scene; },
    },
  });
  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function createVerdictScene(root: HTMLElement, conditions: MotionConditions): SceneCleanup {
  const scene = "verdict";
  const section = requireElement<HTMLElement>(root, scene, "[data-scene='verdict']");
  const heading = requireElement<HTMLElement>(section, scene, "[data-motion-heading]");
  const tween = gsap.from(heading.children, {
    yPercent: conditions.isDesktop ? 110 : 40,
    autoAlpha: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => { root.dataset.activeScene = scene; },
    },
  });
  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
```

- [ ] **Step 5: Orchestrate responsive conditions and cleanup**

Use this exact condition map:

```ts
media.add({
  isDesktop: "(min-width: 960px)",
  isCompact: "(max-width: 959px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
  finePointer: "(pointer: fine)",
}, (context) => {
  const conditions = context.conditions as unknown as MotionConditions;
  root.dataset.motionState = conditions.reduceMotion ? "reduced" : "ready";
  if (conditions.reduceMotion) return;
  const cleanups = [
    createIntroScene(root, conditions),
    createExecutionClaimScene(root, conditions),
    createBuildMethodScene(root, conditions),
    createProjectEvidenceScene(root, conditions),
    createExperimentMontageScene(root, conditions),
    createVerdictScene(root, conditions),
    createEvidenceLens(root, conditions),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}, root);
```

The outer cleanup calls `media.revert()`, deletes `activeScene`, deletes `activeProject`, and restores `motionState` to `static`.

- [ ] **Step 6: Run motion and project tests**

Run: `npm run build && npm run test:e2e:built -- tests/motion-experience.spec.ts tests/projects.spec.ts --project=desktop-chromium`

Expected: PASS.

- [ ] **Step 7: Commit desktop choreography**

```bash
git add src/motion src/styles/motion.css tests/motion-experience.spec.ts
git commit -m "feat: choreograph proof execution scenes"
```

### Task 7: Enforce compact, reduced-motion, keyboard, and axe behavior

**Files:**
- Modify: `src/motion/scenes/create-intro-scene.ts`
- Modify: `src/motion/scenes/create-build-method-scene.ts`
- Modify: `src/motion/scenes/create-project-evidence-scene.ts`
- Modify: `src/styles/responsive.css`
- Modify: `src/styles/motion.css`
- Modify: `tests/accessibility.spec.ts`
- Modify: `tests/motion-experience.spec.ts`

**Interfaces:**
- Consumes: `MotionConditions` from Task 5.
- Produces: zero pin spacers in compact and reduced-motion modes, stable final content, keyboard-safe navigation, and hidden decorative layers.

- [ ] **Step 1: Add failing compact and reduced-motion assertions**

Add to `tests/motion-experience.spec.ts`:

```ts
test("does not pin the compact experience", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Compact-only assertion");
  await page.goto("/");
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
```

- [ ] **Step 2: Run compact and reduced tests and confirm failure**

Run: `npm run build && npm run test:e2e:built -- tests/motion-experience.spec.ts`

Expected: FAIL until compact scene factories avoid all pin configuration and the lens contract is rendered but hidden.

- [ ] **Step 3: Implement explicit compact branches**

In intro, method, and project scene factories, return non-pinned entrance timelines when `conditions.isCompact` is true. Do not pass `pin`, `pinSpacing`, or desktop project-stage transforms in the compact branch. Render all project previews with their corresponding articles.

Use an early branch with a top-level, non-pinned tween:

```ts
if (conditions.isCompact) {
  const tween = gsap.from(section.querySelectorAll<HTMLElement>("[data-motion-reveal]"), {
    y: 24,
    autoAlpha: 0,
    stagger: 0.08,
    scrollTrigger: {
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => { root.dataset.activeScene = scene; },
    },
  });
  return (): void => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
```

In CSS, keep `[data-evidence-lens] { display: none; }` by default and enable it only inside `@media (pointer: fine) and (prefers-reduced-motion: no-preference)`.

- [ ] **Step 4: Update keyboard and axe tests for the new narrative**

Preserve the existing skip-link test but change its expected destination to `#main-content`. Add axe checks after scrolling to `[data-scene='method']`, `[data-project-case='borderpass-ai']`, and `[data-scene='verdict']`. Assert no violations after each scroll.

- [ ] **Step 5: Run accessibility, compact, and reduced-motion coverage**

Run: `npm run build && npm run test:e2e:built -- tests/accessibility.spec.ts tests/motion-experience.spec.ts`

Expected: PASS in desktop and mobile projects.

- [ ] **Step 6: Commit adaptive motion behavior**

```bash
git add src/motion src/styles/responsive.css src/styles/motion.css tests/accessibility.spec.ts tests/motion-experience.spec.ts
git commit -m "feat: adapt cinematic motion for access and mobile"
```

### Task 8: Run full validation and close integration gaps

**Files:**
- Verify only: `lighthouserc.cjs`, `package.json`, all source and tests.
- A validation failure returns to the task that owns the failing file; Task 8 does not collect unrelated corrections.

**Interfaces:**
- Consumes: completed Tasks 1–7.
- Produces: a release-ready static bilingual portfolio satisfying the spec acceptance criteria.

- [ ] **Step 1: Run repository-wide static validation**

Run: `npm run validate:content && npm run test:content && npm run lint && npm run typecheck`

Expected: all commands exit 0 with no warnings promoted to errors.

- [ ] **Step 2: Run the production build and complete Playwright suite**

Run: `npm run build && npm run test:e2e:built`

Expected: all desktop and mobile Playwright tests pass with zero failures.

- [ ] **Step 3: Run Lighthouse budgets**

Run: `npm run audit:performance`

Expected: `/` and `/en` both satisfy LCP ≤ 2500 ms and CLS ≤ 0.1 across the configured two-run pessimistic aggregation.

- [ ] **Step 4: Inspect the final browser experience at representative widths**

Run the production server and inspect `1440×900`, `1024×768`, and `412×915`. Confirm:

- Name, role, and challenge are visible in the opening viewport.
- Exactly four method stages are readable.
- Three project cases remain factual and ordered.
- No more than three desktop pins exist.
- Mobile has no horizontal page overflow and no pin spacers.
- Reduced motion and JavaScript-disabled flows expose all content.
- Locale switch and every direct anchor work.
- Pending destinations remain disabled.

- [ ] **Step 5: Review the final diff for scope and stale runtime artifacts**

Run:

```bash
rg -n "UNKNOWN_SESSION|SESIÓN_DESCONOCIDA|portfolio-effects|build:browser|data-forensic-cursor" src package.json tests
git --no-pager diff --check
git status --short
```

Expected: the search returns no obsolete narrative/runtime contracts; `diff --check` returns no output; status contains only intended feature files.

- [ ] **Step 6: Confirm validation did not create uncommitted feature changes**

Run: `git status --short`

Expected: no new or modified feature files beyond the pre-existing user-owned baseline. If a validation correction was required, complete the failing task's implementation, verification, and exact-path commit steps before returning to Task 8 Step 1.

- [ ] **Step 7: Request code review before integration**

Invoke `superpowers:requesting-code-review` with the approved design specification, this plan, the full diff, and fresh validation output. Resolve only verified findings, rerun the affected command, and keep unrelated worktree changes untouched.
