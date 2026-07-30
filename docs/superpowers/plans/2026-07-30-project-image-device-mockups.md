# Project Image Device Mockups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three abstract project previews with polished, complete project images inside restrained laptop and Android device frames.

**Architecture:** Generate three deterministic `1600 × 1000` WebP assets from typed SVG compositions using the existing Playwright browser runtime and the browser's native WebP encoder. Import those local assets statically into one shared React image renderer while preserving the current preview mapping, sticky project stage, and compact inline layout.

**Tech Stack:** TypeScript 6, React 19, Next.js 16 static export, SVG, browser Canvas WebP encoding, Playwright 1.61, CSS.

## Global Constraints

- QGC Planner and BorderPass AI use restrained laptop frames; Ticket OCR uses a detailed Android phone frame centered in the same landscape canvas.
- Device chrome uses the portfolio's black, warm gray, bone, and red palette and remains secondary to the product screen.
- Device proportions must be credible: thin bezels, restrained perspective, coherent lighting, and no generic stock-mockup styling.
- Every product screen remains complete and readable; no laptop screen, phone body, or primary control may be cropped.
- Each final asset is exactly `1600 × 1000`, uses WebP, and is at or below `300 KB`.
- All assets are local static imports; there are no remote hosts, live embeds, runtime screenshot services, fallback graphics, or new dependencies.
- Existing project names, descriptions, technologies, destinations, demos, APKs, navigation, and scroll choreography remain unchanged.
- All functions and complex structures use explicit strict types. Functions do not use default parameter values or behavior-switching flags.

## File Structure

- Create `scripts/project-mockups/types.ts`: immutable mockup definition and palette types shared by every composition.
- Create `scripts/project-mockups/svg.ts`: pure XML escaping, SVG document, laptop frame, and phone frame helpers.
- Create `scripts/project-mockups/qgc-planner.ts`: pure QGC Planner product-screen composition.
- Create `scripts/project-mockups/borderpass-ai.ts`: pure BorderPass dashboard composition.
- Create `scripts/project-mockups/ticket-ocr.ts`: pure Ticket OCR Android composition.
- Create `scripts/generate-project-images.ts`: Playwright connector that rasterizes each SVG to an exact WebP and validates byte size.
- Create `public/projects/qgc-planner.webp`: generated Planner image.
- Create `public/projects/borderpass-ai.webp`: generated dashboard image.
- Create `public/projects/ticket-ocr.webp`: generated Android image.
- Create `src/components/previews/ProjectPreviewImage.tsx`: shared typed Next image renderer.
- Modify `src/components/previews/QgcPreview.tsx`: map QGC to its local image.
- Modify `src/components/previews/BorderPassPreview.tsx`: map BorderPass to its local image.
- Modify `src/components/previews/OcrPreview.tsx`: map Ticket OCR to its local image.
- Modify `src/styles/previews.css`: replace abstract-preview rules with image-preview rules.
- Modify `src/styles/responsive.css`: remove obsolete abstract-preview overrides.
- Modify `tests/accessibility.spec.ts`: add focused browser coverage for local image identity, dimensions, containment, and compact overflow.
- Modify `package.json`: expose the deterministic asset-generation command.

---

### Task 1: Generate the three polished device mockup assets

**Files:**

- Create: `scripts/project-mockups/types.ts`
- Create: `scripts/project-mockups/svg.ts`
- Create: `scripts/project-mockups/qgc-planner.ts`
- Create: `scripts/project-mockups/borderpass-ai.ts`
- Create: `scripts/project-mockups/ticket-ocr.ts`
- Create: `scripts/generate-project-images.ts`
- Create: `public/projects/qgc-planner.webp`
- Create: `public/projects/borderpass-ai.webp`
- Create: `public/projects/ticket-ocr.webp`
- Modify: `package.json`

**Interfaces:**

- Produces: `buildQgcPlannerMockup(): string`
- Produces: `buildBorderPassMockup(): string`
- Produces: `buildTicketOcrMockup(): string`
- Produces: three exact `1600 × 1000` local WebP assets consumed by Task 2.
- Consumes: the existing `@playwright/test` and `tsx` dependencies; no new package.

