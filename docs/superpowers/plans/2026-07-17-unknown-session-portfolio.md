# UNKNOWN_SESSION Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Miquel Manzano's bilingual UNKNOWN_SESSION portfolio as a statically rendered, accessible Next.js experience with a continuous GSAP-driven dark punk narrative.

**Architecture:** Two route-group root layouts render `/` in Spanish and `/en` in English with correct document languages and localized metadata. Strictly typed local content feeds focused server components; one client motion boundary owns GSAP, ScrollTrigger, and the optional forensic cursor. Playwright validates real desktop, mobile, bilingual, keyboard, reduced-motion, and pending-link behavior.

**Tech Stack:** Node.js 24, npm 11, Next.js App Router, React, strict TypeScript, GSAP 3.13 or newer, `@gsap/react`, Fontsource variable fonts, CSS, Playwright, and axe-core for browser accessibility checks.

## Global Constraints

- Support Node.js 20.9 or newer; the verified local runtime is Node.js 24.13.0 and npm 11.6.2.
- Serve Spanish at `/` and English at `/en`; both routes must be statically rendered and include reciprocal language metadata.
- Keep all portfolio content in immutable, strictly typed local TypeScript data.
- Treat cybersecurity as narrative vocabulary, never as an unverified professional specialization.
- Present AI as an accelerator for complex work, never as a substitute for Miquel's independent technical foundation.
- Use deep black, aged bone, oxidized red, and restrained terminal accents; do not use generic neon-green hacker styling.
- Keep the page semantically complete before JavaScript and layer motion over existing content.
- On mobile, retain the identity while reducing depth, distortion, noise, and simultaneous motion.
- Honor `prefers-reduced-motion` by rendering stable final states without nonessential animation.
- Initial project repositories, email, and general GitHub destinations have the explicit `pending` state and must not render active anchors.
- Do not invent project metrics, implementation details, technical decisions, or contribution claims.
- Do not add a backend, database, analytics service, contact form, CMS, WebGL, or Three.js.
- Use functional components and pure data functions; do not mutate props, content objects, or global state.
- Keep imports at the top, use explicit return types, and do not introduce functions with default parameter values.

---

## File Structure

### Project and tooling

- `package.json` — scripts and pinned dependency ranges written by npm.
- `package-lock.json` — reproducible dependency graph.
- `next.config.ts` — strict Next.js runtime configuration.
- `tsconfig.json` — strict TypeScript and Next.js path alias configuration.
- `eslint.config.mjs` — Next.js Core Web Vitals and TypeScript lint rules.
- `playwright.config.ts` — desktop and mobile browser projects with a local web server.
- `lighthouserc.cjs` — production mobile performance assertions for both languages.
- `src/globals.d.ts` — Fontsource CSS module declarations.

### Routes

- `src/app/globals.css` — imports the focused global style sheets.
- `src/app/(es)/layout.tsx` — Spanish root document and metadata.
- `src/app/(es)/page.tsx` — Spanish static page composition.
- `src/app/(en)/en/layout.tsx` — English root document and metadata.
- `src/app/(en)/en/page.tsx` — English static page composition.

### Content and validation

- `src/content/types.ts` — shared readonly content contracts and destination union.
- `src/content/destinations.ts` — all pending or published external destinations.
- `src/content/portfolio.es.ts` — confirmed Spanish copy and project data.
- `src/content/portfolio.en.ts` — equivalent English copy and project data.
- `src/content/index.ts` — typed locale lookup and pair validation.
- `src/lib/content-validation.ts` — pure validation functions for URLs, identifiers, and bilingual parity.
- `scripts/validate-content.ts` — build-facing content validation entry point.

### Portfolio components

- `src/components/portfolio/PortfolioPage.tsx` — composes the full semantic story.
- `src/components/portfolio/SessionNavigation.tsx` — skip link, anchors, status, and language switch.
- `src/components/portfolio/SessionIntro.tsx` — name, positioning, and availability statement.
- `src/components/portfolio/IdentityTrace.tsx` — profile, AI position, and working method.
- `src/components/portfolio/CapabilityAnalysis.tsx` — technical foundation and engineering capabilities.
- `src/components/portfolio/ProjectEvidence.tsx` — three primary project case studies.
- `src/components/portfolio/RecoveredFiles.tsx` — three secondary experiments.
- `src/components/portfolio/EducationLog.tsx` — SMX-to-DAW progression.
- `src/components/portfolio/SessionExit.tsx` — availability statement and contact destinations.
- `src/components/portfolio/ExternalAction.tsx` — published link or explicit pending state.

### Project previews

- `src/components/previews/QgcPreview.tsx` — mission map and MAVLink status visual.
- `src/components/previews/BorderPassPreview.tsx` — CBAM document and decision-flow visual.
- `src/components/previews/OcrPreview.tsx` — ticket scan and structured-output visual.

### Motion

- `src/components/motion/MotionController.tsx` — client boundary and lifecycle cleanup.
- `src/components/motion/ForensicCursor.tsx` — fine-pointer visual probe.
- `src/motion/create-portfolio-motion.ts` — GSAP and ScrollTrigger timeline factory.

### Styles

- `src/styles/tokens.css` — colors, fonts, spacing, borders, and motion variables.
- `src/styles/base.css` — reset, document behavior, focus, and typography.
- `src/styles/shell.css` — fixed navigation, section framing, and shared UI.
- `src/styles/sections.css` — narrative section compositions.
- `src/styles/previews.css` — the three HTML/CSS project previews.
- `src/styles/motion.css` — enhanced-state and forensic-cursor styling.
- `src/styles/responsive.css` — tablet, mobile, pointer, and reduced-motion rules.

### Browser tests

- `tests/portfolio-shell.spec.ts` — routes, language metadata, navigation, and core content.
- `tests/projects.spec.ts` — primary projects, experiments, previews, and pending destinations.
- `tests/accessibility.spec.ts` — keyboard, reduced motion, mobile, and axe checks.

---

### Task 1: Bootstrap the strict Next.js application and browser toolchain

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `playwright.config.ts`
- Create: `lighthouserc.cjs`
- Create: `src/globals.d.ts`
- Create: `src/app/globals.css`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/app/(es)/layout.tsx`
- Create: `src/app/(es)/page.tsx`
- Create: `src/app/(en)/en/layout.tsx`
- Create: `src/app/(en)/en/page.tsx`

**Interfaces:**
- Consumes: Node.js 20.9 or newer and npm.
- Produces: `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, and the `@/*` import alias.

- [ ] **Step 1: Create the package manifest and install runtime dependencies**

Run:

