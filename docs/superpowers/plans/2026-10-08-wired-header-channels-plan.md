# Plan: navbar "panel de canales" (estética TV / Serial Experiments Lain)

**Fecha:** 2026-10-08
**Ejecutor:** agente de código (Codex)
**Contexto previo:** `2026-10-07-wired-technologies-section-plan.md` y `2026-10-08-wired-technologies-polish-plan.md` (sección Tecnologías con paneles `CH-0N`, glitch RGB `wired-glitch` / `wired-slice-a|b`, scanlines).
**Objetivo:** que el header deje de ser una barra de botones genérica y funcione como el panel/OSD del televisor: canales numerados, canal activo, marca "en emisión" y modo flotante coherente con el CRT del hero.

---

## 0. Reglas

1. Sin dependencias nuevas. React + CSS existentes; TypeScript estricto; componentes con retorno `React.JSX.Element`, props `readonly`.
2. Archivos que puedes tocar: `src/components/portfolio/ExperienceHeader.tsx`, `src/styles/shell.css` (bloque `.experience-header*`, ~1–160), `src/styles/responsive.css` (bloques `.experience-header*`, ~14–45 y ~73–90), `src/styles/motion.css` (reduced motion), `src/content/types.ts`, `src/content/portfolio.{es,en}.ts` (solo claves nuevas de header), `src/lib/content-validation.ts`, tests en `tests/`.
3. **No** cambies los `label` ni `target` de `navigation` existentes ni su orden.
4. Árbol de trabajo con cambios sin commitear del usuario: **nada de `git checkout`/`reset`/`stash`**; sin commit salvo petición.
5. Todo movimiento se desactiva con `prefers-reduced-motion: reduce`.

### Invariantes protegidas por tests (no romper)

| Test | Requisito |
|---|---|
| `accessibility.spec.ts` "visible skip link" | El primer Tab enfoca `Saltar al contenido`; existe link con nombre accesible **exacto** `Proyectos` y es enfocable. ⇒ los números de canal deben ser `aria-hidden` y el nombre accesible de cada enlace sigue siendo solo el label. |
| `portfolio-shell.spec.ts:63` | Existe `getByRole("link", { name: "English" })` en `/es` (y `"Español"` en `/en`) con `href` `/en` / `/`. El nombre puede contener más texto (match parcial), pero debe incluir el nombre del idioma destino. |
| `portfolio-shell.spec.ts:85–89` | `.experience-header__navigation a` = 4, en orden `#capabilities, #projects, #education, #contact`. |
| `portfolio-shell.spec.ts:108, 268` | Enfocar `a[href='#capabilities']` + Enter enfoca `#capabilities` y dispara el glitch. ⇒ no interceptes el click/Enter con `preventDefault`. |
| `portfolio-shell.spec.ts:464` | A 1440×900, `#profile` alto ≥ `900 − altura header − 1`. ⇒ si cambia la altura del header docked, el hero se adapta (ya usa `calc(100svh - …)`; revisa `responsive.css:10` y `sections.css` del hero). |
| `accessibility.spec.ts` "320px" | Sin overflow horizontal a 320 px. |
| Proyecto `mobile-chromium` de Playwright | Los 4 enlaces deben estar **visibles y enfocables también en móvil** (el test de accesibilidad corre en ese proyecto). ⇒ en esta fase **no** se oculta la navegación tras un menú desplegable. |

---

## 1. Estado actual (referencia)

- `ExperienceHeader.tsx`: client component. `mode: "docked" | "floating"` según `scrollY > 48`. Render: skip link, `a.brand` (`Miquel Manzano<span>.</span>`), `nav > ul.experience-header__navigation > li > a`, `a.experience-header__language` (sr-only `languageLabel: ` + nombre del idioma destino), `a.experience-header__contact`.
- `shell.css`: docked = parte superior del mueble TV (`border-radius: 1rem 1rem 0 0`, gradiente `#1c1a1c → #0d0c0e`), encaja con el hero (`border-radius: 0 0 1rem 1rem`). Floating = cápsula `max-width: 70rem`, `border-radius: 0.75rem`, sombra.
- Navegación = caja segmentada con bordes redondeados; hover rosa translúcido. Contacto = botón rojo `#73363b`, duplicado con el enlace "Contacto".
- `responsive.css`: ≤ breakpoint medio, nav pasa a segunda fila en grid de 4; ≤ 480 px se oculta el botón contacto.

