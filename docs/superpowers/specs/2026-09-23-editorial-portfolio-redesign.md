# Editorial portfolio redesign

## Purpose

This portfolio is primarily for recruiters. A visitor should quickly understand who Miquel Manzano is, what applications he has built, and how to contact him. The site should stay distinctive and enjoyable while becoming compact, professional, and easy to scan.

The current page uses full-screen scenes, forensic language, scan effects, a progress counter, and a long pinned project presentation. The new page uses a light editorial layout with purposeful motion. English and Spanish routes present equivalent information.

## Success criteria

- The first screen identifies Miquel as an application developer, explains his work plainly, and exposes project and contact actions.
- All three projects can be understood from visible names, descriptions, technologies, visuals, and repository states without depending on animation.
- The document is shorter than the current full-viewport sequence and uses normal scroll on desktop and mobile.
- Motion gives the portfolio character without delaying or hiding its content.
- The page works with JavaScript unavailable, reduced motion, keyboard navigation, and narrow screens.

## Page structure

1. A compact header contains the name, links to projects, capabilities, education, and contact, a language switch, and a contact action. On mobile it wraps into a short layout.
2. The introduction contains one main heading, the application-developer role, one concise factual sentence, and actions to view projects or start an email. It takes only the height its content needs.
3. Three editorial project rows follow immediately: QGC Planner, BorderPass AI, and Ticket OCR Scanner, in the existing order. Each row pairs an informative visual with a plain-language description, key technologies, and the existing repository link or explicit pending state. The rows remain in normal document flow.
4. A concise capabilities section groups the existing skills by purpose.
5. Education presents SMX, DAW, and DAM as a compact list or timeline with dates and the current in-progress state.
6. A final contact section repeats the email action and links to GitHub.

Profile information lives in the introduction; it does not need another full-screen section. Navigation targets point to visible sections.

## Visual design

Use a warm off-white canvas, dark graphite text, restrained borders, controlled whitespace, and one red accent derived from the current identity. Archivo remains the primary typeface. Monospaced type is limited to technical labels. Headlines are bold and legible; body copy uses natural sentence case.

Project visuals remain a distinctive part of the portfolio. Rework the existing QGC route, BorderPass workflow, and Ticket OCR extraction compositions into clean editorial diagrams that explain the products. They must not be presented as real screenshots or embellished with device frames. Each diagram is readable at a glance and subordinate to the factual project description. Real screenshots may replace a diagram later when available, but are not required here.

On desktop each project row places its visual beside its copy. On mobile the visual precedes the copy. Names, descriptions, and actions are never hidden behind tabs, hover, or a sticky preview stage.

## Motion

Use the GSAP dependency already installed. Replace the current scene choreography with:

- A brief entrance for the introduction's heading, supporting text, and actions.
- One-time reveals for section headings and project rows as they enter view.
- Subtle project-specific movement within each diagram: a route line for QGC, a decision path for BorderPass, and structured extraction for Ticket OCR.
- Small hover and focus responses on project and contact links.

Remove scroll pinning, long scrubbed timelines, the scene counter, evidence lens, scan overlays, and corruption effects. Anchor navigation and normal scrolling work independently of GSAP. Static content is the default state. Reduced-motion users receive the complete static page without animated transitions.

## Content and implementation

Keep the existing locale-specific content modules and destination definitions as the source of truth. Rewrite theatrical labels and headlines into direct language in both locales. Preserve verified project names, technologies, descriptions, education records, email, GitHub destination, and published or pending repository states. Do not invent employment claims, impact metrics, features, or screenshots.

The English and Spanish Next.js routes continue to render a shared portfolio page. Refactor existing React sections and CSS for the new hierarchy. Motion units each have one clear purpose and clean up their triggers. Update content types and validation only where the structure requires it. Add no backend, service, or package.

The working tree contains uncommitted changes in content, layout, styles, and motion. Implementation builds on that state and preserves unrelated edits. The earlier device-mockup plan is outside this redesign.

## Accessibility, failure behavior, and performance

Use one primary heading, semantic sections, descriptive links, visible focus, and sufficient contrast. Every project detail and action is reachable without animation or pointer input. A pending destination remains clearly labeled and non-interactive; a published destination retains its direct link. Motion initialization failures leave the content visible and report the specific cause. Avoid large decorative media, layout shifts, and narrow-screen overflow.

## Review and validation

Review English and Spanish pages at desktop and mobile widths for hierarchy, readability, project comprehension, link states, keyboard focus, and reduced motion. After implementation run the relevant existing content validation, lint, typecheck, build, and focused browser checks. Visual review should confirm that the page retains its character while the primary information remains easy to find.
