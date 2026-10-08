# Plan: sección Tecnologías estilo "Wired" (Serial Experiments Lain)

**Fecha:** 2026-10-07
**Ejecutor:** agente de código (Codex)
**Objetivo:** rediseñar la sección `#capabilities` (Tecnologías) para que continúe la estética de televisor CRT del hero (`.proof-intro`), presentándola como un terminal / directorio de nodos de la Wired, sin perder legibilidad ni accesibilidad y sin cambiar el contenido.

---

## 0. Reglas para el ejecutor

1. **No cambies el contenido textual** de `src/content/portfolio.es.ts` ni `portfolio.en.ts` (labels, descriptions, capabilities). Solo se añaden claves nuevas si este plan lo indica.
2. **No añadas dependencias** npm. Todo es CSS + React existente (Next.js, TypeScript estricto).
3. **No toques** el hero (`.proof-intro`), el header (`ExperienceHeader.tsx`) ni otras secciones salvo lo indicado.
4. El nombre visible de cada tecnología debe seguir siendo **exactamente** el string original (p.ej. `TypeScript`, `Docker`) dentro de un nodo de texto propio: el test `tests/portfolio-shell.spec.ts:93` usa `getByText("TypeScript", { exact: true })`.
5. `.build-method` debe mantener `background-color` con luminancia < 0.04 (test `portfolio-shell.spec.ts:35`). Usa `var(--color-canvas)` o `var(--color-wired)` como color de fondo base; las texturas van en pseudo-elementos o `background-image`.
6. Mantener `id="capabilities"`, la clase `.build-method` y el atributo `data-method-stage` (4 elementos).
7. Todo movimiento debe desactivarse con `prefers-reduced-motion: reduce` (ya hay un reset global en `src/styles/motion.css`, pero no confíes solo en él para animaciones con JS).
8. Sigue el estilo del código existente: componentes funcionales con tipo de retorno `React.JSX.Element`, props `readonly`, sin comentarios innecesarios.
9. El árbol de trabajo tiene cambios sin commitear del usuario. **No hagas `git checkout`, `reset` ni `stash`.** No hagas commit salvo que se pida.

---

## 1. Contexto del código actual

| Elemento | Ubicación |
|---|---|
| Componente | `src/components/portfolio/BuildMethod.tsx` |
| Uso | `src/components/portfolio/PortfolioPage.tsx` → `<BuildMethod method={content.method} />` |
| Tipos | `src/content/types.ts` (`MethodStage`, `MethodStageId`, `PortfolioContent["method"]`, `projects.items[].technologies`) |
| Contenido | `src/content/portfolio.es.ts` (`spanishMethod`), `src/content/portfolio.en.ts` (`englishMethod`) |
| Validación | `src/lib/content-validation.ts` (firma de stages y capabilities igual entre idiomas) |
| Estilos sección | `src/styles/sections.css` líneas ~268–320 (`.build-method*`) |
| Responsive | `src/styles/responsive.css` |
| Tokens | `src/styles/tokens.css` (`--color-canvas #111012`, `--color-wired #252224`, `--color-line`, `--color-ink`, `--color-muted`, `--color-accent #a65357`, `--color-accent-on-dark #d8898d`, `--color-wire-grid`, `--font-code`) |
| Referencia estética | `.proof-intro::before/::after` en `sections.css` ~40–100 (scanlines `repeating-linear-gradient`, viñeta radial, ruido `/signal-noise-live.svg`) |
| Reduced motion | `src/styles/motion.css` |
| Tests | `tests/portfolio-shell.spec.ts`, `tests/projects.spec.ts` |

Marcado actual: `section > p.scene-eyebrow + h2 + div.build-method__stages > article[data-method-stage] > h3 + p + ul > li`.

---

## 2. Diseño objetivo

```
┌ CH-01 ─ LENGUAJES ──────────────── 6 NODES ┐
│ Bases de programación que sigo ampliando…  │
│ > TypeScript.node              [LINKED]    │
│ > JavaScript.node              [ OK ]      │
│ > Dart.node                    [LINKED]    │
│ _                                          │
└────────────────────────────────────────────┘
```