---

## 2. Diseño objetivo

Desktop docked (parte superior del televisor):
```
● MIQUEL MANZANO // REC   [ 01 TECNOLOGÍAS │ 02 PROYECTOS │ 03 FORMACIÓN │ 04 CONTACTO ]   CH 02 ▸ PROYECTOS   ES|EN
```
Desktop floating (OSD superpuesto a la pantalla): barra fina translúcida con scanlines tenues y esquinas marcadas en rosa (mismo lenguaje que `.build-method__stage::before/::after`).

Móvil: una fila superior `● M.MANZANO   CH 02   ES|EN` y debajo la tira de 4 canales compacta (`01 TECH` … o el número + label abreviado vía CSS, ver Tarea 7).

---

## 3. Tareas

### Tarea 1 — Contenido nuevo (i18n)

En `types.ts`, añade a `PortfolioContent["system"]` (o crea `header` si encaja mejor con la estructura; elige uno y sé consistente):
```ts
readonly header: {
  readonly broadcastLabel: string;   // "REC"
  readonly channelPrefix: string;    // "CH"
  readonly homeChannelLabel: string; // "PERFIL" / "PROFILE"
  readonly currentChannelLabel: string; // sr-only: "Sección actual" / "Current section"
};
```
- ES: `broadcastLabel: "REC"`, `channelPrefix: "CH"`, `homeChannelLabel: "PERFIL"`, `currentChannelLabel: "Sección actual"`.
- EN: `broadcastLabel: "REC"`, `channelPrefix: "CH"`, `homeChannelLabel: "PROFILE"`, `currentChannelLabel: "Current section"`.

Añade `assertNonEmpty` para cada clave en `content-validation.ts`, siguiendo el patrón existente. Si `scripts/test-content-validation.ts` construye objetos de contenido completos, actualízalo.

### Tarea 2 — Canal activo (scroll spy)

En `ExperienceHeader.tsx`, añade estado `activeTarget: NavigationTarget | null` (usa el tipo de `target` existente de `types.ts`; `null` = hero/perfil).

```ts
useEffect((): (() => void) | undefined => {
  if (!("IntersectionObserver" in window)) return undefined;
  const sections = content.navigation
    .map((item) => document.getElementById(item.target))
    .filter((element): element is HTMLElement => element !== null);
  const visible = new Map<string, number>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    const best = [...visible.entries()].filter(([, ratio]) => ratio > 0).sort((a, b) => b[1] - a[1])[0];
    setActiveTarget(best ? (best[0] as NavigationTarget) : null);
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] });
  sections.forEach((section) => observer.observe(section));
  return (): void => observer.disconnect();
}, [content.navigation]);
```
- La banda `rootMargin` hace que gane la sección que cruza la franja central-alta de la pantalla. Ajusta si al llegar a `#contact` (última sección, puede ser corta) no se activa: en ese caso, si `window.innerHeight + scrollY >= document.body.scrollHeight - 2`, fuerza `"contact"` dentro del handler de scroll existente.
- Enlace activo: `aria-current={activeTarget === item.target ? "location" : undefined}` y `data-active`.

### Tarea 3 — Marcado de enlaces como canales

```tsx
{content.navigation.map((item, index) => (
  <li key={item.target}>
    <a href={`#${item.target}`} aria-current={...} data-active={activeTarget === item.target}>
      <span className="experience-header__channel-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="experience-header__channel-label">{item.label}</span>
    </a>
  </li>
))}
```
El nombre accesible debe seguir siendo exactamente el label (p. ej. `Proyectos`). Verifícalo con el test de accesibilidad.

### Tarea 4 — Display OSD del canal actual

Entre `nav` y el selector de idioma:
```tsx
<p className="experience-header__osd" key={activeTarget ?? "profile"} data-channel={activeIndex}>
  <span className="sr-only">{h.currentChannelLabel}: </span>
  <span aria-hidden="true">{h.channelPrefix} {String(activeIndex).padStart(2, "0")} ▸ </span>
  <span>{activeLabel}</span>
