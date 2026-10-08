# Plan: pulido de la sección Tecnologías "Wired"

**Fecha:** 2026-10-08
**Ejecutor:** agente de código (Codex)
**Depende de:** `docs/superpowers/plans/2026-10-07-wired-technologies-section-plan.md` (ya implementado)
**Objetivo:** corregir un bug de alineación y pulir legibilidad y estética de `#capabilities` sin cambiar su estructura base.

---

## 0. Reglas

1. No cambies los textos existentes de `stages` (label, description, capabilities) en `portfolio.es.ts` / `portfolio.en.ts`.
2. Sin dependencias nuevas. CSS + React existentes.
3. Toca solo: `src/components/portfolio/BuildMethod.tsx`, `src/styles/sections.css` (bloque `.build-method*`, ~268–460), `src/styles/responsive.css` (bloque `.build-method*`, ~55), `src/styles/motion.css` (bloque reduced motion), `src/content/types.ts`, `src/content/portfolio.{es,en}.ts` (solo `method.terminal`), `src/lib/content-validation.ts`, `tests/portfolio-shell.spec.ts`.
4. Invariantes que no se pueden romper (hay tests):
   - `#capabilities` conserva `tabIndex={-1}` y es foco del enlace del header (test `keyboard navigation focuses the capabilities section`).
   - Con foco por teclado en la sección, el `h2.build-method__title` debe tener `animation-name: wired-glitch` (mismo test).
   - El nombre de cada tecnología sigue en un nodo de texto propio con el string exacto (`getByText("TypeScript", { exact: true })`).
   - `.build-method__node` = 29, con `data-linked="true|false"`.
   - Fondo de `.build-method` con luminancia < 0.04; contenido visible sin JS y con reduced motion; sin overflow horizontal a 375 px.
5. Árbol de trabajo con cambios sin commitear del usuario: **nada de `git checkout`/`reset`/`stash`**, y sin commit salvo petición.

---

## Tarea 1 — BUG: franja `NO CARRIER` desalineada

**Causa:** `.build-method__carrier { margin: 0 0 1.5rem; }` (sections.css ~289) anula el `margin-left/right: auto` de la regla compartida `.build-method > *` (sections.css ~12). En escritorio la franja empieza ~70 px a la izquierda del resto del contenido.

**Cambio:**
```css
.build-method__carrier {
  margin-block: 0 1.5rem; /* sustituye a margin: 0 0 1.5rem */
  ...
}
```
Revisa el resto de reglas `.build-method__*` que sean hijos directos de la sección (`.build-method__title`, `.build-method__legend` nueva, `.scene-eyebrow`) para que tampoco usen el shorthand `margin`.

**Verificación:** en 1440 px, el borde izquierdo de `.build-method__carrier`, `.scene-eyebrow`, `h2` y `.build-method__stages` coincide (±1 px). Añade el test de la Tarea 9.1.

---

## Tarea 2 — Eliminar el ruido de `[OK]`

Hay 19 `[OK]` frente a 10 `[LINKED]`; la columna de estado no jerarquiza.

**Cambio en `BuildMethod.tsx`:** renderiza `.build-method__status` **solo** cuando `linked` es `true`. Los nodos no enlazados no llevan estado.

```tsx
{linked ? (
  <>
    <span className="build-method__leader" aria-hidden="true" />
    <span className="build-method__status" aria-hidden="true">[{t.linkedLabel}]</span>
    <span className="sr-only">, {t.linkedDescription}</span>
  </>
) : null}
```

**Contenido:** elimina `okLabel` de `types.ts`, `portfolio.es.ts`, `portfolio.en.ts` y de `content-validation.ts` (y de `scripts/test-content-validation.ts` si lo referencia). Busca con `grep -rn okLabel` y que no quede ninguna referencia.

---

## Tarea 3 — Puntos guía entre nombre y estado

El hueco entre `React .node` y `[LINKED]` llega a ~400 px en escritorio.

**CSS:**
```css
.build-method__leader {
  flex: 1 1 1.5rem;
  min-width: 1.5rem;
  align-self: center;
  height: 0;
  margin-inline: 0.5ch;
  border-bottom: 1px dotted rgb(216 137 141 / 35%);
}

.build-method__status { margin-left: 0; } /* el leader ya empuja a la derecha */
```

Además limita el ancho de la lista para que en paneles muy anchos el leader no sea eterno:
```css
.build-method__nodes { max-width: 34rem; }
```

---

## Tarea 4 — Leyenda de `[LINKED]`

Un recruiter no sabe qué significa `[LINKED]`.

**Contenido:** añade a `method.terminal` en `types.ts`:
```ts
readonly legendPrefix: string;  // texto antes del enlace
readonly legendLink: string;    // texto del enlace a #projects
```
- ES: `legendPrefix: "usada en proyectos reales"`, `legendLink: "Ver proyectos ↓"`.
- EN: `legendPrefix: "used in shipped projects"`, `legendLink: "See projects ↓"`.

