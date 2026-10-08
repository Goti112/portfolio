# Plan: pulido del header "panel de canales"

**Fecha:** 2026-10-08
**Ejecutor:** agente de código (Codex)
**Depende de:** `docs/superpowers/plans/2026-10-08-wired-header-channels-plan.md` (ya implementado)
**Objetivo:** corregir bugs visuales del header, hacer que el cambio de canal se sienta como un "zapping" único, mejorar legibilidad en móvil y unificar la estética de los módulos.

---

## 0. Reglas

1. Sin dependencias nuevas. TypeScript estricto, estilo existente (`React.JSX.Element`, props `readonly`, sin comentarios superfluos).
2. Archivos permitidos: `src/components/portfolio/ExperienceHeader.tsx`, `src/styles/shell.css` (bloque `.experience-header*`), `src/styles/responsive.css` (bloques `.experience-header*`), `src/styles/motion.css` (reduced motion), `src/content/types.ts`, `src/content/portfolio.{es,en}.ts` (solo `system.header`), `src/lib/content-validation.ts`, `scripts/test-content-validation.ts` si hace falta, `tests/header-channels.spec.ts`, `tests/portfolio-shell.spec.ts`, `tests/accessibility.spec.ts`.
3. Árbol de trabajo con cambios sin commitear: **nada de `git checkout`/`reset`/`stash`**; sin commit salvo petición.
4. Todo movimiento nuevo se desactiva con `prefers-reduced-motion: reduce`.

### Invariantes (tests existentes, no romper)

- Primer Tab → skip link `Saltar al contenido`; link con nombre exacto `Proyectos` visible y enfocable **también en `mobile-chromium`**.
- `getByRole("link", { name: "English" })` en `/es` (y `"Español"` en `/en`) con `href` `/en` / `/`.
- `.experience-header__navigation a` = 4 en orden `#capabilities, #projects, #education, #contact`.
- Foco en `a[href='#capabilities']` + Enter ⇒ `#capabilities` enfocado y glitch del título en marcha. **No** uses `preventDefault` en los enlaces.
- A 1440×900, `#profile` alto ≥ `900 − altura header − 1`.
- Sin overflow horizontal a 320 px.
- `tests/header-channels.spec.ts`: canal activo con `aria-current="location"`, Contacto activo al final de la página, OSD sin animación con reduced motion. Si un cambio de este plan altera lo que comprueban, actualiza el test **y explica por qué** en el resumen.

---

## Tarea 1 — BUG: marca y OSD pegados a 320 px

Captura actual: `MIQUEL MANZANOCH 00`.

- Añade `column-gap` real a la fila superior del header en los breakpoints móviles (`responsive.css`, bloques `.experience-header`), mínimo `0.75rem`.
- A ≤ 360 px, abrevia la marca visualmente: oculta `.experience-header__brand-name` y muestra un nuevo `<span className="experience-header__brand-short" aria-hidden="true">M. MANZANO</span>` (añádelo al marcado, `display: none` por defecto). El nombre accesible del enlace debe seguir siendo "Miquel Manzano": deja `.experience-header__brand-name` en el árbol de accesibilidad con la clase `sr-only` en ese breakpoint en lugar de `display: none` (aplica las propiedades de `sr-only` vía CSS o alterna clase).
- Ver también Tarea 6 (el OSD deja de mostrarse en modo docked, lo que libera espacio en la carga inicial).

**Verificación:** a 320 px, `brand.right + 8 <= osd.left` cuando el OSD es visible (test en Tarea 10).

---

## Tarea 2 — BUG: esquina superior cortada en modo floating

En `header-floating-desktop-es.png` la barra queda pegada al borde superior y la esquina rosa superior izquierda se corta, aunque `shell.css` declara `transform: translateY(0.5rem)`.

1. Diagnostica con DevTools/Playwright (`getComputedStyle(header).transform` y `getBoundingClientRect().top` con scroll > 48) qué lo anula: otra regla posterior en `responsive.css`/`motion.css`, la `transition` o `position: sticky` con `top: 0`.
2. Solución preferida: en floating usa `top: 0.5rem` (sticky) en lugar de `transform`, y elimina el `translateY`. Añade `top` a la `transition`. Si el header docked necesita `top: 0`, déjalo explícito.
3. Asegura que los pseudo-elementos de esquina (`::before` top −1px) quedan dentro del viewport.