- [ ] **Step 1: Add the generation command**

Add this script to `package.json`:

```json
"generate:project-images": "tsx scripts/generate-project-images.ts"
```

- [ ] **Step 2: Run the smoke command and verify the pipeline is absent**

Run:

```powershell
npm run generate:project-images
```

Expected: FAIL because `scripts/generate-project-images.ts` does not exist.

- [ ] **Step 3: Define the strict shared asset types**

Create `scripts/project-mockups/types.ts` with these exact public contracts:

```ts
export const MOCKUP_WIDTH = 1600;
export const MOCKUP_HEIGHT = 1000;
export const MAX_MOCKUP_BYTES = 300_000;

export type MockupSlug = "qgc-planner" | "borderpass-ai" | "ticket-ocr";

export interface MockupDefinition {
  readonly slug: MockupSlug;
  readonly buildSvg: () => string;
}

export interface MockupPalette {
  readonly void: string;
  readonly panel: string;
  readonly bone: string;
  readonly muted: string;
  readonly line: string;
  readonly alert: string;
}

export const mockupPalette: Readonly<MockupPalette> = Object.freeze({
  void: "#030303",
  panel: "#090807",
  bone: "#eee8de",
  muted: "#948b83",
  line: "#39322e",
  alert: "#e7342b",
});
```

- [ ] **Step 4: Implement the pure SVG and device-frame helpers**

Create `scripts/project-mockups/svg.ts` with separate single-purpose functions:

```ts
import {
  MOCKUP_HEIGHT,
  MOCKUP_WIDTH,
  mockupPalette,
} from "./types";

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createSvgDocument(definitions: string, content: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MOCKUP_WIDTH}" height="${MOCKUP_HEIGHT}" viewBox="0 0 ${MOCKUP_WIDTH} ${MOCKUP_HEIGHT}">`,
    "<defs>",
    '<filter id="deviceShadow" x="-30%" y="-30%" width="160%" height="180%">',
    '<feDropShadow dx="0" dy="36" stdDeviation="34" flood-color="#000000" flood-opacity=".72"/>',
    "</filter>",
    '<linearGradient id="deviceEdge" x1="0" y1="0" x2="1" y2="1">',
    `<stop offset="0%" stop-color="${mockupPalette.muted}"/>`,
    `<stop offset="45%" stop-color="${mockupPalette.line}"/>`,
    `<stop offset="100%" stop-color="${mockupPalette.void}"/>`,
    "</linearGradient>",
    definitions,
    "</defs>",
    `<rect width="${MOCKUP_WIDTH}" height="${MOCKUP_HEIGHT}" fill="${mockupPalette.void}"/>`,
    '<circle cx="800" cy="470" r="430" fill="#e7342b" opacity=".055"/>',
    content,
    "</svg>",
  ].join("");
}

export function createLaptopFrame(screenContent: string, productLabel: string): string {
  const safeLabel: string = escapeXml(productLabel);
  return [
    '<g filter="url(#deviceShadow)">',
    '<rect x="180" y="120" width="1240" height="730" rx="34" fill="url(#deviceEdge)" stroke="#5b514b" stroke-width="2"/>',
    '<rect x="204" y="144" width="1192" height="682" rx="18" fill="#050505"/>',
    '<circle cx="800" cy="138" r="5" fill="#948b83"/>',
    screenContent,
    '<path d="M120 850 H1480 L1375 914 H225 Z" fill="url(#deviceEdge)" stroke="#5b514b" stroke-width="2"/>',
    '<path d="M650 850 H950 L915 873 H685 Z" fill="#171411"/>',
    "</g>",
    `<text x="800" y="958" text-anchor="middle" fill="${mockupPalette.muted}" font-size="18" font-family="monospace" letter-spacing="4">${safeLabel}</text>`,
  ].join("");
}