</p>
```
- `activeIndex` = posición 1–4 o `0` para perfil; `activeLabel` = label del item o `h.homeChannelLabel`.
- El `key` cambiante remonta el nodo y relanza la animación de "sintonía" (Tarea 6).
- **No** uses `aria-live` (sería ruidoso al hacer scroll). El `aria-current` del enlace ya comunica la ubicación.
- Ocultar el OSD por debajo de ~64rem de ancho si no cabe junto a la nav (ver Tarea 7 para móvil).

### Tarea 5 — Marca "en emisión" y selector de idioma

**Marca:**
```tsx
<a className="experience-header__brand" href="#profile">
  <span className="experience-header__rec-dot" aria-hidden="true" />
  <span className="experience-header__brand-name">Miquel Manzano</span>
  <span className="experience-header__rec" aria-hidden="true">{" // "}{h.broadcastLabel}</span>
</a>
```
Nombre accesible = "Miquel Manzano".

**Idioma (ES|EN):** un único `<a>` (mantiene `href`, `hrefLang`, `lang` actuales), con contenido visual de interruptor:
```tsx
<a className="experience-header__language" href={targetHref} hrefLang={targetLocale} lang={targetLocale}>
  <span className="sr-only">{content.system.languageLabel}: {targetLabel}</span>
  <span aria-hidden="true" className="experience-header__lang-option" data-current={content.locale === "es"}>ES</span>
  <span aria-hidden="true" className="experience-header__lang-sep">|</span>
  <span aria-hidden="true" className="experience-header__lang-option" data-current={content.locale === "en"}>EN</span>
</a>
```
Nombre accesible = "Cambiar idioma: English" ⇒ el test `getByRole("link", { name: "English" })` sigue pasando (match parcial). Verifícalo.

**Botón Contactar:** elimínalo del header (está como canal 04 y como CTA del hero). Borra `.experience-header__contact` de `shell.css` y `responsive.css`. Ajusta `grid-template-columns` del header a 4 columnas: `auto minmax(0, 1fr) auto auto` (brand, nav, osd, language). Busca en `tests/` cualquier referencia a `experience-header__contact` o al link "Contactar" dentro del header y actualízala (el CTA del hero se mantiene).

### Tarea 6 — Estilos

Sustituye los estilos de navegación/brand/language/contact de `shell.css` conservando el bloque base `.experience-header` (sticky, ancho, transición) y la regla `scroll-margin-top`.

```css
/* marca */
.experience-header__brand { display: inline-flex; align-items: center; gap: 0.5rem; /* + estilos actuales */ }
.experience-header__rec-dot {
  width: 0.5rem; height: 0.5rem; border-radius: 50%;
  background: var(--color-accent-on-dark);
  box-shadow: 0 0 0.5rem rgb(216 137 141 / 70%);
  animation: header-rec 2.4s ease-in-out infinite;
}
.experience-header__rec { color: var(--color-muted); font-weight: 500; }
@keyframes header-rec { 50% { opacity: 0.35; box-shadow: none; } }

/* canales */
.experience-header__navigation {
  display: flex; margin: 0; padding: 0; list-style: none;
  border-block: 1px solid var(--color-line);
  background: rgb(11 10 12 / 80%);
}
.experience-header__navigation li + li { border-left: 1px dashed var(--color-line); }
.experience-header__navigation a {
  position: relative;
  display: inline-flex; align-items: baseline; gap: 0.5ch;
  min-height: 2.375rem; padding: 0.5rem 0.75rem;
  color: var(--color-muted);
  font-family: var(--font-code); font-size: 0.75rem; letter-spacing: 0.08em;
  text-decoration: none; text-transform: uppercase; white-space: nowrap;
  transition: color 160ms ease, background 160ms ease;
}
.experience-header__channel-number { color: var(--color-line); font-size: 0.625rem; transition: color 160ms ease; }
.experience-header__navigation a:hover,
.experience-header__navigation a:focus-visible { color: var(--color-ink); background: rgb(166 83 87 / 12%); }
.experience-header__navigation a:hover .experience-header__channel-number,
.experience-header__navigation a:focus-visible .experience-header__channel-number { color: var(--color-accent-on-dark); }
.experience-header__navigation a:focus-visible { outline: none; box-shadow: var(--focus-ring); }

/* activo: LED + línea inferior */
.experience-header__navigation a[aria-current] { color: var(--color-ink); }
.experience-header__navigation a[aria-current] .experience-header__channel-number { color: var(--color-accent-on-dark); }
.experience-header__navigation a[aria-current]::after {
  position: absolute; right: 0.75rem; bottom: -1px; left: 0.75rem; height: 2px;
  content: ""; background: var(--color-accent-on-dark);
  box-shadow: 0 0 0.5rem rgb(216 137 141 / 60%);
}