- Sección: fondo `--color-canvas` + rejilla tenue (`--color-wire-grid`) + scanlines al 1–2 % de opacidad.
- Franja de transición superior "sintonización" con el texto `NO CARRIER → CONNECTED` (decorativa, `aria-hidden`).
- Cada stage = panel tipo ventana de terminal (`--color-wired` translúcido), esquinas marcadas, cabecera `CH-0N // LABEL` y contador de nodos.
- Cada tecnología = línea de directorio monospace: prompt `>`, nombre, sufijo `.node` atenuado, estado a la derecha.
- Estado `[LINKED]` (acento rosa) si la tecnología aparece en algún `projects.items[].technologies`; `[ OK ]` (muted) en caso contrario.
- Cursor `_` parpadeante al final de cada panel.
- Glitch RGB breve en el `h2` al hover/focus de la sección.
- Revelado línea a línea al entrar en viewport (CSS + IntersectionObserver), desactivado con reduced motion.
- Easter egg: texto vertical lateral `PRESENT DAY, PRESENT TIME` casi invisible, solo ≥ 64rem.

---

## 3. Pasos de implementación

### Paso 1 — Datos: calcular tecnologías enlazadas

**Archivo nuevo:** `src/lib/linked-technologies.ts`

```ts
import type { PortfolioContent } from "@/content/types";

export function linkedTechnologies(projects: PortfolioContent["projects"]["items"]): ReadonlySet<string> {
  return new Set(projects.flatMap((project) => project.technologies.map((technology) => technology.toLowerCase())));
}
```

- Comparación case-insensitive (`toLowerCase`) en el componente.
- Verifica el nombre exacto del tipo de `projects.items` en `types.ts` y ajústalo si difiere.

### Paso 2 — Textos de estado (i18n)

En `src/content/types.ts`, añade a `PortfolioContent["method"]`:

```ts
readonly terminal: {
  readonly channelPrefix: string;   // "CH"
  readonly nodesLabel: string;      // "NODES" / "NODOS"
  readonly linkedLabel: string;     // "LINKED" / "EN USO"
  readonly okLabel: string;         // "OK"
  readonly linkedDescription: string; // texto sr-only: "Usada en proyectos" / "Used in projects"
  readonly carrier: string;         // "NO CARRIER → CONNECTED"
  readonly sideNote: string;        // "PRESENT DAY, PRESENT TIME"
};
```

Rellénalo en `spanishMethod` y `englishMethod`:

- ES: `channelPrefix: "CH"`, `nodesLabel: "NODOS"`, `linkedLabel: "LINKED"`, `okLabel: "OK"`, `linkedDescription: "usada en proyectos"`, `carrier: "NO CARRIER → CONECTADO"`, `sideNote: "PRESENT DAY, PRESENT TIME"`.
- EN: `channelPrefix: "CH"`, `nodesLabel: "NODES"`, `linkedLabel: "LINKED"`, `okLabel: "OK"`, `linkedDescription: "used in projects"`, `carrier: "NO CARRIER → CONNECTED"`, `sideNote: "PRESENT DAY, PRESENT TIME"`.

En `src/lib/content-validation.ts`, dentro del bloque que valida `method` (~línea 66), añade `assertNonEmpty` para cada campo de `terminal`.

### Paso 3 — Marcado de `BuildMethod.tsx`

Cambia la firma para recibir los proyectos:

```tsx
interface BuildMethodProps {
  readonly method: PortfolioContent["method"];
  readonly projects: PortfolioContent["projects"]["items"];
}
```

Y en `PortfolioPage.tsx`: `<BuildMethod method={content.method} projects={content.projects.items} />`.

Estructura objetivo (mantén las clases existentes y añade las nuevas):