export function createPhoneFrame(screenContent: string, productLabel: string): string {
  const safeLabel: string = escapeXml(productLabel);
  return [
    '<g filter="url(#deviceShadow)">',
    '<rect x="580" y="52" width="440" height="896" rx="72" fill="url(#deviceEdge)" stroke="#5b514b" stroke-width="2"/>',
    '<rect x="602" y="76" width="396" height="848" rx="54" fill="#050505"/>',
    '<rect x="742" y="88" width="116" height="12" rx="6" fill="#39322e"/>',
    '<circle cx="886" cy="94" r="7" fill="#39322e"/>',
    screenContent,
    '<rect x="742" y="898" width="116" height="6" rx="3" fill="#948b83" opacity=".62"/>',
    "</g>",
    `<text x="800" y="980" text-anchor="middle" fill="${mockupPalette.muted}" font-size="18" font-family="monospace" letter-spacing="4">${safeLabel}</text>`,
  ].join("");
}
```

`createLaptopFrame` must render a centered aluminum-black laptop with a thin bezel, subtle red edge light, front-facing screen, restrained three-dimensional base, and one coherent shadow. `createPhoneFrame` must render a centered Android phone with rounded metal edge, thin bezel, earpiece/camera details, safe-area spacing, and one coherent shadow. Neither helper accepts a device-type flag or mutates input strings.

The supplied coordinates are the starting geometry for the quality review. Keep the laptop screen at `1140 × 640`, the phone screen at `360 × 760`, one shared soft-shadow filter, and one restrained edge gradient. Adjust values only when the original-resolution review identifies a concrete proportion, clipping, or lighting defect.

- [ ] **Step 5: Build the QGC Planner screen**

Create `scripts/project-mockups/qgc-planner.ts`:

```ts
import { createLaptopFrame, createSvgDocument } from "./svg";

function createQgcDefinitions(): string {
  return [
    '<radialGradient id="terrain" cx="58%" cy="45%" r="75%">',
    '<stop offset="0%" stop-color="#435247"/>',
    '<stop offset="56%" stop-color="#202a22"/>',
    '<stop offset="100%" stop-color="#0b0e0c"/>',
    "</radialGradient>",
  ].join("");
}

function createQgcScreen(): string {
  return [
    '<rect x="230" y="170" width="1140" height="640" fill="#080a08"/>',
    '<rect x="230" y="170" width="1140" height="58" fill="#090807"/>',
    '<text x="258" y="207" fill="#eee8de" font-size="18" font-family="monospace">QGC / MISSION CONTROL</text>',
    '<text x="1128" y="207" fill="#e7342b" font-size="16" font-family="monospace">● MAVLINK CONNECTED</text>',
    '<rect x="230" y="228" width="235" height="582" fill="#0d0c0b"/>',
    '<text x="254" y="270" fill="#e7342b" font-size="14" font-family="monospace">MISSION SEQUENCE</text>',
    '<text x="254" y="316" fill="#eee8de" font-size="18" font-family="monospace">01  TAKEOFF</text>',
    '<text x="254" y="364" fill="#eee8de" font-size="18" font-family="monospace">02  WP 01</text>',
    '<text x="254" y="412" fill="#eee8de" font-size="18" font-family="monospace">03  WP 02</text>',
    '<text x="254" y="460" fill="#e7342b" font-size="18" font-family="monospace">04  WP 03</text>',
    '<text x="254" y="508" fill="#eee8de" font-size="18" font-family="monospace">05  RTL</text>',
    '<rect x="465" y="228" width="655" height="582" fill="url(#terrain)"/>',
    '<path d="M520 700 L650 575 L780 630 L905 430 L1040 515" fill="none" stroke="#e7342b" stroke-width="6"/>',
    '<g fill="#eee8de" stroke="#030303" stroke-width="4">',
    '<circle cx="520" cy="700" r="12"/><circle cx="650" cy="575" r="12"/>',
    '<circle cx="780" cy="630" r="12"/><circle cx="905" cy="430" r="12"/>',
    '<circle cx="1040" cy="515" r="12"/>',
    "</g>",
    '<rect x="1120" y="228" width="250" height="582" fill="#0d0c0b"/>',
    '<text x="1146" y="275" fill="#e7342b" font-size="14" font-family="monospace">LIVE TELEMETRY</text>',
    '<text x="1146" y="338" fill="#eee8de" font-size="24" font-family="monospace">ALT 120 m</text>',
    '<text x="1146" y="402" fill="#eee8de" font-size="24" font-family="monospace">SPD 18 m/s</text>',
    '<text x="1146" y="466" fill="#eee8de" font-size="24" font-family="monospace">BAT 78%</text>',
    '<text x="1146" y="530" fill="#eee8de" font-size="24" font-family="monospace">LINK 98%</text>',
  ].join("");
}