/* glitch de hover: reutiliza wired-glitch (definido en sections.css) */
.experience-header__navigation a:hover .experience-header__channel-label { animation: wired-glitch 320ms steps(2, end) 1; }

/* OSD */
.experience-header__osd {
  margin: 0; padding: 0.35rem 0.6rem;
  color: var(--color-accent-on-dark);
  font-family: var(--font-code); font-size: 0.6875rem; letter-spacing: 0.14em;
  text-transform: uppercase; white-space: nowrap;
  text-shadow: 0 0 0.5rem rgb(216 137 141 / 40%);
  animation: header-tune 360ms steps(3, end) 1;
}
@keyframes header-tune {
  0% { opacity: 0; filter: blur(1px); transform: translateX(-2px); }
  40% { opacity: 1; transform: translateX(2px); }
  70% { opacity: 0.5; }
  100% { opacity: 1; filter: none; transform: none; }
}

/* idioma */
.experience-header__language {
  display: inline-flex; align-items: center; gap: 0.35rem;
  min-height: 2.5rem; padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-line);
  background: #0b0a0c;
  font-family: var(--font-code); font-size: 0.75rem; text-decoration: none;
}
.experience-header__lang-option { color: var(--color-line); }
.experience-header__lang-option[data-current="true"] { color: var(--color-ink); }
.experience-header__lang-sep { color: var(--color-line); }
.experience-header__language:hover .experience-header__lang-option:not([data-current="true"]),
.experience-header__language:focus-visible .experience-header__lang-option:not([data-current="true"]) { color: var(--color-accent-on-dark); }
.experience-header__language:focus-visible { outline: none; box-shadow: var(--focus-ring); }
```

Contraste: `var(--color-line)` (#433d3f) sobre fondo oscuro **no** llega a 4.5:1; solo se usa en elementos `aria-hidden` decorativos (números de canal inactivos, opción de idioma no actual, separadores). El label de cada enlace usa `--color-muted` (≥ 4.5:1). Si un test de contraste del repo mide estos spans, sube a `--color-muted` con `opacity`.

**Modo floating (OSD):** sustituye el bloque `[data-mode="floating"]`:
```css
.experience-header[data-mode="floating"] {
  max-width: 70rem;
  transform: translateY(0.5rem);
  border-color: rgb(216 137 141 / 25%);
  border-radius: 0;
  background:
    repeating-linear-gradient(to bottom, rgb(185 190 194 / 2%) 0 1px, transparent 1px 3px, rgb(0 0 0 / 14%) 3px 4px),
    rgb(13 12 14 / 82%);
  backdrop-filter: blur(6px);
  box-shadow: 0 0.875rem 2rem rgb(0 0 0 / 42%);
}
.experience-header[data-mode="floating"]::before,
.experience-header[data-mode="floating"]::after {
  position: absolute; width: 0.75rem; height: 0.75rem; content: ""; pointer-events: none;
  border: solid var(--color-accent-on-dark);
}
.experience-header[data-mode="floating"]::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.experience-header[data-mode="floating"]::after { right: -1px; bottom: -1px; border-width: 0 2px 2px 0; }
```
- Asegúrate de que `.experience-header` tiene `position: sticky` (ya lo tiene, sirve como contenedor de los absolutos).
- Añade `border-color` y `background` a la `transition` existente.
- Docked mantiene su aspecto de mueble TV (gradiente y `border-radius: 1rem 1rem 0 0`); solo cambian sus hijos.

### Tarea 7 — Responsive

**≤ breakpoint medio actual** (bloque `responsive.css` ~14–45):
- Fila 1: brand · OSD · idioma (`grid-template-columns: auto minmax(0, 1fr) auto`, OSD `justify-self: end`).
- Fila 2: nav a ancho completo, grid de 4 columnas (como ahora), `a { justify-content: center; }`.
- Elimina reglas de `.experience-header__contact`.

**≤ 480 px:**
- Oculta `.experience-header__rec` (deja solo punto + nombre).
- OSD: muestra solo `CH 02` (oculta el label con un span con clase `experience-header__osd-label` y `display: none`).
- Enlaces: número encima del label (`flex-direction: column; align-items: center; gap: 0`), `font-size: 0.625rem`, `letter-spacing: 0.02em`. Si algún label no cabe a 320 px ("TECNOLOGÍAS"), reduce `letter-spacing` a 0 y padding horizontal a 0.125rem; no trunques el texto.
- Comprueba 320 px sin overflow (test existente).

**Fuera de alcance de esta fase:** menú desplegable a pantalla completa en móvil (rompería la invariante de enlaces visibles en `mobile-chromium`).

### Tarea 8 — Altura y scroll

- Mide la altura del header docked antes y después. Si cambia, ajusta `scroll-margin-top: 5.5rem` (shell.css ~150) para que los títulos de sección no queden tapados al navegar, y revisa `min-height` del hero en `responsive.css:10` (`calc(100svh - 6.5rem)`) para que el test de `#profile` siga pasando.