Valídalos con `assertNonEmpty` en `content-validation.ts`, junto a las demás claves de `terminal`.

**Decisión sobre `linkedLabel` en ES:** se mantiene `"LINKED"` en ambos idiomas (es parte de la estética terminal); la leyenda lo explica.

**Marcado** (justo después del `h2`):
```tsx
<p className="build-method__legend">
  <span className="build-method__status" aria-hidden="true">[{t.linkedLabel}]</span>
  {" = "}{t.legendPrefix}
  {" · "}<a href="#projects">{t.legendLink}</a>
</p>
```

**CSS:**
```css
.build-method__legend {
  margin-block: -0.5rem 1.5rem;
  color: var(--color-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
}
.build-method__legend .build-method__status {
  color: var(--color-accent-on-dark);
  text-shadow: 0 0 0.5rem rgb(216 137 141 / 45%);
}
.build-method__legend a {
  color: var(--color-ink);
  text-decoration-color: var(--color-accent-on-dark);
  text-underline-offset: 0.25em;
}
```
Comprueba que el enlace tiene focus ring visible (usa `--focus-ring` si las otras secciones lo hacen).

Unifica el estilo de `[LINKED]` de nodos y leyenda en un único selector para no duplicar reglas.

---

## Tarea 5 — Cabecera de panel en móvil

En 375 px, `CH-03 // DATOS Y APLICACIONES` empuja `8 NODOS` a una línea sola.

**Marcado:** separa número y etiqueta del contador:
```tsx
<span className="build-method__count" aria-hidden="true">
  {String(stage.capabilities.length).padStart(2, "0")}
  <span className="build-method__count-label"> {t.nodesLabel}</span>
</span>
```

**CSS responsive** (en el bloque móvil de `responsive.css` donde ya están las reglas `.build-method__*`):
```css
.build-method__count-label { display: none; }
.build-method__stage-header { flex-wrap: nowrap; }
.build-method__stage h3 { overflow-wrap: anywhere; }
```

**Verificación:** a 375 px, en los 4 paneles, `.build-method__count` comparte línea (mismo `top` ±4 px) con el `h3`. Test en la Tarea 9.2.

---

## Tarea 6 — Cursor en línea, como prompt esperando

El `_` ocupa línea propia y deja hueco abajo.

**Marcado:** elimina el `<span className="build-method__cursor">` suelto y añade como último `<li>` de cada lista:
```tsx
<li className="build-method__prompt-line" aria-hidden="true">
  <span className="build-method__prompt">&gt;</span>
  <span className="build-method__cursor">_</span>
</li>
```

**Importante:** el test cuenta `.build-method__node` = 29; esta línea **no** lleva la clase `build-method__node`. Como el `<ul>` pasa a tener un `<li>` decorativo, ponle `role="presentation"` además de `aria-hidden="true"` para que los lectores no cuenten un ítem extra.

**CSS:**
```css
.build-method__prompt-line {
  display: flex;
  gap: 0.5ch;
  padding: 0.15rem 0.25rem;
}
.build-method__cursor {
  color: var(--color-accent-on-dark);
  animation: wired-cursor 1.1s steps(1, end) infinite;
}
```
Borra `margin-top` y `display: inline-block` del `.build-method__cursor` antiguo.

**Altura de paneles:** añade `align-items: start` a `.build-method__stages` para que cada panel mida lo que su contenido (sin estirarse hasta la altura del vecino). Evalúa visualmente; si queda peor que con alturas iguales, revierte solo esta línea y anótalo en el resumen.

---

## Tarea 7 — Glitch mejor y menos frecuente

**7.1 Disparadores.** Ahora salta cada vez que el ratón entra en la sección entera. Sustituye:
```css
.build-method:hover .build-method__title,
.build-method:focus-within .build-method__title { animation: ... }
```
por:
```css
.build-method__title:hover,
.build-method:focus-visible .build-method__title,
.build-method[data-wired-reveal="done"] .build-method__title {
  animation: wired-glitch 420ms steps(2, end) 1;
}
```
- `:focus-visible` mantiene el test de teclado (el foco por `Enter` en un enlace del header da `:focus-visible` en la sección; verifícalo; si el test falla, usa `.build-method:focus .build-method__title` como respaldo).
- `data-wired-reveal="done"` lanza el glitch una vez al revelarse la sección.
- Al hacer clic con ratón en el menú ya no se dispara (sin `:focus-within` genérico).

Actualiza el selector equivalente en `motion.css` (reduced motion) para que anule los tres disparadores nuevos.