export function buildQgcPlannerMockup(): string {
  return createSvgDocument(
    createQgcDefinitions(),
    createLaptopFrame(createQgcScreen(), "QGC / MISSION CONTROL"),
  );
}
```

The actual `screenContent` must include:

- a satellite-style terrain field using layered gradients and path contours;
- a connected red route with at least five numbered waypoints;
- a left mission sequence with `TAKEOFF`, `WP 01`, `WP 02`, `WP 03`, and `RTL`;
- a right telemetry rail showing `ALT 120 m`, `SPD 18 m/s`, `BAT 78%`, and `LINK 98%`;
- a top status bar with `MAVLINK CONNECTED`;
- readable interface text produced as SVG text, not generated pixels.

- [ ] **Step 6: Build the BorderPass AI screen**

Create `scripts/project-mockups/borderpass-ai.ts`:

```ts
import { createLaptopFrame, createSvgDocument } from "./svg";

function createBorderPassDefinitions(): string {
  return '<linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e7342b" stop-opacity=".32"/><stop offset="100%" stop-color="#e7342b" stop-opacity="0"/></linearGradient>';
}

function createBorderPassScreen(): string {
  const cardData = [
    ["ACTIVE IMPORTS", "128"],
    ["PENDING REVIEW", "14"],
    ["EMISSIONS", "42.8 t"],
    ["COMPLIANT", "91%"],
  ] as const;
  const cards: string = cardData.map(
    ([label, value], index: number): string => {
      const x: number = 450 + (index % 2) * 240;
      const y: number = 200 + Math.floor(index / 2) * 120;
      return `<g transform="translate(${x} ${y})"><rect width="220" height="100" fill="#12100e" stroke="#39322e"/><text x="18" y="30" fill="#948b83" font-size="13" font-family="monospace">${label}</text><text x="18" y="72" fill="#eee8de" font-size="30" font-family="Arial">${value}</text></g>`;
    },
  ).join("");

  return [
    '<rect x="230" y="170" width="1140" height="640" fill="#080706"/>',
    '<rect x="230" y="170" width="190" height="640" fill="#0d0b0a"/>',
    '<text x="258" y="215" fill="#eee8de" font-size="20" font-family="Arial" font-weight="700">BORDERPASS</text>',
    '<text x="258" y="292" fill="#e7342b" font-size="15" font-family="monospace">CBAM OVERVIEW</text>',
    '<text x="258" y="338" fill="#948b83" font-size="15" font-family="monospace">IMPORTS</text>',
    '<text x="258" y="382" fill="#948b83" font-size="15" font-family="monospace">REVIEW QUEUE</text>',
    cards,
    '<text x="450" y="352" fill="#eee8de" font-size="18" font-family="Arial" font-weight="700">EMISSIONS TREND</text>',
    '<path d="M460 500 L560 448 L660 468 L760 398 L860 420 L960 342" fill="url(#chartArea)" stroke="#e7342b" stroke-width="5"/>',
    '<text x="450" y="548" fill="#948b83" font-size="13" font-family="monospace">JAN      FEB      MAR      APR      MAY      JUN</text>',
    '<text x="1030" y="352" fill="#eee8de" font-size="18" font-family="Arial" font-weight="700">REVIEW QUEUE</text>',
    '<text x="1030" y="408" fill="#eee8de" font-size="14" font-family="monospace">STEEL / DE</text>',
    '<text x="1255" y="408" fill="#e7342b" font-size="13" font-family="monospace">REVIEW</text>',
    '<text x="1030" y="454" fill="#eee8de" font-size="14" font-family="monospace">ALUMINIUM / ES</text>',
    '<text x="1242" y="454" fill="#eee8de" font-size="13" font-family="monospace">READY</text>',
    '<text x="1030" y="500" fill="#eee8de" font-size="14" font-family="monospace">CEMENT / TR</text>',
    '<text x="1196" y="500" fill="#948b83" font-size="13" font-family="monospace">MISSING DATA</text>',
    '<text x="450" y="626" fill="#eee8de" font-size="18" font-family="Arial" font-weight="700">RECENT IMPORTS</text>',
    '<text x="450" y="670" fill="#948b83" font-size="13" font-family="monospace">PRODUCT       ORIGIN       EMISSIONS       STATUS</text>',
    '<text x="450" y="716" fill="#eee8de" font-size="14" font-family="monospace">STEEL COILS   GERMANY      12.4 t          READY</text>',
    '<text x="450" y="758" fill="#eee8de" font-size="14" font-family="monospace">ALUMINIUM     SPAIN         8.1 t          REVIEW</text>',
  ].join("");
}

