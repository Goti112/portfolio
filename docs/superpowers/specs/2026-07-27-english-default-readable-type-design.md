# English-First Portfolio and Readable Display Type

## Status

Approved design for making English the portfolio's primary language and reducing the display typography so the portfolio remains experimental but easier to read.

## Product outcome

The portfolio should present Miquel's work first in English for an international hiring audience while preserving a complete Spanish version. The site must feel deliberate and high-impact without requiring visitors to decode oversized headings before they can read the content.

## Language routing

- `/` renders the complete English portfolio with `lang="en"`, English metadata, and canonical URL `/`.
- `/es` renders the complete Spanish portfolio with `lang="es"`, Spanish metadata, and canonical URL `/es`.
- `/en` remains an English compatibility route with canonical URL `/`. The site is statically exported, so it serves the English document directly rather than relying on a server redirect.
- The language control remains visible and reciprocal: English routes link to `/es`; Spanish links to `/`.
- Every locale retains its own title, description, navigation labels, skip-link label, and localized content. No content is translated at runtime.
- Existing direct anchors continue to resolve on `/`, `/es`, and `/en`.

## Typography direction

The four narrative display headings remain the visual anchors:

- Intro challenge.
- Execution claim.
- Method heading.
- Verdict.

Their shared desktop scale changes from `clamp(3.25rem, 10vw, 10rem)` to `clamp(2.75rem, 7.5vw, 7rem)`. Their shared mobile scale changes from `clamp(2.75rem, 15vw, 4.5rem)` to `clamp(2.4rem, 11vw, 3.75rem)`.

Project and section display headings are also reduced one tier so they reinforce hierarchy without competing with reading:

- Primary project heading: maximum `6rem` to `4.75rem`.
- Project-case name: maximum `4rem` to `3.25rem`.
- Experiment section heading: maximum `4rem` to `3.25rem`.
- Experiment card name: maximum `2.25rem` to `2rem`.
- Mobile project heading: maximum `4rem` to `3.5rem`.

Body copy, technical labels, navigation, actions, card spacing, color system, and motion timings remain unchanged. The typography remains uppercase, dense, and editorial; only its visual dominance is reduced.

## Architecture

Move the English portfolio page and layout to the root route. Move the Spanish portfolio page and layout to an explicit `/es` route. Keep `/en` as a small English compatibility route sharing the same content and metadata intent as `/`.

Retain `PortfolioPage`, `getPortfolioContent`, and the existing locale content records. Route components select `"en"` or `"es"`; they do not duplicate portfolio data.

Use the existing grouped stylesheet structure. Update the shared display-heading rules in `sections.css`, the affected preview rules in `previews.css`, and their mobile overrides in `responsive.css`. Do not introduce a new typeface, sizing utility, or animation behavior.

## Accessibility and SEO

- Set the correct document language on each route.
- Keep reciprocal language links and add canonical/language alternate metadata for `/`, `/es`, and `/en`.
- Preserve a single visible `h1` and all existing semantic landmarks per route.
- Ensure long English headings remain visible without horizontal document overflow at desktop and mobile widths.
- Keep the Spanish route fully usable rather than treating it as a translation fallback.

## Validation

Update browser coverage so it verifies:

- `/` is English, exposes the English navigation, and links to `/es`.
- `/es` is Spanish, exposes the Spanish navigation, and links to `/`.
- `/en` remains English and canonicalizes to `/`.
- Direct anchors and both language variants still render all narrative scenes.
- The approved desktop and mobile display-size caps are present in computed styles.
- No horizontal overflow appears on desktop or mobile.
- Existing content validation, linting, strict types, build, Playwright, accessibility, and Lighthouse assertions continue to pass.

## Acceptance criteria

- A first-time visitor at `/` sees an English portfolio.
- Spanish is available at `/es` through the language control.
- Existing `/en` links still show English content.
- All four monumental headings stay recognizably editorial but no longer dominate the viewport excessively.
- Headings, project names, and experiment labels are comfortably readable at desktop and mobile widths.
- Language metadata, navigation, anchors, reduced-motion behavior, keyboard navigation, and performance budgets remain correct.

## Out of scope

- Rewriting portfolio copy, project descriptions, or professional positioning.
- Removing Spanish or adding additional languages.
- Changing animation choreography, card layouts, colors, or font families.
- Adding runtime locale detection, cookies, CMS content, or a server-side redirect layer.