```powershell
npm init --yes
npm install next@latest react@latest react-dom@latest gsap@^3.13.0 @gsap/react @fontsource-variable/archivo @fontsource-variable/jetbrains-mono
npm install --save-dev typescript @types/node @types/react @types/react-dom eslint eslint-config-next @playwright/test @axe-core/playwright @lhci/cli tsx
```

Expected: npm creates `package-lock.json`, reports zero unresolved dependency errors, and installs GSAP 3.13 or newer.

- [ ] **Step 2: Replace package scripts with the exact validation surface**

Set the package name to `unknown-session-portfolio`, mark it private, and set these scripts in `package.json` without changing the installed dependency versions:

```json
{
  "name": "unknown-session-portfolio",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test",
    "validate": "npm run lint && npm run typecheck && npm run build"
  }
}
```

The final file must retain the exact `dependencies` and `devDependencies` npm wrote in Step 1.

- [ ] **Step 3: Add strict framework configuration**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "out/**", "coverage/**", "playwright-report/**", "test-results/**"]),
]);

export default eslintConfig;
```

Create `src/globals.d.ts`:

```ts
declare module "*.css";
declare module "@fontsource-variable/*";
```

- [ ] **Step 4: Configure Playwright desktop and mobile projects**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    colorScheme: "dark",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:3000",
  },
});
```

Create `lighthouserc.cjs`:

```js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 120000,
      url: ["http://127.0.0.1:3000/", "http://127.0.0.1:3000/en"],
    },
    assert: {
      assertions: {
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "pessimistic" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "pessimistic" }],
      },
    },
    upload: {
      outputDir: "./.lighthouseci",
      target: "filesystem",
    },
  },
};
```

- [ ] **Step 5: Create minimal independent Spanish and English root layouts**

Create `src/app/globals.css`:

```css
@import "../styles/tokens.css";
@import "../styles/base.css";
```

Create `src/app/(es)/layout.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "Miquel Manzano — Full-stack developer",
  description: "Portfolio técnico de Miquel Manzano.",
};

interface SpanishLayoutProps {
  readonly children: ReactNode;
}

export default function SpanishLayout({ children }: SpanishLayoutProps): React.JSX.Element {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/(en)/en/layout.tsx` with the same imports adjusted to `../../globals.css`, `lang="en"`, title `Miquel Manzano — Full-stack developer`, and description `Technical portfolio of Miquel Manzano.`.

Create `src/app/(es)/page.tsx`:

```tsx
export default function SpanishPage(): React.JSX.Element {
  return <main><h1>Miquel Manzano</h1></main>;
}
```

Create `src/app/(en)/en/page.tsx`:

```tsx
export default function EnglishPage(): React.JSX.Element {
  return <main><h1>Miquel Manzano</h1></main>;
}
```

- [ ] **Step 6: Add the initial token and base style files**

Create `src/styles/tokens.css`:

```css
:root {
  --color-void: #030303;
  --color-panel: #090807;
  --color-bone: #eee8de;
  --color-muted: #948b83;
  --color-line: #39322e;
  --color-alert: #e7342b;
  --color-alert-dark: #230a08;
  --font-display: "Archivo Variable", Arial, sans-serif;
  --font-code: "JetBrains Mono Variable", Consolas, monospace;
  --page-inline: clamp(1rem, 3vw, 3rem);
  --focus-ring: 0 0 0 3px var(--color-bone), 0 0 0 6px var(--color-alert);
}
```

Create `src/styles/base.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--color-void);
  color: var(--color-bone);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--color-void);
  font-family: var(--font-display);
}

a,
button {
  color: inherit;
}

:focus-visible {
  border-radius: 2px;
  outline: 0;
  box-shadow: var(--focus-ring);
}
```

- [ ] **Step 7: Verify the baseline framework**

Run:

```powershell
npm run lint
npm run typecheck
npm run build
```

Expected: lint, typecheck, and build all pass; Next.js reports static `/` and `/en` routes.

- [ ] **Step 8: Commit the bootstrapped application**

```powershell
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs playwright.config.ts lighthouserc.cjs src
git commit -m "chore: bootstrap strict Next.js portfolio"
```

---

### Task 2: Define and validate immutable bilingual portfolio content

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/destinations.ts`
- Create: `src/content/portfolio.es.ts`
- Create: `src/content/portfolio.en.ts`
- Create: `src/content/index.ts`
- Create: `src/lib/content-validation.ts`
- Create: `scripts/validate-content.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: the `@/*` alias and `tsx` script runner from Task 1.
- Produces: `Locale`, `PortfolioContent`, `ExternalDestination`, `portfolioByLocale`, `getPortfolioContent(locale: Locale): PortfolioContent`, and `validatePortfolioPair(spanish, english): void`.

- [ ] **Step 1: Define readonly content contracts**

Create `src/content/types.ts` with these exact exported contracts:

```ts
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];
export type PrimaryProjectId = "qgc-planner" | "borderpass-ai" | "ticket-ocr";

export type ExternalDestination =
  | { readonly status: "pending" }
  | { readonly status: "published"; readonly url: string };

export interface NavigationItem {
  readonly label: string;
  readonly target: "profile" | "capabilities" | "projects" | "education" | "contact";
}

export interface CapabilityGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface PrimaryProject {
  readonly id: PrimaryProjectId;
  readonly caseLabel: string;
  readonly name: string;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly repository: ExternalDestination;
}

export interface Experiment {
  readonly id: "web-game" | "roblox-game" | "ai-wrapped";
  readonly name: string;
  readonly category: string;
  readonly repository: ExternalDestination;
}

export interface EducationItem {
  readonly qualification: string;
  readonly abbreviation: "SMX" | "DAW";
  readonly institution: "Institut Bernat el Ferrer";
  readonly startYear: 2022 | 2024;
  readonly endYear: 2024 | 2026;
}

export interface PortfolioContent {
  readonly locale: Locale;
  readonly meta: { readonly title: string; readonly description: string };
  readonly navigation: readonly NavigationItem[];
  readonly system: {
    readonly readOnly: string;
    readonly pendingLink: string;
    readonly languageLabel: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly name: "Miquel Manzano";
    readonly titleLines: readonly [string, string, string];
    readonly availability: string;
    readonly command: string;
  };
  readonly identity: {
    readonly eyebrow: string;
    readonly headingLines: readonly [string, string, string];
    readonly body: string;
    readonly aiPosition: string;
    readonly evidence: readonly [
      { readonly label: string; readonly value: string },
      { readonly label: string; readonly value: string },
      { readonly label: string; readonly value: string },
    ];
  };
  readonly capabilities: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly groups: readonly CapabilityGroup[];
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
  readonly exit: {
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

- [ ] **Step 2: Centralize every external destination in the pending state**

Create `src/content/destinations.ts`:

```ts
import type { ExternalDestination, PrimaryProjectId } from "@/content/types";