**Verificación:** con scroll en `#projects` a 1440×900, `header.getBoundingClientRect().top >= 6` (test en Tarea 10).

---

## Tarea 3 — BUG: caja de canales desalineada verticalmente

En docked desktop, el texto de los canales queda ~4 px más alto que marca, OSD e idioma.

- En `.experience-header` asegúrate de `align-items: center`.
- Iguala la altura de los módulos con una variable: `--header-control-height: 2.5rem;` en `.experience-header`, y úsala como `height` (no `min-height`) en `.experience-header__navigation a`, `.experience-header__language` y `.experience-header__osd`. Si la `ul` tiene `border-block`, compénsalo (`box-sizing` o altura de los `a` = `calc(var(--header-control-height) - 2px)`) para que la caja exterior mida exactamente lo mismo que el selector de idioma.
- Centra el contenido de los enlaces con `align-items: center` (no `baseline`); alinea número y label por baseline con un wrapper interno si hace falta.

**Verificación:** a 1440 px, los centros verticales de `.experience-header__navigation`, `.experience-header__brand`, `.experience-header__language` difieren ≤ 1 px (test en Tarea 10).

---

## Tarea 4 — BUG: falta espacio tras la flecha del OSD

`CH 00 ▸PERFIL` → `CH 00 ▸ PERFIL`.
```css
.experience-header__osd-arrow { margin-inline: 0.15em 0.4em; }
```
Revisa que el espacio entre `CH 00` y `▸` también sea uno solo visualmente (el texto ya incluye un espacio final).

---

## Tarea 5 — Zapping sin parpadeo al hacer clic

Problema: al pulsar `04 CONTACTO` desde arriba, el scroll suave atraviesa 01→02→03→04 y el OSD re-sintoniza en cada paso.

En `ExperienceHeader.tsx`:
1. Añade un ref `lockedTargetRef = useRef<NavigationItem["target"] | null>(null)` y un ref de timeout.
2. `onClick` de cada enlace de canal (sin `preventDefault`): `lockedTargetRef.current = item.target; setActiveTarget(item.target);` y programa la liberación.
3. Liberación: escucha `scrollend` en `window` si existe (`"onscrollend" in window`); como respaldo, `setTimeout` de 900 ms reiniciado en cada evento `scroll` mientras haya bloqueo. Al liberar, `lockedTargetRef.current = null` y recalcula el activo con los datos actuales del observer.
4. Mientras `lockedTargetRef.current !== null`, el observer y el handler de scroll **actualizan sus mapas pero no llaman a `setActiveTarget`**.
5. El skip link y el enlace de la marca (`#profile`) también bloquean (la marca a `null`).
6. Limpia timeouts y listeners en el cleanup del efecto.

**Resultado esperado:** un único cambio `CH 01 → CH 04` con una sola animación de sintonía.

---

## Tarea 6 — OSD: sin animación al cargar y oculto en docked

**6.1 Primera carga.** El `key` del `<p>` hace que `header-tune` corra al montar. Sustituye el `key` por un estado de "sintonía":
- `const [tuning, setTuning] = useState(false);` y un ref con el target anterior.
- En un `useEffect` sobre `activeTarget`: si el anterior no es el valor inicial de montaje y cambió, `setTuning(true)`; quita `tuning` en `onAnimationEnd` del `<p>`.
- CSS: la animación solo se aplica con `.experience-header__osd[data-tuning="true"]`.
- Elimina el `key`.

**6.2 Docked.** Decisión: en modo docked (parte superior del televisor, sobre el hero) el OSD no aporta (`CH 00 ▸ PERFIL` dice "estás arriba"). Ocúltalo visualmente en docked y muéstralo en floating:
```css
.experience-header[data-mode="docked"] .experience-header__osd { visibility: hidden; }
```
- Usa `visibility: hidden` (no `display: none`) para que no salte el layout al pasar a floating; añade `transition: visibility 0s, opacity 200ms` con `opacity` 0→1 para que aparezca suavemente.
- Excepción: si en docked el canal activo **no** es `null` (p. ej. recarga con `#projects` y scroll < 48 px, caso raro), muéstralo igualmente: `[data-mode="docked"] .experience-header__osd[data-channel="0"]` en lugar del selector genérico.
- Actualiza `tests/header-channels.spec.ts`: el test que espera `PERFIL` al cargar debe comprobar ahora que el OSD está oculto en docked (`toBeHidden()`) y, tras hacer scroll > 48 px sin llegar a otra sección, que es visible con `PERFIL`. Si con el `rootMargin` actual no hay ningún punto entre 48 px y la primera sección en el que el activo sea `null`, prueba solo la ocultación en docked.