export function buildBorderPassMockup(): string {
  return createSvgDocument(
    createBorderPassDefinitions(),
    createLaptopFrame(createBorderPassScreen(), "BORDERPASS / CBAM OPERATIONS"),
  );
}
```

The actual `screenContent` must include:

- four summary cards: `ACTIVE IMPORTS`, `PENDING REVIEW`, `EMISSIONS`, and `COMPLIANT`;
- a shipment or emissions trend with exact month labels and a red highlighted series;
- a recent-imports table with plausible product, origin, emissions, and status columns;
- a review queue with visible `READY`, `REVIEW`, and `MISSING DATA` states;
- an active CBAM navigation item and a professional information hierarchy distinct from the Planner layout.

- [ ] **Step 7: Build the detailed Ticket OCR Android screen**

Create `scripts/project-mockups/ticket-ocr.ts`:

```ts
import { createPhoneFrame, createSvgDocument } from "./svg";

function createTicketDefinitions(): string {
  return '<linearGradient id="receiptPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f7f2ea"/><stop offset="100%" stop-color="#d8d0c5"/></linearGradient>';
}

function createTicketScreen(): string {
  return [
    '<rect x="620" y="115" width="360" height="760" rx="34" fill="#080706"/>',
    '<text x="648" y="150" fill="#948b83" font-size="13" font-family="monospace">09:41</text>',
    '<text x="648" y="200" fill="#eee8de" font-size="24" font-family="Arial" font-weight="700">Ticket Scanner</text>',
    '<rect x="648" y="230" width="304" height="255" rx="18" fill="#11100f" stroke="#39322e"/>',
    '<rect x="704" y="252" width="192" height="205" fill="url(#receiptPaper)"/>',
    '<text x="738" y="286" fill="#39322e" font-size="14" font-family="monospace">MERCAT CENTRAL</text>',
    '<path d="M674 270 h28 v-18 M926 270 h-28 v-18 M674 445 h28 v18 M926 445 h-28 v18" fill="none" stroke="#e7342b" stroke-width="5"/>',
    '<rect x="674" y="434" width="252" height="32" rx="16" fill="#e7342b"/>',
    '<text x="731" y="455" fill="#eee8de" font-size="13" font-family="monospace">SCAN COMPLETE</text>',
    '<text x="648" y="528" fill="#e7342b" font-size="13" font-family="monospace">OCR CONFIDENCE 98%</text>',
    '<text x="648" y="572" fill="#948b83" font-size="12" font-family="monospace">MERCHANT</text>',
    '<text x="790" y="572" fill="#eee8de" font-size="15" font-family="monospace">MERCAT CENTRAL</text>',
    '<text x="648" y="612" fill="#948b83" font-size="12" font-family="monospace">DATE</text>',
    '<text x="790" y="612" fill="#eee8de" font-size="15" font-family="monospace">30 / 07 / 2026</text>',
    '<text x="648" y="652" fill="#948b83" font-size="12" font-family="monospace">SUBTOTAL</text>',
    '<text x="852" y="652" fill="#eee8de" font-size="15" font-family="monospace">24.40 €</text>',
    '<text x="648" y="692" fill="#948b83" font-size="12" font-family="monospace">TAX</text>',
    '<text x="866" y="692" fill="#eee8de" font-size="15" font-family="monospace">2.56 €</text>',
    '<text x="648" y="740" fill="#eee8de" font-size="16" font-family="Arial" font-weight="700">TOTAL</text>',
    '<text x="840" y="740" fill="#e7342b" font-size="22" font-family="Arial" font-weight="700">26.96 €</text>',
    '<rect x="648" y="778" width="304" height="58" rx="15" fill="#e7342b"/>',
    '<text x="738" y="814" fill="#eee8de" font-size="16" font-family="monospace">EXPORT XLSX</text>',
  ].join("");
}