**7.2 Usar `data-text`.** El atributo existe pero no se usa. Sustituye el glitch por `text-shadow` por capas RGB:
```css
.build-method__title { position: relative; }

.build-method__title::before,
.build-method__title::after {
  position: absolute;
  inset: 0;
  content: attr(data-text);
  pointer-events: none;
  opacity: 0;
}
.build-method__title::before { color: rgb(216 137 141 / 85%); }
.build-method__title::after { color: rgb(120 200 210 / 70%); }

.build-method__title:hover::before,
.build-method:focus-visible .build-method__title::before,
.build-method[data-wired-reveal="done"] .build-method__title::before {
  animation: wired-slice-a 420ms steps(2, end) 1;
}
/* idem ::after con wired-slice-b */

@keyframes wired-slice-a {
  0%, 100% { opacity: 0; transform: none; clip-path: inset(0 0 0 0); }
  20% { opacity: 1; transform: translateX(-3px); clip-path: inset(10% 0 55% 0); }
  50% { opacity: 1; transform: translateX(2px); clip-path: inset(60% 0 8% 0); }
  70% { opacity: 0; }
}
@keyframes wired-slice-b {
  0%, 100% { opacity: 0; transform: none; clip-path: inset(0 0 0 0); }
  25% { opacity: 1; transform: translateX(3px); clip-path: inset(45% 0 25% 0); }
  55% { opacity: 1; transform: translateX(-2px); clip-path: inset(5% 0 70% 0); }
  75% { opacity: 0; }
}
```
Mantén `@keyframes wired-glitch` aplicado al propio `h2` (puede quedar como un leve `translateX` sin `text-shadow`) porque el test lee `animationName` del título.

Si la regla compartida `.build-method > h2` (sections.css ~180) da `overflow` u otros estilos que recorten los pseudo-elementos, ajústalo.

---

## Tarea 8 — Detalles

**8.1 Hover de panel (ventana activa):**
```css
.build-method__stage {
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.build-method__stage:hover,
.build-method__stage:focus-within {
  border-color: rgb(216 137 141 / 55%);
  box-shadow: inset 0 0 1.5rem rgb(0 0 0 / 45%), 0 0 1.25rem rgb(166 83 87 / 18%);
}
.build-method__stage:hover .build-method__channel { color: var(--color-accent-on-dark); }
```

**8.2 Texto lateral:** en el media query `min-width: 64rem`, sube `opacity` de `0.08` a `0.14` y cambia `right: 0.75rem` por
`right: max(0.75rem, calc((100% - var(--content-max)) / 2 - 2rem));` para que quede junto al contenido y no pegado al borde de la ventana. Comprueba que no se solapa con los paneles en 1024 px ni 1440 px.

---

## Tarea 9 — Tests (`tests/portfolio-shell.spec.ts`)

Añade junto a los tests de capabilities existentes:

**9.1 Alineación:**
```ts
test("aligns the carrier strip with capabilities content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const lefts = await page.locator("#capabilities").evaluate((section) =>
    [".build-method__carrier", ".build-method__title", ".build-method__stages"].map(
      (selector) => section.querySelector(selector)?.getBoundingClientRect().left ?? -1,
    ),
  );
  expect(Math.max(...lefts) - Math.min(...lefts)).toBeLessThanOrEqual(1);
});
```

**9.2 Cabecera móvil en una línea:**
```ts
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
```

**9.3 Estados:**
- Ajusta `renders capabilities as wired nodes with linked status`: añade
  `await expect(section.locator(".build-method__status")).toHaveCount(10 + 1);` (10 nodos enlazados + 1 en la leyenda; recalcula si los proyectos cambian) y que no hay ningún texto `[OK]`: `await expect(section.getByText("[OK]")).toHaveCount(0);`.
- Comprueba la leyenda: `await expect(section.locator(".build-method__legend a")).toHaveAttribute("href", "#projects");`.

**9.4** El test de teclado existente debe seguir pasando sin modificarlo.

---

## Verificación final (obligatoria)

```bash
npm run typecheck
npm run lint
npm run test:content
npm run validate:content
npm run test:e2e
```

Capturas de `#capabilities` (sobrescribe las existentes en `output/playwright/`):
`capabilities-wired-desktop-{es,en}.png` (1440×900) y `capabilities-wired-mobile-{es,en}.png` (375×812).

Checklist visual:
- [ ] Franja `NO CARRIER`, eyebrow, título y paneles alineados a la izquierda.
- [ ] Ningún `[OK]`; `[LINKED]` con puntos guía y leyenda comprensible.
- [ ] Cabeceras de panel en una línea en móvil.
- [ ] Cursor `> _` como última línea de cada lista, sin hueco extra.
- [ ] Glitch RGB por capas al revelar la sección, al pasar el ratón por el título y con foco de teclado; no al pasar por la sección.
- [ ] Hover de panel ilumina borde y canal.
- [ ] Texto lateral visible pero sutil, sin solaparse.
- [ ] Reduced motion: sin cursor parpadeante ni glitch.

## Entregable

Resumen con: archivos modificados, resultado de cada comando (con salida si algo falla), decisiones tomadas donde el plan da alternativa (Tarea 6 alturas, Tarea 7.1 `:focus-visible` vs `:focus`) y rutas de capturas. Sin commit.

## Fuera de alcance

- Interacción cruzada hover proyecto ↔ tecnología (fase 2).
- Cambios en hero, header u otras secciones.