---

## Tarea 7 — Legibilidad de canales y estado activo

**7.1 Números de canal.** `--color-line` + 0.625rem es casi invisible.
```css
.experience-header__channel-number { color: var(--color-muted); opacity: 0.55; font-size: 0.6875rem; }
.experience-header__navigation a:hover .experience-header__channel-number,
.experience-header__navigation a:focus-visible .experience-header__channel-number,
.experience-header__navigation a[aria-current] .experience-header__channel-number { color: var(--color-accent-on-dark); opacity: 1; }
```

**7.2 Activo en móvil.** En la tira de 4 canales móvil el activo apenas se distingue. En los breakpoints móviles:
```css
.experience-header__navigation a[aria-current] { background: rgb(166 83 87 / 16%); }
.experience-header__navigation a[aria-current]::after { right: 0.375rem; left: 0.375rem; }
```
Comprueba que la línea `::after` no queda recortada por `overflow` de la `ul`.

**7.3 Tamaños táctiles en móvil.** En `≤ 480 px`:
- `.experience-header__navigation a { min-height: 2.75rem; font-size: 0.6875rem; }` (usa `min-height` aquí, sobrescribiendo el `height` fijo de la Tarea 3).
- `.experience-header__language { min-height: 2.75rem; min-width: 2.75rem; }`.
- Re-verifica 320 px sin overflow; si `TECNOLOGÍAS` no cabe, baja `letter-spacing` a 0 antes que la fuente.

---

## Tarea 8 — Módulos unificados y textura OSD

**8.1 Un mismo lenguaje para los tres módulos** (nav, OSD, idioma):
- Mismo borde: `1px solid var(--color-line)`, sin `border-radius` (coherente con paneles de Tecnologías), mismo fondo `rgb(11 10 12 / 80%)`.
- Separadores internos: discontinuos (`dashed`) tanto entre canales como el `|` del idioma (puede sustituirse por un `border-left: 1px dashed` en la segunda opción y eliminar `.experience-header__lang-sep`; si lo eliminas, actualiza los tests que lo referencien).
- OSD sin caja propia es aceptable si queda mejor; decide visualmente y explica en el resumen. Lo importante es que nav e idioma compartan borde, fondo y altura.

**8.2 Textura en floating.** Añade ruido estático muy tenue sobre la barra flotante:
```css
.experience-header[data-mode="floating"] {
  background:
    url("/signal-noise.svg") repeat,
    repeating-linear-gradient(to bottom, rgb(185 190 194 / 2%) 0 1px, transparent 1px 3px, rgb(0 0 0 / 14%) 3px 4px),
    rgb(13 12 14 / 82%);
  background-size: 120px 120px, auto, auto;
  background-blend-mode: soft-light, normal, normal;
}
```
Usa el SVG **estático** (`/signal-noise.svg`, no `-live`). Si el blend no se nota o ensucia el texto, sustituye por una capa `::before` adicional no es posible (ya se usan `::before/::after` para esquinas) → usa la capa de background con `opacity` simulada vía un color con alfa encima. Objetivo visual: ~4 % de grano perceptible, texto intacto.

---

## Tarea 9 — Limpieza de código

**9.1 Lógica del canal activo.** Simplifica el efecto:
- El observer solo actualiza `visible` (Map target → ratio) y llama a `commit()`.
- El handler de scroll actualiza `mode` y llama a `commit()`.
- `commit()`: si hay bloqueo (Tarea 5) → return; si `isAtBottom()` → `"contact"`; si no → el target con mayor ratio > 0 o `null`.
- Elimina `wasAtBottom` y el cálculo manual de solapamiento. Si al subir desde el fondo el observer no ha emitido aún entradas nuevas y el activo se queda en `contact`, resuélvelo recalculando `visible` con `getBoundingClientRect` dentro de `commit()` **solo** cuando se sale del fondo (una función pequeña `measureVisible()`), no duplicando lógica en dos sitios.
- Mantén el fallback sin `IntersectionObserver` (el handler de scroll usa `measureVisible()`).