const pendingDestination: ExternalDestination = Object.freeze({ status: "pending" });

export const projectRepositories: Readonly<Record<PrimaryProjectId, ExternalDestination>> = Object.freeze({
  "qgc-planner": pendingDestination,
  "borderpass-ai": pendingDestination,
  "ticket-ocr": pendingDestination,
});

export const experimentRepositories: Readonly<Record<"web-game" | "roblox-game" | "ai-wrapped", ExternalDestination>> = Object.freeze({
  "web-game": pendingDestination,
  "roblox-game": pendingDestination,
  "ai-wrapped": pendingDestination,
});

export const contactDestinations: Readonly<{
  email: ExternalDestination;
  github: ExternalDestination;
}> = Object.freeze({
  email: pendingDestination,
  github: pendingDestination,
});
```

- [ ] **Step 3: Add complete confirmed Spanish and English dictionaries**

Create `src/content/portfolio.es.ts` and `src/content/portfolio.en.ts`. Both must satisfy `PortfolioContent`, use identical project and experiment IDs, and contain only confirmed claims. Use the following copy matrix exactly:

| Field | Spanish | English |
|---|---|---|
| Meta title | `Miquel Manzano — Desarrollador full-stack` | `Miquel Manzano — Full-stack developer` |
| Meta description | `Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.` | `Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.` |
| Intro eyebrow | `SESIÓN DESCONOCIDA / ACCESO DE SOLO LECTURA` | `UNKNOWN SESSION / READ-ONLY ACCESS` |
| Intro title | `AÚN / NO / ME CONOCES.` | `YOU DON'T / KNOW / ME YET.` |
| Availability | `Disponible para crear, aprender y llevar ideas hasta producción.` | `Available to create, learn, and take ideas all the way to production.` |
| Identity heading | `Técnico. / Creativo. / Adaptable.` | `Technical. / Creative. / Adaptable.` |
| Identity body | `Desarrollador full-stack formado en sistemas y desarrollo web. Convierto dominios desconocidos en productos funcionales.` | `Full-stack developer trained in systems and web development. I turn unfamiliar domains into working products.` |
| AI position | `Uso la IA como acelerador para abordar mayor complejidad, apoyándome en una base técnica que puedo aplicar de forma autónoma.` | `I use AI as an accelerator for greater complexity, supported by a technical foundation I can apply independently.` |
| Capabilities heading | `INSPECCIONA LA LÓGICA REAL.` | `INSPECT THE ACTUAL LOGIC.` |
| Projects heading | `EVIDENCIA RECUPERADA` | `RECOVERED EVIDENCE` |
| Experiments heading | `ARCHIVOS SECUNDARIOS` | `SECONDARY FILES` |
| Education heading | `REGISTRO DE FORMACIÓN` | `EDUCATION LOG` |
| Exit heading | `SESIÓN COMPLETA. / CONSTRUYAMOS.` | `SESSION COMPLETE. / LET'S BUILD.` |

Use these exact navigation and system records:

```ts
const spanishNavigation = [
  { label: "Perfil", target: "profile" },
  { label: "Capacidades", target: "capabilities" },
  { label: "Proyectos", target: "projects" },
  { label: "Formación", target: "education" },
  { label: "Contacto", target: "contact" },
] as const;

const englishNavigation = [
  { label: "Profile", target: "profile" },
  { label: "Capabilities", target: "capabilities" },
  { label: "Projects", target: "projects" },
  { label: "Education", target: "education" },
  { label: "Contact", target: "contact" },
] as const;

const spanishSystem = {
  readOnly: "SESIÓN_DESCONOCIDA / SOLO_LECTURA",
  pendingLink: "ENLACE_PENDIENTE",
  languageLabel: "Cambiar idioma",
} as const;

const englishSystem = {
  readOnly: "UNKNOWN_SESSION / READ_ONLY",
  pendingLink: "LINK_PENDING",
  languageLabel: "Change language",
} as const;
```

Use this exact identity evidence:

```ts
const spanishEvidence = [
  { label: "FORMACIÓN", value: "SISTEMAS + DESARROLLO WEB" },
  { label: "MÉTODO", value: "CONSTRUIR → PROBAR → APRENDER" },
  { label: "ESTADO", value: "DISPONIBLE" },
] as const;

const englishEvidence = [
  { label: "FOUNDATION", value: "SYSTEMS + WEB DEVELOPMENT" },
  { label: "METHOD", value: "BUILD → TEST → LEARN" },
  { label: "STATUS", value: "AVAILABLE" },
] as const;
```

Use these exact remaining localized fields:

| Content field | Spanish | English |
|---|---|---|
| Intro command | `visitor@portfolio:~$ whoami --verify` | `visitor@portfolio:~$ whoami --verify` |
| Identity eyebrow | `RECONSTRUCCIÓN DE IDENTIDAD / 34%` | `IDENTITY RECONSTRUCTION / 34%` |
| Capabilities eyebrow | `ANÁLISIS DE FUENTE / SIN BARRAS DE HABILIDAD` | `SOURCE ANALYSIS / NO SKILL BARS` |
| Projects eyebrow | `EXPEDIENTES PRINCIPALES / 03` | `PRIMARY CASE FILES / 03` |
| Experiments eyebrow | `ÍNDICE DE EXPERIMENTOS / 03` | `EXPERIMENT INDEX / 03` |
| Education eyebrow | `TRAZA FORMATIVA / 2022—2026` | `EDUCATION TRACE / 2022—2026` |
| Exit eyebrow | `IDENTIDAD VERIFICADA / SESIÓN SEGURA` | `IDENTITY VERIFIED / SESSION SECURE` |
| Email label | `CORREO` | `EMAIL` |
| GitHub label | `GITHUB` | `GITHUB` |

Use these exact English project summaries:

```ts
[
  "Mission planner inspired by Mission Planner.",
  "Assistant for customs professionals and importers working with CBAM controls.",
  "Flutter application that scans tickets and extracts structured information through OCR.",
] as const;
```

Use `Sistemas Microinformáticos y Redes` and `Desarrollo de Aplicaciones Web` as Spanish qualifications. Use `Microcomputer Systems and Networks` and `Web Application Development` as their English qualifications. Both dictionaries keep abbreviations `SMX` and `DAW` and institution `Institut Bernat el Ferrer`.

Set `intro.name` to `Miquel Manzano` in both dictionaries. Reuse the localized availability statement in `exit.availability`. Set `exit.email` and `exit.github` from `contactDestinations`, primary repositories from `projectRepositories`, and experiment repositories from `experimentRepositories`.

The capability groups must contain these exact arrays in both languages, translating only group titles:

```ts
[
  {
    title: "Lenguajes y producto",
    items: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "PHP", "MySQL", "Java", "Python", "Flutter"],
  },
  {
    title: "Aplicaciones y datos",
    items: ["REST APIs", "HTTP", "JSON", "SQL", "Relational modeling", "Authentication", "Sessions", "User management", "CRUD"],
  },
  {
    title: "Herramientas y arquitectura",
    items: ["Git", "GitHub", "Linux", "Terminal", "Web deployment", "Docker", "MVC", "Object-oriented programming", "Responsive design", "Web accessibility"],
  },
]
```

The Spanish titles are `Lenguajes y producto`, `Aplicaciones y datos`, and `Herramientas y arquitectura`. The English titles are `Languages and product`, `Applications and data`, and `Tools and architecture`.

Use these project records in both dictionaries with localized summaries:

```ts
[
  {
    id: "qgc-planner",
    caseLabel: "CASE_01",
    name: "QGC Planner",
    summary: "Planeador de misiones inspirado en Mission Planner.",
    technologies: ["React", "TypeScript", "MAVLink"],
    repository: projectRepositories["qgc-planner"],
  },
  {
    id: "borderpass-ai",
    caseLabel: "CASE_02",
    name: "BorderPass AI",
    summary: "Asistente para profesionales aduaneros e importadores que trabajan con controles CBAM.",
    technologies: ["AI", "CBAM"],
    repository: projectRepositories["borderpass-ai"],
  },
  {
    id: "ticket-ocr",
    caseLabel: "CASE_03",
    name: "Ticket OCR Scanner",
    summary: "Aplicación Flutter que escanea tickets y extrae información estructurada mediante OCR.",
    technologies: ["Flutter", "OCR"],
    repository: projectRepositories["ticket-ocr"],
  },
]
```

Translate the three summaries faithfully in the English dictionary. Use experiment names `Web Game`, `Roblox Game`, and `AI Wrapped`; categories are `Juego web`, `Experiencia Roblox`, `Experimento de IA` in Spanish and `Web game`, `Roblox experience`, `AI experiment` in English. Do not add descriptions.

Use education items for SMX from 2022 to 2024 and DAW from 2024 to 2026 at `Institut Bernat el Ferrer`.

- [ ] **Step 4: Write pure validation functions and the validation runner**

Create `src/lib/content-validation.ts`:

```ts
import type { ExternalDestination, PortfolioContent } from "@/content/types";

function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validateDestination(destination: ExternalDestination, context: string): void {
  if (destination.status === "pending") {
    return;
  }

  assertCondition(URL.canParse(destination.url), `Invalid destination URL for ${context}: ${destination.url}`);
  const parsedUrl = new URL(destination.url);
  assertCondition(
    ["https:", "mailto:"].includes(parsedUrl.protocol),
    `Invalid destination protocol for ${context}: ${destination.url}`,
  );
}

export function validatePortfolioPair(spanish: PortfolioContent, english: PortfolioContent): void {
  assertCondition(spanish.locale === "es", `Expected Spanish locale, received ${spanish.locale}`);
  assertCondition(english.locale === "en", `Expected English locale, received ${english.locale}`);

  const spanishProjectIds = spanish.projects.items.map((project) => project.id).join(",");
  const englishProjectIds = english.projects.items.map((project) => project.id).join(",");
  assertCondition(spanishProjectIds === englishProjectIds, "Project IDs differ between Spanish and English content");

  const spanishExperimentIds = spanish.experiments.items.map((experiment) => experiment.id).join(",");
  const englishExperimentIds = english.experiments.items.map((experiment) => experiment.id).join(",");
  assertCondition(spanishExperimentIds === englishExperimentIds, "Experiment IDs differ between Spanish and English content");

  for (const content of [spanish, english]) {
    assertCondition(content.navigation.length === 5, `Expected five navigation items for ${content.locale}`);
    for (const project of content.projects.items) {
      validateDestination(project.repository, `${content.locale}:${project.id}`);
    }
    for (const experiment of content.experiments.items) {
      validateDestination(experiment.repository, `${content.locale}:${experiment.id}`);
    }
    validateDestination(content.exit.email, `${content.locale}:email`);
    validateDestination(content.exit.github, `${content.locale}:github`);
  }
}
```

Create `scripts/validate-content.ts`:

```ts
import { portfolioEnglish } from "../src/content/portfolio.en";
import { portfolioSpanish } from "../src/content/portfolio.es";
import { validatePortfolioPair } from "../src/lib/content-validation";

validatePortfolioPair(portfolioSpanish, portfolioEnglish);
process.stdout.write("Portfolio content is valid.\n");
```

Add these scripts to `package.json` while preserving all existing dependency versions:

```json
{
  "scripts": {
    "validate:content": "tsx scripts/validate-content.ts",
    "validate": "npm run validate:content && npm run lint && npm run typecheck && npm run build"
  }
}
```

Run `npm run validate:content`.

Expected: `Portfolio content is valid.`

- [ ] **Step 5: Export validated locale lookup and make validation pass**

Create `src/content/index.ts`:

```ts
import { portfolioEnglish } from "@/content/portfolio.en";
import { portfolioSpanish } from "@/content/portfolio.es";
import type { Locale, PortfolioContent } from "@/content/types";
import { validatePortfolioPair } from "@/lib/content-validation";

validatePortfolioPair(portfolioSpanish, portfolioEnglish);

export const portfolioByLocale: Readonly<Record<Locale, PortfolioContent>> = Object.freeze({
  es: portfolioSpanish,
  en: portfolioEnglish,
});

export function getPortfolioContent(locale: Locale): PortfolioContent {
  return portfolioByLocale[locale];
}
```

Run:

```powershell
npm run validate:content
npm run typecheck
```

Expected: `Portfolio content is valid.` and both commands exit 0.

- [ ] **Step 6: Commit the content contract**

```powershell
git add src/content src/lib/content-validation.ts scripts/validate-content.ts package.json package-lock.json
git commit -m "feat: add validated bilingual portfolio content"
```

---

### Task 3: Build the bilingual semantic shell, metadata, and navigation

**Files:**
- Create: `tests/portfolio-shell.spec.ts`
- Create: `src/components/portfolio/PortfolioPage.tsx`
- Create: `src/components/portfolio/SessionNavigation.tsx`
- Create: `src/styles/shell.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/(es)/layout.tsx`
- Modify: `src/app/(es)/page.tsx`
- Modify: `src/app/(en)/en/layout.tsx`
- Modify: `src/app/(en)/en/page.tsx`