export function buildTicketOcrMockup(): string {
  return createSvgDocument(
    createTicketDefinitions(),
    createPhoneFrame(createTicketScreen(), "TICKET OCR / ANDROID"),
  );
}
```

The actual `screenContent` must include:

- Android status and app bars;
- a captured receipt with a visible scan boundary and completed scan state;
- extracted `MERCHANT`, `DATE`, `SUBTOTAL`, `TAX`, and `TOTAL` fields;
- confidence feedback reading `OCR CONFIDENCE 98%`;
- an enabled `EXPORT XLSX` action;
- spacing and touch-target proportions that read as a real phone application rather than a miniaturized desktop dashboard.

- [ ] **Step 8: Implement browser-native WebP generation and validation**

Create `scripts/generate-project-images.ts` with the exact typed definitions and failure behavior:

```ts
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import type { Browser, Page } from "@playwright/test";
import { buildBorderPassMockup } from "./project-mockups/borderpass-ai";
import { buildQgcPlannerMockup } from "./project-mockups/qgc-planner";
import { buildTicketOcrMockup } from "./project-mockups/ticket-ocr";
import {
  MAX_MOCKUP_BYTES,
  MOCKUP_HEIGHT,
  MOCKUP_WIDTH,
} from "./project-mockups/types";
import type { MockupDefinition } from "./project-mockups/types";

const outputDirectory = resolve("public", "projects");
const mockups: readonly MockupDefinition[] = Object.freeze([
  { slug: "qgc-planner", buildSvg: buildQgcPlannerMockup },
  { slug: "borderpass-ai", buildSvg: buildBorderPassMockup },
  { slug: "ticket-ocr", buildSvg: buildTicketOcrMockup },
]);

async function renderWebp(page: Page, svg: string): Promise<Buffer> {
  const dataUrl: string = await page.evaluate(
    async ({ height, source, width }): Promise<string> => {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (context === null) {
        throw new Error("Browser did not provide a 2D canvas context");
      }
      context.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL("image/webp", 0.9);
    },
    { height: MOCKUP_HEIGHT, source: svg, width: MOCKUP_WIDTH },
  );

  const encoded: string | undefined = dataUrl.split(",")[1];
  if (encoded === undefined) {
    throw new Error("Browser returned an invalid WebP data URL");
  }
  return Buffer.from(encoded, "base64");
}

async function generateProjectImages(): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch();
    const page: Page = await browser.newPage({
      viewport: { height: MOCKUP_HEIGHT, width: MOCKUP_WIDTH },
    });

    for (const mockup of mockups) {
      try {
        const output: Buffer = await renderWebp(page, mockup.buildSvg());
        if (output.byteLength > MAX_MOCKUP_BYTES) {
          throw new RangeError(
            `Project mockup exceeds byte limit: slug=${mockup.slug} bytes=${output.byteLength} limit=${MAX_MOCKUP_BYTES}`,
          );
        }

        const outputPath: string = resolve(outputDirectory, `${mockup.slug}.webp`);
        await writeFile(outputPath, output);
        console.log("Generated project mockup", {
          bytes: output.byteLength,
          height: MOCKUP_HEIGHT,
          slug: mockup.slug,
          width: MOCKUP_WIDTH,
        });
      } catch (cause: unknown) {
        throw new Error(`Could not generate project mockup: slug=${mockup.slug}`, { cause });
      }
    }
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