```tsx
<section id="capabilities" className="build-method" data-wired-reveal="pending">
  <p className="build-method__carrier" aria-hidden="true">{t.carrier}</p>
  <p className="build-method__side-note" aria-hidden="true">{t.sideNote}</p>
  <p className="scene-eyebrow">{method.eyebrow}</p>
  <h2 className="build-method__title" data-text={method.heading}>{method.heading}</h2>
  <div className="build-method__stages">
    {method.stages.map((stage, index) => (
      <article key={stage.id} className="build-method__stage" data-method-stage={stage.id}>
        <header className="build-method__stage-header">
          <span className="build-method__channel" aria-hidden="true">
            {t.channelPrefix}-{String(index + 1).padStart(2, "0")} //
          </span>
          <h3>{stage.label}</h3>
          <span className="build-method__count" aria-hidden="true">
            {stage.capabilities.length} {t.nodesLabel}
          </span>
        </header>
        <p>{stage.description}</p>
        <ul className="build-method__nodes">
          {stage.capabilities.map((capability, nodeIndex) => {
            const linked = linkedSet.has(capability.toLowerCase());
            return (
              <li key={capability} className="build-method__node" data-linked={linked} style={{ "--node-index": nodeIndex } as React.CSSProperties}>
                <span className="build-method__prompt" aria-hidden="true">&gt;</span>
                <span className="build-method__name">{capability}</span>
                <span className="build-method__ext" aria-hidden="true">.node</span>
                <span className="build-method__status" aria-hidden="true">[{linked ? t.linkedLabel : t.okLabel}]</span>
                {linked ? <span className="sr-only">, {t.linkedDescription}</span> : null}
              </li>
            );
          })}
        </ul>
        <span className="build-method__cursor" aria-hidden="true">_</span>
      </article>
    ))}
  </div>
</section>
```

Notas:
- `const t = method.terminal;` y `const linkedSet = linkedTechnologies(projects);` (memo no necesario, es servidor).
- `{capability}` debe quedar **solo** en `.build-method__name` (regla 0.4).
- Verifica que la clase `sr-only` existe (se usa en `ExperienceHeader.tsx`).
- Si TypeScript se queja de la custom property en `style`, usa el cast mostrado.

### Paso 4 — Revelado al entrar en viewport

`BuildMethod` es server component. Crea un componente cliente mínimo:

**Archivo nuevo:** `src/components/portfolio/WiredReveal.tsx`

```tsx
"use client";

import { useEffect } from "react";

export function WiredReveal({ targetId }: { readonly targetId: string }): null {
  useEffect((): (() => void) | undefined => {
    const target = document.getElementById(targetId);
    if (!target) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      target.dataset.wiredReveal = "done";
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        target.dataset.wiredReveal = "done";
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(target);
    return (): void => observer.disconnect();
  }, [targetId]);
  return null;
}
```

Renderízalo dentro de la sección: `<WiredReveal targetId="capabilities" />`.

**Importante (progressive enhancement):** el estado oculto solo se aplica si JS ha marcado la sección. Para evitar que el contenido quede invisible sin JS, el CSS oculta los nodos **solo** con `html.js [data-wired-reveal="pending"]` **o**, más simple, invierte la lógica: el atributo inicial en el servidor es ausente, y `WiredReveal` pone `"pending"` en el primer efecto si la sección no está ya en viewport, y `"done"` al intersectar. Implementa esta segunda variante (el atributo no va en el JSX del Paso 3):

```ts
const rect = target.getBoundingClientRect();
if (rect.top < window.innerHeight) { target.dataset.wiredReveal = "done"; return undefined; }
target.dataset.wiredReveal = "pending";
```

Los tests de Playwright hacen `toBeVisible()` sobre `TypeScript`: Playwright hace scroll al elemento, el observer dispara y los nodos aparecen. `opacity: 0` sigue contando como visible para Playwright, pero **no uses `visibility: hidden` ni `display: none`** para el estado oculto.

### Paso 5 — Estilos

Sustituye el bloque `.build-method*` de `src/styles/sections.css` (~268–320) por lo siguiente (ajusta valores si algo choca visualmente; respeta tokens):