**Interfaces:**
- Consumes: `getPortfolioContent(locale: Locale): PortfolioContent`.
- Produces: `PortfolioPage({ content }: { readonly content: PortfolioContent }): React.JSX.Element`, five stable anchor IDs, localized metadata, and language links.

- [ ] **Step 1: Install the Chromium browser used by the smoke suite**

Run:

```powershell
npx playwright install chromium
```

Expected: Playwright reports Chromium installed or already present.

- [ ] **Step 2: Write failing bilingual shell tests**

Create `tests/portfolio-shell.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("serves Spanish as the default semantic document", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).toHaveTitle(/Miquel Manzano/);
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
});

test("serves the English document with reciprocal navigation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
});

test("exposes direct anchors for every narrative destination", async ({ page }) => {
  await page.goto("/");
  for (const id of ["profile", "capabilities", "projects", "education", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});
```

- [ ] **Step 3: Run the shell test and confirm the missing navigation failure**

Run:

```powershell
npm run test:e2e -- tests/portfolio-shell.spec.ts --project=desktop-chromium
```

Expected: FAIL because the minimal pages have no localized navigation or anchor structure.

- [ ] **Step 4: Implement the semantic page shell and navigation**

Create `src/components/portfolio/SessionNavigation.tsx`:

```tsx
import Link from "next/link";
import type { Locale, NavigationItem } from "@/content/types";

interface SessionNavigationProps {
  readonly locale: Locale;
  readonly items: readonly NavigationItem[];
  readonly languageLabel: string;
  readonly readOnlyLabel: string;
}

export function SessionNavigation({ locale, items, languageLabel, readOnlyLabel }: SessionNavigationProps): React.JSX.Element {
  const navigationLabel = locale === "es" ? "Navegación principal" : "Main navigation";
  const skipLabel = locale === "es" ? "Saltar al contenido" : "Skip to content";
  const targetLocale = locale === "es" ? "en" : "es";
  const targetHref = locale === "es" ? "/en" : "/";
  const targetLabel = locale === "es" ? "English" : "Español";

  return (
    <>
      <a className="skip-link" href="#profile">{skipLabel}</a>
      <header className="session-nav">
        <span className="session-nav__status" aria-hidden="true">{readOnlyLabel}</span>
        <nav aria-label={navigationLabel}>
          <ul className="session-nav__list">
            {items.map((item) => (
              <li key={item.target}>
                <a href={`#${item.target}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="session-nav__language" href={targetHref} hrefLang={targetLocale} lang={targetLocale}>
          <span className="sr-only">{languageLabel}: </span>{targetLabel}
        </Link>
      </header>
    </>
  );
}
```

Create `src/components/portfolio/PortfolioPage.tsx` initially as:

```tsx
import type { PortfolioContent } from "@/content/types";
import { SessionNavigation } from "@/components/portfolio/SessionNavigation";

interface PortfolioPageProps {
  readonly content: PortfolioContent;
}