**9.2 Textos hardcodeados.** Mueve `navigationLabel` y `skipLabel` a `content.system.header` (`navigationLabel`, `skipLabel`) en `types.ts` y ambos contenidos, con `assertNonEmpty` en `content-validation.ts`. Valores actuales: ES `"Navegación principal"`, `"Saltar al contenido"`; EN `"Main navigation"`, `"Skip to content"`. Si `targetLabel` (`"English"/"Español"`) también puede moverse sin romper tests, hazlo (`languageTargetLabel`).

---

## Tarea 10 — Tests

Añade a `tests/header-channels.spec.ts`:

```ts
test("keeps brand and channel display apart at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/es");
  await page.evaluate(() => window.scrollTo(0, 400));
  const osd = page.locator(".experience-header__osd");
  await expect(osd).toBeVisible();
  const [brand, display] = await Promise.all([
    page.locator(".experience-header__brand").boundingBox(),
    osd.boundingBox(),
  ]);
  expect(brand && display && brand.x + brand.width + 8 <= display.x).toBe(true);
});

test("floating header keeps a gap from the viewport top", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView());
  await expect(page.locator(".experience-header")).toHaveAttribute("data-mode", "floating");
  const top = await page.locator(".experience-header").evaluate((header) => header.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(6);
});

test("aligns header modules vertically", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  const centers = await page.locator(".experience-header").evaluate((header) =>
    [".experience-header__navigation", ".experience-header__brand", ".experience-header__language"].map((selector) => {
      const box = header.querySelector(selector)!.getBoundingClientRect();
      return box.top + box.height / 2;
    }),
  );
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(1);
});

test("clicking a distant channel tunes the display only once", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/es");
  await page.evaluate(() => {
    const seen: string[] = [];
    (window as unknown as { __osdLabels: string[] }).__osdLabels = seen;
    const osd = document.querySelector(".experience-header__osd")!;
    new MutationObserver(() => seen.push(osd.textContent ?? "")).observe(osd, { subtree: true, childList: true, characterData: true });
  });
  await page.locator(".experience-header__navigation a[href='#contact']").click();
  await expect(page.locator(".experience-header__navigation a[href='#contact']")).toHaveAttribute("aria-current", "location");
  await page.waitForTimeout(1200);
  const labels = await page.evaluate(() => (window as unknown as { __osdLabels: string[] }).__osdLabels);
  expect(labels.some((label) => /Proyectos|Formación/.test(label))).toBe(false);
});

test("does not tune the display on first load", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".experience-header__osd")).not.toHaveAttribute("data-tuning", "true");
});
```
- Ajusta los selectores/estructuras si la implementación difiere, manteniendo la intención de cada test.
- Actualiza los tests existentes afectados por la Tarea 6.2 (PERFIL en docked) y 8.1 (separador de idioma).

---

## Verificación (obligatoria)

```bash
npm run typecheck
npm run lint
npm run test:content
npm run validate:content
npm run test:e2e
```

Regenera capturas en `output/playwright/` (sobrescribe): `header-docked-desktop-{es,en}.png`, `header-floating-desktop-es.png`, `header-mobile-es.png`, `header-mobile-320-es.png`, y añade `header-floating-mobile-es.png` (375×812 con scroll en `#projects`).

Checklist:
- [ ] 320 px: marca y OSD separados; nada se solapa.
- [ ] Floating despegado del borde superior; ambas esquinas rosas completas.
- [ ] Nav, marca e idioma centrados en la misma línea; nav e idioma con misma altura, borde y fondo.
- [ ] `CH 02 ▸ PROYECTOS` con espacios correctos.
- [ ] Clic en un canal lejano = una sola sintonía; nada anima al cargar.
- [ ] OSD oculto en docked, aparece suave al flotar.
- [ ] Números de canal legibles; activo claro también en móvil; objetivos táctiles ≥ 44 px en móvil.
- [ ] Grano sutil en floating sin perder legibilidad.
- [ ] Reduced motion: sin pulso, sin sintonía, sin glitch, sin transición de opacidad del OSD.

## Entregable

Resumen con archivos modificados, resultado de cada comando (salida si algo falla), causa encontrada en la Tarea 2, decisiones visuales (Tarea 8.1 OSD con o sin caja; blend de la 8.2), tests modificados y por qué, y rutas de capturas. Sin commit.

## Fuera de alcance

- Menú de canales desplegable a pantalla completa en móvil.
- Cambios en hero, Tecnologías u otras secciones.