```css
.build-method {
  position: relative;
  overflow: hidden;
  background-color: var(--color-canvas);
  background-image:
    linear-gradient(var(--color-wire-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-wire-grid) 1px, transparent 1px);
  background-size: 2.5rem 2.5rem;
  isolation: isolate;
}

.build-method::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  content: "";
  background: repeating-linear-gradient(to bottom, rgb(185 190 194 / 1.5%) 0 1px, transparent 1px 3px, rgb(0 0 0 / 12%) 3px 4px);
}

.build-method__carrier {
  margin: 0 0 1.5rem;
  padding: 0.4rem 0;
  border-block: 1px dashed var(--color-line);
  color: var(--color-muted);
  font-family: var(--font-code);
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: url("/signal-noise.svg") repeat;
  background-size: 120px 120px;
  background-blend-mode: overlay;
  mask-image: linear-gradient(to right, #000 60%, transparent);
}

.build-method__side-note {
  display: none;
}

.build-method__title {
  position: relative;
}

.build-method:hover .build-method__title,
.build-method:focus-within .build-method__title {
  animation: wired-glitch 420ms steps(2, end) 1;
}

@keyframes wired-glitch {
  0%, 100% { text-shadow: none; transform: none; }
  20% { text-shadow: -2px 0 rgb(216 137 141 / 85%), 2px 0 rgb(120 200 210 / 70%); transform: translateX(1px); }
  40% { text-shadow: 2px 0 rgb(216 137 141 / 85%), -2px 0 rgb(120 200 210 / 70%); transform: translateX(-1px); }
  60% { text-shadow: none; transform: none; }
}

.build-method__stages {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.build-method__stage {
  position: relative;
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid var(--color-line);
  background: rgb(37 34 36 / 72%);
  box-shadow: inset 0 0 1.5rem rgb(0 0 0 / 45%);
}

.build-method__stage::before,
.build-method__stage::after {
  position: absolute;
  width: 0.75rem;
  height: 0.75rem;
  pointer-events: none;
  content: "";
  border-color: var(--color-accent-on-dark);
  border-style: solid;
}

.build-method__stage::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.build-method__stage::after { right: -1px; bottom: -1px; border-width: 0 2px 2px 0; }

.build-method__stage-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed var(--color-line);
  font-family: var(--font-code);
}

.build-method__channel,
.build-method__count {
  color: var(--color-muted);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
}

.build-method__count { margin-left: auto; white-space: nowrap; }

.build-method__stage h3 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-code);
  font-size: 0.9375rem;
  letter-spacing: 0.08em;
}

.build-method__stage p {
  margin: 0 0 0.9rem;
  color: var(--color-muted);
  font-size: 0.9375rem;
  line-height: 1.45;
}

.build-method__nodes {
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-code);
  font-size: 0.8125rem;
}

.build-method__node {
  display: flex;
  align-items: baseline;
  gap: 0.5ch;
  min-width: 0;
  padding: 0.15rem 0.25rem;
  color: var(--color-ink);
  transition: background-color 160ms ease, opacity 240ms ease, transform 240ms ease;
}

.build-method__node:hover { background: rgb(166 83 87 / 14%); }

.build-method__prompt { color: var(--color-accent-on-dark); }
.build-method__ext { color: var(--color-muted); opacity: 0.6; }

.build-method__status {
  margin-left: auto;
  color: var(--color-muted);
  font-size: 0.6875rem;
  white-space: nowrap;
}

.build-method__node[data-linked="true"] .build-method__status {
  color: var(--color-accent-on-dark);
  text-shadow: 0 0 0.5rem rgb(216 137 141 / 45%);
}

.build-method__cursor {
  display: inline-block;
  margin-top: 0.4rem;
  color: var(--color-accent-on-dark);
  font-family: var(--font-code);
  animation: wired-cursor 1.1s steps(1, end) infinite;
}

@keyframes wired-cursor { 50% { opacity: 0; } }

.build-method[data-wired-reveal="pending"] .build-method__node {
  opacity: 0;
  transform: translateX(-0.5rem);
}

.build-method[data-wired-reveal="done"] .build-method__node {
  transition-delay: calc(var(--node-index, 0) * 45ms);
}

@media (min-width: 64rem) {
  .build-method__side-note {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    display: block;
    margin: 0;
    color: var(--color-ink);
    font-family: var(--font-code);
    font-size: 0.625rem;
    letter-spacing: 0.4em;
    opacity: 0.08;
    writing-mode: vertical-rl;
    transform: translateY(-50%);
  }
}
```