export function PortfolioPage({ content }: PortfolioPageProps): React.JSX.Element {
  return (
    <div className="portfolio-shell">
      <SessionNavigation
        locale={content.locale}
        items={content.navigation}
        languageLabel={content.system.languageLabel}
        readOnlyLabel={content.system.readOnly}
      />
      <main>
        <section id="profile" className="narrative-section">
          <h1>Miquel Manzano</h1>
          <p>{content.intro.availability}</p>
        </section>
        <section id="capabilities" className="narrative-section" aria-label={content.capabilities.heading} />
        <section id="projects" className="narrative-section" aria-label={content.projects.heading} />
        <section id="education" className="narrative-section" aria-label={content.education.heading} />
        <section id="contact" className="narrative-section" aria-label={content.exit.headingLines.join(" ")} />
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Wire localized routes and reciprocal metadata**

Update both page files to call `getPortfolioContent("es")` or `getPortfolioContent("en")` and render `PortfolioPage`.

Update the Spanish layout metadata to:

```ts
export const metadata: Metadata = {
  title: "Miquel Manzano — Desarrollador full-stack",
  description: "Portfolio técnico de Miquel Manzano: desarrollo web, aplicaciones, IA aplicada y proyectos interactivos.",
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
};
```

Update the English layout metadata to:

```ts
export const metadata: Metadata = {
  title: "Miquel Manzano — Full-stack developer",
  description: "Technical portfolio of Miquel Manzano: web development, applications, applied AI, and interactive projects.",
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
};
```

- [ ] **Step 6: Add shell styles and run the browser test**

Import `../styles/shell.css` from `src/app/globals.css`. Create `src/styles/shell.css` with fixed navigation, horizontal mobile overflow, visible skip-link behavior, `.sr-only`, minimum 100svh narrative sections, and a `scroll-margin-top: 5rem` rule for every section ID.

Run:

```powershell
npm run test:e2e -- tests/portfolio-shell.spec.ts --project=desktop-chromium
npm run build
```

Expected: three shell tests pass and the build marks `/` and `/en` as static routes.

- [ ] **Step 7: Commit the bilingual shell**

```powershell
git add src/app src/components/portfolio/PortfolioPage.tsx src/components/portfolio/SessionNavigation.tsx src/styles/shell.css tests/portfolio-shell.spec.ts
git commit -m "feat: add bilingual semantic portfolio shell"
```

---

### Task 4: Implement the profile, capabilities, education, and contact narrative

**Files:**
- Create: `src/components/portfolio/SessionIntro.tsx`
- Create: `src/components/portfolio/IdentityTrace.tsx`
- Create: `src/components/portfolio/CapabilityAnalysis.tsx`
- Create: `src/components/portfolio/EducationLog.tsx`
- Create: `src/components/portfolio/ExternalAction.tsx`
- Create: `src/components/portfolio/SessionExit.tsx`
- Create: `src/styles/sections.css`
- Modify: `src/components/portfolio/PortfolioPage.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/portfolio-shell.spec.ts`

**Interfaces:**
- Consumes: the relevant readonly nested fields from `PortfolioContent` and `ExternalDestination`.
- Produces: semantic sections with stable `data-motion-section` values `intro`, `identity`, `capabilities`, `education`, and `exit`; `ExternalAction` is reused by Task 5.

- [ ] **Step 1: Extend the browser test with confirmed narrative content**

Add this test to `tests/portfolio-shell.spec.ts`:

```ts
test("renders confirmed profile, capabilities, education, and AI positioning", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Disponible para crear, aprender y llevar ideas hasta producción.")).toBeVisible();
  await expect(page.getByText(/Uso la IA como acelerador/)).toBeVisible();
  await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
  await expect(page.getByText("Docker", { exact: true })).toBeVisible();
  await expect(page.getByText(/Sistemas Microinformáticos y Redes/)).toBeVisible();
  await expect(page.getByText(/Desarrollo de Aplicaciones Web/)).toBeVisible();
  await expect(page.getByText("Institut Bernat el Ferrer", { exact: true })).toHaveCount(2);
});
```

Run the new test. Expected: FAIL because the empty shell does not render the content.

- [ ] **Step 2: Implement focused semantic section components**

Implement each component as a pure function with readonly props:

- `SessionIntro` renders the only `h1`, a hidden accessible name plus three visual title lines, the availability sentence, and decorative command text.
- `IdentityTrace` renders one `h2`, body copy, AI positioning, and the three localized records in `content.evidence`.
- `CapabilityAnalysis` renders groups as `article` elements and every capability as list text.
- `EducationLog` renders the two qualifications in chronological order with `<time>` elements for 2022, 2024, and 2026.
- `SessionExit` renders the final heading, availability, email action, and GitHub action.

Create `src/components/portfolio/ExternalAction.tsx` exactly as:

```tsx
import type { ExternalDestination } from "@/content/types";

interface ExternalActionProps {
  readonly destination: ExternalDestination;
  readonly label: string;
  readonly pendingLabel: string;
}

export function ExternalAction({ destination, label, pendingLabel }: ExternalActionProps): React.JSX.Element {
  if (destination.status === "pending") {
    return (
      <span className="external-action external-action--pending" aria-disabled="true">
        <span>{label}</span>
        <span aria-hidden="true">{pendingLabel}</span>
      </span>
    );
  }

  return (
    <a className="external-action" href={destination.url} rel="noreferrer" target="_blank">
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
```

- [ ] **Step 3: Replace empty shell sections with the new narrative composition**

Update `PortfolioPage` so `main` renders in this exact order:

```tsx
<main>
  <SessionIntro content={content.intro} />
  <IdentityTrace content={content.identity} />
  <CapabilityAnalysis content={content.capabilities} />
  <div id="projects" className="project-story-anchor" />
  <EducationLog content={content.education} />
  <SessionExit content={content.exit} pendingLabel={content.system.pendingLink} />
</main>
```

The section components own IDs `profile`, `capabilities`, `education`, and `contact`. The `project-story-anchor` temporarily preserves the `projects` anchor until Task 5 replaces it.

- [ ] **Step 4: Build the dark punk visual foundation**

Create `src/styles/sections.css` and import it from `globals.css`. It must define:

- `.session-intro` with a deep radial black-to-oxidized-red background and minimum height of 100svh.
- `.session-intro__title` using the display font at `clamp(3.6rem, 11vw, 10rem)`, uppercase, tight tracking, and line-height below 0.85.
- One outlined title line using transparent fill and `-webkit-text-stroke`.
- One red translated title line without affecting reading order.
- `.identity-trace` with asymmetric whitespace and a non-photographic identity frame labelled as work-based evidence.
- `.capability-analysis` with a light aged-bone diagnostic surface so the continuous page changes contrast once.
- `.education-log` as a vertical trace rather than generic cards.
- `.session-exit` returning to black with a red tape accent and large final heading.
- Pseudo-element grain implemented as a decorative data-URI SVG with `pointer-events: none` and low opacity.

Do not hide semantic text, do not set essential copy to opacity zero in base CSS, and mark decorative JSX layers `aria-hidden="true"`.

- [ ] **Step 5: Run content, browser, and build validation**

Run:

```powershell
npm run validate:content
npm run test:e2e -- tests/portfolio-shell.spec.ts --project=desktop-chromium
npm run typecheck
npm run build
```

Expected: all shell tests pass; the contact destinations render as disabled spans; both routes remain static.

- [ ] **Step 6: Commit the core narrative**

```powershell
git add src/components/portfolio src/styles/sections.css src/app/globals.css tests/portfolio-shell.spec.ts
git commit -m "feat: build UNKNOWN_SESSION profile narrative"
```

---

### Task 5: Add project evidence, experiments, and styled product previews

**Files:**
- Create: `tests/projects.spec.ts`
- Create: `src/components/portfolio/ProjectEvidence.tsx`
- Create: `src/components/portfolio/RecoveredFiles.tsx`
- Create: `src/components/previews/QgcPreview.tsx`
- Create: `src/components/previews/BorderPassPreview.tsx`
- Create: `src/components/previews/OcrPreview.tsx`
- Create: `src/styles/previews.css`
- Modify: `src/components/portfolio/PortfolioPage.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `PrimaryProject`, `Experiment`, and `ExternalAction`.
- Produces: `ProjectEvidence`, `RecoveredFiles`, and previews selected by explicit project ID without a flag-driven multi-mode component.

- [ ] **Step 1: Write failing project evidence tests**

Create `tests/projects.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("renders the three confirmed primary projects in order", async ({ page }) => {
  await page.goto("/");
  const evidence = page.locator("#projects");
  await expect(evidence.getByRole("heading", { name: "QGC Planner" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "BorderPass AI" })).toBeVisible();
  await expect(evidence.getByRole("heading", { name: "Ticket OCR Scanner" })).toBeVisible();
  await expect(evidence.locator("[data-project-id]" )).toHaveCount(3);
});

test("renders secondary experiments without invented descriptions", async ({ page }) => {
  await page.goto("/");
  const recoveredFiles = page.locator("[data-section='experiments']");
  await expect(recoveredFiles.getByText("Web Game", { exact: true })).toBeVisible();
  await expect(recoveredFiles.getByText("Roblox Game", { exact: true })).toBeVisible();
  await expect(recoveredFiles.getByText("AI Wrapped", { exact: true })).toBeVisible();
});

test("pending destinations never render broken anchors", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href=''], a:not([href])")).toHaveCount(0);
  await expect(page.locator("[aria-disabled='true']")).toHaveCount(8);
  await expect(page.getByText("ENLACE_PENDIENTE").first()).toBeVisible();
});
```

Expected pending count: three primary repositories, three experiment repositories, email, and general GitHub.

- [ ] **Step 2: Run the project suite and confirm it fails**

Run:

```powershell
npm run test:e2e -- tests/projects.spec.ts --project=desktop-chromium
```

Expected: FAIL because project and experiment components do not exist.

- [ ] **Step 3: Implement each preview as an independent semantic-free visual**

Create three components that return `div` trees with `aria-hidden="true"`:

- `QgcPreview` contains a grid map, one SVG route with four waypoint circles, and text `MAVLINK / CONNECTED`.
- `BorderPassPreview` contains one document silhouette, a three-step path labelled `IMPORT`, `CBAM`, `REVIEW`, and status `ANALYSIS READY`.
- `OcrPreview` contains one ticket silhouette, a scanning line, and output rows labelled `DATE`, `TOTAL`, and `TAX` without fake values.

Every component has the signature `export function NamePreview(): React.JSX.Element` and receives no props because the visuals contain no mutable content or claims.

- [ ] **Step 4: Implement project and experiment sections**

`ProjectEvidence` receives the localized heading, eyebrow, projects, and pending label. It maps the three project IDs to explicit preview functions through this immutable record:

```tsx
const previewByProjectId: Readonly<Record<PrimaryProjectId, () => React.JSX.Element>> = Object.freeze({
  "qgc-planner": QgcPreview,
  "borderpass-ai": BorderPassPreview,
  "ticket-ocr": OcrPreview,
});
```

Each project is an `article` with `data-project-id`, case label, `h3`, confirmed summary, technology list, matching preview, and `ExternalAction`.

`RecoveredFiles` renders only experiment name, category, case ID, and `ExternalAction`. It must not synthesize a summary.

Replace the temporary `project-story-anchor` in `PortfolioPage` with `ProjectEvidence` followed by `RecoveredFiles`.

- [ ] **Step 5: Create the preview and case-study styling**

Create `src/styles/previews.css` and import it from `globals.css`. Implement:

- Primary cases as full-width narrative chapters with a sticky text column only above 960px.
- Alternating aged-bone and black surfaces while retaining one continuous vertical flow.
- Preview frames with one-pixel borders, hard offset shadows, and no rounded SaaS-card appearance.
- QGC route animation-ready selectors `[data-route]` and `[data-waypoint]`.
- BorderPass document scan selectors `[data-document]` and `[data-decision-step]`.
- OCR scan selectors `[data-ticket]`, `[data-scan-line]`, and `[data-output-row]`.
- Experiments as a compact forensic index separated by rules, not generic cards.

- [ ] **Step 6: Run project, bilingual, and build checks**

Run:

```powershell
npm run test:e2e -- tests/projects.spec.ts
npm run test:e2e -- tests/portfolio-shell.spec.ts --project=desktop-chromium
npm run build
```

Expected: all project tests pass on desktop and mobile, shell tests remain green, and both routes stay static.

- [ ] **Step 7: Commit project evidence**

```powershell
git add src/components/portfolio src/components/previews src/styles/previews.css src/app/globals.css tests/projects.spec.ts
git commit -m "feat: add project evidence and previews"
```

---

### Task 6: Add continuous GSAP transformation and the forensic cursor

**Files:**
- Create: `src/components/motion/MotionController.tsx`
- Create: `src/components/motion/ForensicCursor.tsx`
- Create: `src/motion/create-portfolio-motion.ts`
- Create: `src/styles/motion.css`
- Modify: `src/components/portfolio/PortfolioPage.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/accessibility.spec.ts`

**Interfaces:**
- Consumes: elements marked with `data-motion-section`, `data-route`, `data-waypoint`, `data-document`, `data-decision-step`, `data-ticket`, `data-scan-line`, and `data-output-row`.
- Produces: `createPortfolioMotion(root: HTMLElement): () => void`, a root `data-motion-state` of `ready` or `reduced`, and complete GSAP cleanup without wrapping semantic content in a client boundary.

- [ ] **Step 1: Write failing enhanced and reduced-motion state tests**

Create `tests/accessibility.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("initializes enhanced motion without hiding semantic content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "ready");
  await expect(page.getByRole("heading", { name: "Miquel Manzano" })).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("exposes stable final content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-motion-root]")).toHaveAttribute("data-motion-state", "reduced");
    await expect(page.locator("[data-project-id]")).toHaveCount(3);
    await expect(page.locator("[data-motion-section][aria-hidden='true']")).toHaveCount(0);
  });
});