void generateProjectImages().catch((cause: unknown): void => {
  console.error("Project image generation failed", { cause, outputDirectory });
  process.exitCode = 1;
});
```

Keep the explicit per-slug error context, structured success log, `finally` cleanup, and non-zero top-level failure path shown above.

- [ ] **Step 9: Generate and inspect the asset contract**

Run:

```powershell
npm run generate:project-images
Get-ChildItem public\projects\*.webp | Select-Object Name,Length
```

Expected:

- PASS from the generation command;
- exactly three WebP files;
- every file is at or below `300000` bytes;
- the structured output reports `width: 1600` and `height: 1000` for every slug.

- [ ] **Step 10: Review the three raw assets at original detail**

Open each WebP at original resolution. Reject and adjust the corresponding pure builder if any of these are true:

- the device frame resembles a bulky stock mockup;
- perspective makes screen text difficult to read;
- shadow direction differs between frame elements;
- the screen does not dominate the composition;
- text overlaps, clips, or becomes illegible;
- the Planner, dashboard, or Android screen lacks any required content.

Repeat `npm run generate:project-images` after every correction and re-check all three byte limits.

- [ ] **Step 11: Commit the generation pipeline and assets**

Run:

```powershell
git add package.json scripts/project-mockups scripts/generate-project-images.ts public/projects
git commit -m "feat: generate project device mockups"
```

---

### Task 2: Render the generated images in the project evidence section

**Files:**

- Create: `src/components/previews/ProjectPreviewImage.tsx`
- Modify: `src/components/previews/QgcPreview.tsx`
- Modify: `src/components/previews/BorderPassPreview.tsx`
- Modify: `src/components/previews/OcrPreview.tsx`
- Modify: `src/styles/previews.css:118-264`
- Modify: `src/styles/responsive.css:137-153`
- Modify: `tests/accessibility.spec.ts`

**Interfaces:**

- Consumes: the three exact static WebP outputs from Task 1.
- Produces: `ProjectPreviewImage({ src }: ProjectPreviewImageProps): React.JSX.Element`.
- Preserves: `QgcPreview`, `BorderPassPreview`, and `OcrPreview` as zero-argument components consumed by `previewByProjectId`.

- [ ] **Step 1: Add a focused failing browser assertion**

Extend the existing project-preview coverage in `tests/accessibility.spec.ts`:

```ts
const projectImageCases = [
  { id: "qgc-planner", assetName: "qgc-planner" },
  { id: "borderpass-ai", assetName: "borderpass-ai" },
  { id: "ticket-ocr", assetName: "ticket-ocr" },
] as const;

test("renders complete local project mockup images", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    await page.goto("http://127.0.0.1:3000/");

    for (const project of projectImageCases) {
      const preview = page.locator(
        `[data-project-case="${project.id}"] [data-project-inline-preview]`,
      );
      const image = preview.locator("img");
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("src", new RegExp(`${project.assetName}.*\\.webp$`));
      await expect(image).toHaveAttribute("alt", "");

      const imageState = await image.evaluate((element: HTMLImageElement) => ({
        height: element.naturalHeight,
        objectFit: getComputedStyle(element).objectFit,
        width: element.naturalWidth,
      }));
      expect(imageState).toEqual({
        height: 1000,
        objectFit: "contain",
        width: 1600,
      });
    }
  } finally {
    await context.close();
  }
});
```

- [ ] **Step 2: Run the focused test and verify the old previews fail it**

Run:

```powershell
npm run build
npx playwright test tests/accessibility.spec.ts --project=desktop-chromium -g "renders complete local project mockup images"
```

Expected: FAIL because the current preview components contain SVG and div abstractions rather than images.

- [ ] **Step 3: Add the shared typed image renderer**

Create `src/components/previews/ProjectPreviewImage.tsx`:

```tsx
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ProjectPreviewImageProps {
  readonly src: StaticImageData;
}