Comprobaciones:
- La regla `.build-method > *` existente (~línea 12) puede dar `position`/`z-index`; asegúrate de que `::after` (z-index -1 con `isolation`) queda bajo el contenido y de que `.build-method__side-note` absoluto no queda afectado por esa regla (si lo está, excluye con `:not(.build-method__side-note)` o ajusta).
- Si `/signal-noise.svg` no existe en `public/`, quita esa línea de `background` del carrier.
- Contraste: `--color-muted` sobre `rgb(37 34 36)` debe ser ≥ 4.5:1 (lo es); el `.node` atenuado es decorativo (`aria-hidden`).

### Paso 6 — Responsive

En `src/styles/responsive.css`, en el breakpoint móvil existente que ya colapsa grids (busca el media query donde `.formation-trace__list` u otros pasan a una columna), añade:

```css
.build-method__stages { grid-template-columns: 1fr; }
.build-method__stage { padding: 1rem; }
.build-method__ext { display: none; }
```

Si la sección no tenía reglas responsive previas, crea el media query `@media (max-width: 47.99rem)` siguiendo el formato del archivo. Objetivo: a 375 px no hay scroll horizontal y el estado `[LINKED]` no se solapa con nombres largos (`Web accessibility`, `Responsive design`); si se solapa, permite `flex-wrap: wrap` en `.build-method__node`.

### Paso 7 — Reduced motion

En `src/styles/motion.css`, dentro del `@media (prefers-reduced-motion: reduce)` existente, añade:

```css
.build-method__cursor,
.build-method:hover .build-method__title,
.build-method:focus-within .build-method__title { animation: none; }

.build-method[data-wired-reveal="pending"] .build-method__node { opacity: 1; transform: none; }
```

### Paso 8 — Tests

En `tests/portfolio-shell.spec.ts`, junto al test `shows the existing education and capabilities`, añade:

```ts
test("renders capabilities as wired nodes with linked status", async ({ page }) => {
  await page.goto("/es");
  const section = page.locator("#capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".build-method__node")).toHaveCount(29);
  await expect(section.locator('.build-method__node[data-linked="true"]').filter({ hasText: "TypeScript" })).toHaveCount(1);
  await expect(section.locator('.build-method__node[data-linked="false"]').filter({ hasText: "Docker" })).toHaveCount(1);
  await expect(section.locator(".build-method__node").first()).toHaveCSS("opacity", "1");
});

test("capabilities section has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const overflow = await page.locator("#capabilities").evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
```

- 29 = 6 + 8 + 8 + 7 capabilities; recalcúlalo desde el contenido si cambia.
- Verifica qué tecnologías están realmente enlazadas (TypeScript, React, Mapbox GL, Cesium, Next.js, PostgreSQL, Prisma, Dart, Flutter, Google ML Kit) y que Docker no lo está.
- Añade también un test de `emulateMedia({ reducedMotion: "reduce" })` comprobando opacidad 1 sin scroll si es sencillo.

---

## 4. Verificación (obligatoria antes de dar por terminado)

Ejecuta, en este orden, y corrige hasta que todo pase:

```bash
npm run typecheck
npm run lint
npm run test:content
npm run validate:content
npm run test:e2e
```

Verificación visual (Playwright o navegador): captura `#capabilities` en `/` y `/es` a 1440×900 y 375×812, en `output/playwright/capabilities-wired-desktop.png` y `capabilities-wired-mobile.png`. Comprueba:
- [ ] Se percibe continuidad con el hero (scanlines/rejilla tenues, no ruido a pantalla completa).
- [ ] Textos legibles; nada parpadea salvo el cursor.
- [ ] `[LINKED]` en acento rosa solo en tecnologías usadas en proyectos.
- [ ] Sin scroll horizontal en móvil.
- [ ] Con JS desactivado, todo el contenido es visible.
- [ ] Con reduced motion, sin animaciones.
- [ ] Navegación por teclado: el glitch del título aparece con focus-within y no rompe el focus ring.

## 5. Entregable

Resumen breve con: archivos creados/modificados, resultado de cada comando de verificación (con salida si falla algo) y rutas de las capturas. No hacer commit salvo que el usuario lo pida.

## 6. Fuera de alcance

- Interacción cruzada hover proyecto ↔ tecnología (posible fase 2).
- Cambios en hero, header u otras secciones.
- Iconos/logos de tecnologías o barras de nivel.