test("has no automatically detectable serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Run only the first two tests. Expected: FAIL because no motion root or state exists.

- [ ] **Step 2: Implement a scoped GSAP timeline factory with cleanup**

Create `src/motion/create-portfolio-motion.ts`:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createPortfolioMotion(root: HTMLElement): () => void {
  const context = gsap.context(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-motion-section]", root);

    for (const section of sections) {
      const revealTargets = section.querySelectorAll<HTMLElement>("[data-motion-reveal]");
      if (revealTargets.length === 0) {
        continue;
      }

      gsap.fromTo(
        revealTargets,
        { yPercent: 12, opacity: 0.35 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "center 48%",
            scrub: 0.6,
          },
        },
      );
    }

    gsap.to("[data-corruption-line]", {
      xPercent: 9,
      skewX: -7,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "45% top",
        scrub: true,
      },
    });

    gsap.fromTo("[data-scan-line]", { yPercent: -110 }, {
      yPercent: 520,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-ticket]",
        start: "top 78%",
        end: "bottom 35%",
        scrub: true,
      },
    });

    gsap.from("[data-output-row]", {
      xPercent: 18,
      opacity: 0,
      stagger: 0.12,
      scrollTrigger: {
        trigger: "[data-ticket]",
        start: "center 70%",
        end: "bottom 35%",
        scrub: true,
      },
    });
  }, root);

  return (): void => {
    context.revert();
  };
}
```

Do not pin an element that the same timeline transforms. Any later pinned composition must pin an outer frame and animate a nested child.

- [ ] **Step 3: Implement the client lifecycle boundary**

Create `src/components/motion/MotionController.tsx`:

```tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createPortfolioMotion } from "@/motion/create-portfolio-motion";

gsap.registerPlugin(useGSAP);