### Tarea 9 — Reduced motion

En `motion.css` (bloque `prefers-reduced-motion: reduce`):
```css
.experience-header__rec-dot,
.experience-header__osd,
.experience-header__navigation a:hover .experience-header__channel-label { animation: none; }
```

### Tarea 10 — Tests

Añade `tests/header-channels.spec.ts` (o dentro de `portfolio-shell.spec.ts`, siguiendo la organización existente):

```ts
import { expect, test } from "@playwright/test";

test("marks the current channel while scrolling", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__osd")).toContainText("PERFIL");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ block: "start" }));
  await expect(page.locator(".experience-header__navigation a[href='#projects']")).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".experience-header__osd")).toContainText("Proyectos");
  await expect(page.locator(".experience-header__navigation a[aria-current]")).toHaveCount(1);
});

test("activates contact at the bottom of the page", async ({ page }) => {
  await page.goto("/es");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".experience-header__navigation a[href='#contact']")).toHaveAttribute("aria-current", "location");
});

test("channel numbers do not change link names", async ({ page }) => {
  await page.goto("/es");
  for (const name of ["Tecnologías", "Proyectos", "Formación", "Contacto"]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveCount(1);
  }
});

test("header no longer duplicates the contact button", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__contact")).toHaveCount(0);
});

test("language switch shows the current locale", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__lang-option[data-current='true']")).toHaveText("ES");
});
```
- `getByRole("link", { name: "Contacto", exact: true })` puede coincidir también con enlaces de otras secciones; si da > 1, limita con `page.locator(".experience-header").getByRole(...)`.
- Ajusta el texto del OSD esperado según cómo quede el marcado (mayúsculas por CSS no cambian el texto del DOM).

---

## 4. Verificación (obligatoria)

```bash
npm run typecheck
npm run lint
npm run test:content
npm run validate:content
npm run test:e2e
```

Capturas (Playwright) en `output/playwright/`:
- `header-docked-desktop-{es,en}.png` — 1440×900, scroll 0.
- `header-floating-desktop-es.png` — 1440×900, scroll en `#projects`.
- `header-mobile-es.png` — 375×812, y `header-mobile-320-es.png` — 320×760.

Checklist:
- [ ] Docked sigue encajando visualmente con el marco del hero (sin hueco ni desalineación).
- [ ] Números de canal, canal activo con LED/línea y OSD `CH 0N ▸ LABEL` que "sintoniza" al cambiar.
- [ ] Floating = barra OSD con scanlines y esquinas rosas, no cápsula redondeada.
- [ ] Sin botón Contactar duplicado; `ES|EN` con el actual iluminado.
- [ ] Navegación por teclado: focus ring visible en enlaces e idioma; Enter en Tecnologías sigue enfocando la sección y lanzando su glitch.
- [ ] 375 y 320 px sin overflow, enlaces legibles.
- [ ] Reduced motion: sin pulso, sin sintonía, sin glitch.

## 5. Entregable

Resumen con archivos modificados, resultado de cada comando (salida completa si algo falla), decisiones tomadas (ubicación de las claves i18n, ajuste de `scroll-margin-top`/hero, fallback de `#contact`) y rutas de capturas. Sin commit.

## 6. Fuera de alcance

- Menú de canales desplegable a pantalla completa en móvil (fase 2; requiere revisar los tests de `mobile-chromium`).
- Interacción cruzada proyecto ↔ tecnología.
- Cambios en hero, Tecnologías u otras secciones salvo los ajustes de altura de la Tarea 8.