export function ProjectPreviewImage({ src }: ProjectPreviewImageProps): React.JSX.Element {
  return (
    <div className="preview-frame preview-frame--image" aria-hidden="true">
      <Image
        alt=""
        className="project-preview-image"
        height={1000}
        sizes="(min-width: 960px) min(60vw, 921px), calc(100vw - 2rem)"
        src={src}
        unoptimized
        width={1600}
      />
    </div>
  );
}
```

- [ ] **Step 4: Map each existing preview component to one static asset**

Replace the old abstract markup while preserving each exported component signature:

```tsx
import qgcPlannerImage from "../../../public/projects/qgc-planner.webp";
import { ProjectPreviewImage } from "@/components/previews/ProjectPreviewImage";

export function QgcPreview(): React.JSX.Element {
  return <ProjectPreviewImage src={qgcPlannerImage} />;
}
```

Use the same structure in `BorderPassPreview.tsx` with `borderpass-ai.webp` and in `OcrPreview.tsx` with `ticket-ocr.webp`. Keep all imports at the top of each file.

- [ ] **Step 5: Replace obsolete preview art CSS with image containment**

Keep the existing `.preview-frame` shell and replace `.preview-frame--qgc` through `.preview-output-row:nth-child(3)` with:

```css
.preview-frame--image {
  padding: clamp(0.35rem, 1vw, 0.75rem);
  background: var(--color-void);
}

.project-preview-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

Remove the now-unused `.preview-grid`, `.preview-route`, `.preview-badge`, `.preview-document*`, `.preview-decision*`, `.preview-status`, `.preview-ticket*`, `.preview-scan-line`, and `.preview-output*` rules. Remove their obsolete compact overrides from `src/styles/responsive.css`. Do not change project layout, sticky-stage, or experiment-montage rules.

- [ ] **Step 6: Run focused integration coverage**

Run:

```powershell
npm run build
npx playwright test tests/accessibility.spec.ts --project=desktop-chromium -g "project mockup images|project previews|project stage"
npx playwright test tests/accessibility.spec.ts --project=mobile-chromium -g "project mockup images|project previews|compact composition"
```

Expected: PASS for image identity, `1600 × 1000` natural dimensions, `object-fit: contain`, desktop sticky preview behavior, mobile inline behavior, and compact overflow.

- [ ] **Step 7: Inspect the integrated desktop and mobile compositions**

Start the existing local production server and inspect:

- desktop at `1440 × 1000`, scrolling through all three project cases;
- mobile at the configured Pixel 7 viewport;
- English `/` and Spanish `/es`;
- Planner → BorderPass → Ticket OCR sticky transitions;
- every full laptop or phone boundary;
- readability of product-screen hierarchy;
- image loading without layout shift;
- the unchanged GitHub/demo/APK actions beside each preview.

If visual corrections are required, change only the corresponding SVG builder or the two new image CSS rules, regenerate the assets, and repeat this step.

- [ ] **Step 8: Run repository verification**

Run:

```powershell
npm run validate:content
npm run test:content
npm run lint
npm run typecheck
npm run build
npm run audit:performance
npx playwright test
```

Expected: every command exits `0`. Record any pre-existing failure separately and do not hide it with a fallback.

- [ ] **Step 9: Review the final diff for scope and generated asset weight**

Run:

```powershell
git --no-pager diff --check
git --no-pager diff --stat
Get-ChildItem public\projects\*.webp | Select-Object Name,Length
git status --short
```

Expected: only the files listed in this plan changed; `.gitignore` remains untouched; exactly three WebP files exist and each is at or below `300000` bytes.

- [ ] **Step 10: Commit the integrated project previews**

Run:

```powershell
git add public/projects scripts/project-mockups src/components/previews src/styles/previews.css src/styles/responsive.css tests/accessibility.spec.ts
git commit -m "feat: show complete project image previews"
```