export function MotionController(): null {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (root === null) {
      throw new Error("MotionController could not resolve its root element");
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.motionState = reducedMotion ? "reduced" : "ready";
    if (reducedMotion) {
      return;
    }

    return createPortfolioMotion(root);
  }, { dependencies: [] });

  return null;
}
```

Add `data-motion-root` to the existing server-rendered `.portfolio-shell` in `PortfolioPage`, then render `<MotionController />` and `<ForensicCursor />` as non-wrapping client islands inside that shell. Add `data-motion-reveal` only to elements that remain visible in base CSS.

- [ ] **Step 4: Implement the fine-pointer forensic probe**

Create `ForensicCursor` as a client component. It must:

- Render one `aria-hidden="true"` fixed element with `data-forensic-cursor`.
- Use `window.matchMedia("(pointer: fine)")` before subscribing.
- Update CSS custom properties `--cursor-x` and `--cursor-y` through one `requestAnimationFrame` per pointer event burst.
- Add `data-cursor-active="true"` only while the pointer is over `[data-probe]` elements.
- Remove pointer listeners and cancel the queued frame during cleanup.
- Never replace the operating-system cursor or intercept pointer events.

- [ ] **Step 5: Add motion-state and cursor styles**

Create `src/styles/motion.css`, import it from `globals.css`, and define:

- `[data-motion-root]` with no initial hidden state.
- A low-opacity scanline overlay that is decorative and has `pointer-events: none`.
- `[data-forensic-cursor]` positioned through `translate3d(var(--cursor-x), var(--cursor-y), 0)` and hidden by default.
- Fine-pointer media rules that reveal the probe only when `data-cursor-active="true"`.
- Reduced-motion rules setting animation duration and transition duration to `0.01ms`, disabling smooth scrolling, hiding the forensic probe, and ensuring all transformed targets use their final transform and opacity.

- [ ] **Step 6: Verify motion behavior in both modes**

Run:

```powershell
npm run test:e2e -- tests/accessibility.spec.ts --project=desktop-chromium --grep "motion"
npm run typecheck
npm run build
```

Expected: enhanced state is `ready`, reduced state is `reduced`, semantic content remains visible, and GSAP produces no browser console errors.

- [ ] **Step 7: Commit the motion system**

```powershell
git add src/components/motion src/motion src/styles/motion.css src/components/portfolio/PortfolioPage.tsx src/app/globals.css tests/accessibility.spec.ts
git commit -m "feat: add continuous portfolio motion system"
```

---

### Task 7: Complete responsive behavior, keyboard access, and final verification

**Files:**
- Create: `src/styles/responsive.css`
- Modify: `src/app/globals.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/shell.css`
- Modify: `src/styles/sections.css`
- Modify: `src/styles/previews.css`
- Modify: `src/styles/motion.css`
- Modify: `tests/accessibility.spec.ts`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Consumes: all rendered sections and Playwright projects.
- Produces: a verified responsive site with no critical automated accessibility violations and a clean production build.

- [ ] **Step 1: Add failing keyboard and mobile assertions**

Append to `tests/accessibility.spec.ts`:

```ts
test("supports a keyboard-only skip and project navigation path", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#profile$/);

  const projectsLink = page.getByRole("link", { name: "Proyectos" });
  await projectsLink.focus();
  await projectsLink.press("Enter");
  await expect(page).toHaveURL(/#projects$/);
});

test("keeps the full narrative usable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only assertion");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Miquel Manzano" })).toBeVisible();
  await expect(page.locator("[data-project-id]")).toHaveCount(3);
  const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
  const viewportWidth = page.viewportSize()?.width;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth ?? bodyWidth);
});
```

Run the full accessibility suite. Expected: at least one failure before responsive and focus adjustments are complete.

- [ ] **Step 2: Implement explicit tablet and mobile layouts**

Create `src/styles/responsive.css` and import it last from `globals.css`.

At `max-width: 960px`:

- Remove sticky project columns.
- Collapse every two-column composition to one column.
- Keep the navigation horizontally scrollable without hiding items.
- Reduce display heading sizes and asymmetric translations.
- Reduce decorative grain and shadow intensity.

At `max-width: 640px`:

- Use `--page-inline: 1rem`.
- Keep touch targets at least 44px high.
- Prevent transformed headings from exceeding the viewport.
- Place project previews before their repository state.
- Convert capability and diagnostic grids to one column.
- Remove cursor-only labels while preserving their visible content in the article body.

At `(pointer: coarse)`:

- Hide the forensic cursor.
- Disable hover transforms.
- Keep every probe detail permanently visible.

- [ ] **Step 3: Resolve keyboard focus, contrast, and axe findings at their source**

Run:

```powershell
npm run test:e2e -- tests/accessibility.spec.ts --project=desktop-chromium
```

For each reported violation, change the semantic component or color token that causes it. Do not suppress axe rules. Confirm:

- Skip link becomes visible when focused.
- Navigation anchors retain a visible two-layer focus ring.
- Heading levels progress from one `h1` to section `h2` and project `h3` elements.
- Decorative SVGs and grain layers are hidden from the accessibility tree.
- Disabled destination spans are not focusable.
- Aged-bone surfaces meet WCAG AA contrast for every text token.

Expected: the accessibility test passes with `violations` equal to an empty array.

- [ ] **Step 4: Run the complete validation matrix**

Add the production performance command and complete validation chain to `package.json`:

```json
{
  "scripts": {
    "audit:performance": "lhci autorun",
    "validate": "npm run validate:content && npm run lint && npm run typecheck && npm run build && npm run audit:performance && npm run test:e2e"
  }
}
```

Run:

```powershell
npm run validate:content
npm run lint
npm run typecheck
npm run build
npm run audit:performance
npm run test:e2e
```

Expected:

- Content validator prints `Portfolio content is valid.`
- ESLint exits 0.
- TypeScript exits 0.
- Next.js build succeeds and reports `/` and `/en` as static pages.
- Lighthouse CI reports pessimistic mobile LCP at or below 2,500 ms and CLS at or below 0.1 for both routes.
- Playwright passes every test in both desktop and mobile Chromium projects.

- [ ] **Step 5: Perform visual and motion QA with production output**

Run `npm run build`, then `npm run start`, and inspect both routes at these viewport sizes:

- 1440 × 900 desktop.
- 1024 × 768 tablet landscape.
- 390 × 844 mobile.

Verify the following concrete behaviors:

- The opening viewport states Miquel's name and availability without waiting for animation.
- The continuous corruption grows through the page but does not fragment the layout into floating pieces.
- Project previews remain legible and never claim unconfirmed values.
- Direct navigation reaches every target without content sitting behind the fixed header.
- Reduced-motion mode contains no scrubbed, pinned, blinking, or pointer-following effects.
- Browser console contains no runtime errors or React hydration warnings.

- [ ] **Step 6: Keep generated reports out of version control and commit the verified release**

Ensure `.gitignore` contains:

```gitignore
.superpowers/
.next/
node_modules/
playwright-report/
test-results/
.lighthouseci/
```

Then commit:

```powershell
git add .gitignore src tests package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs playwright.config.ts
git commit -m "feat: complete accessible UNKNOWN_SESSION portfolio"
git status --short --branch
```

Expected: commit succeeds and status prints only `## main`.

---

## Implementation References

- Next.js installation and current Node.js requirement: <https://nextjs.org/docs/app/getting-started/installation>
- Next.js metadata API: <https://nextjs.org/docs/app/api-reference/functions/generate-metadata>
- Next.js server and client component boundaries: <https://nextjs.org/docs/app/getting-started/server-and-client-components>
- GSAP installation and plugin registration: <https://gsap.com/docs/v3/Installation/>
- GSAP ScrollTrigger lifecycle and pinning guidance: <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>
- Fontsource variable-font imports: <https://fontsource.org/docs/getting-started/variable>
- Playwright desktop and mobile projects: <https://playwright.dev/docs/test-projects>
- Lighthouse CI configuration and numeric assertions: <https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md>
