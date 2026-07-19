# PROOF → EXECUTION GSAP Portfolio Remodel

## Status

Approved design for the bilingual Miquel Manzano portfolio remodel.

## Product outcome

Transform the existing portfolio from a strong static editorial page into an experimental digital experience that remains useful as a hiring artifact.

The visitor must leave with one clear professional impression:

> Miquel turns complex problems into working products. He has technical judgment, learns quickly, and can take an uncertain idea through to a functional result.

Animation is evidence of product and systems thinking, not the product itself. The experience succeeds only when a recruiter or technical reviewer can understand the positioning, inspect the work, navigate every section, and contact Miquel without learning a custom interface.

## Approved concept

The approved narrative is **PROOF → EXECUTION**.

The page does not ask the visitor to trust a list of claims. It builds a case for hiring Miquel by transforming each claim into evidence:

1. A complex or uncertain problem appears.
2. The interface exposes how Miquel questions and models it.
3. Capabilities assemble into a working system.
4. Projects provide concrete proof.
5. Secondary work demonstrates range.
6. The evidence resolves into readiness to build the next product.

The visual mechanism comes from **THE BUILD IS THE CV**: fragments move, connect, change function, and become finished systems. The existing `UNKNOWN_SESSION` idea is no longer the central narrative. Its strongest traits survive only as restrained signal language in the opening and short moments of interference.

Approved Spanish anchor messages:

- `NO CONFÍES EN LO QUE DIGO. INSPECCIONA EL TRABAJO.`
- `CONVIERTO PROBLEMAS COMPLEJOS EN PRODUCTOS QUE FUNCIONAN.`
- `PREGUNTAR → MODELAR → CONSTRUIR → LLEVAR A PRODUCCIÓN.`
- `PREPARADO PARA CONSTRUIR LO SIGUIENTE.`

Approved English equivalents:

- `DON'T TRUST THE CLAIM. INSPECT THE WORK.`
- `I TURN COMPLEX PROBLEMS INTO WORKING PRODUCTS.`
- `QUESTION → MODEL → BUILD → SHIP.`
- `READY TO BUILD THE NEXT ONE.`

These messages may receive line breaks appropriate to each locale, but their meaning must not change.

## Design principles

### Hiring clarity before spectacle

The opening viewport must still identify Miquel Manzano as a full-stack developer. Experimental sequencing may create tension, but it must not delay identity, role, navigation, or access to projects.

### One continuous argument

Sections must feel like stages of the same proof rather than separate cards stacked down a page. Repeated decorative reveals are not sufficient. Important elements should persist, migrate, assemble, or resolve across scene boundaries.

### Experimental, not obstructive

Pinned scenes, SplitText, Flip transitions, and spatial composition are allowed. Scroll hijacking, mandatory commands, hidden essential content, internal scroll traps, and interaction-only disclosures are not allowed.

### Motion with ownership

GSAP owns narrative choreography. CSS owns layout, final readable states, focus, color, and small state transitions. The two systems must not animate the same property on the same element concurrently.

### Factual evidence only

The remodel must not invent project metrics, personal contributions, implementation details, outcomes, or repository availability. The confirmed content and explicit pending destinations remain authoritative.

## Experience narrative

### Scene 1: Cold open

The page opens on a dark field with Miquel's name and full-stack role visible. A restrained evidence window and a single scanning signal create tension. The challenge `DON'T TRUST THE CLAIM. INSPECT THE WORK.` becomes the first dominant statement.

The scene may pin briefly on desktop. It must not require scroll to identify the portfolio owner or reach navigation.

### Scene 2: Positioning

Fragments representing uncertainty reorganize into the professional promise: Miquel turns complex problems into working products. This is the primary Flip transition and the conceptual handoff from atmosphere to professional value.

### Scene 3: Method

The palette inverts once, from black to aged bone. Four stages assemble on a visible technical canvas:

1. Question.
2. Model.
3. Build.
4. Ship.

Capabilities are assigned to these stages instead of presented as an undifferentiated skills inventory. Education appears inside this evidence of progression while retaining a direct `#education` destination.

### Scene 4: Primary evidence

QGC Planner, BorderPass AI, and Ticket OCR Scanner each receive a full case scene. The text remains semantic and readable while the relevant preview owns the visual stage.

Each case presents only:

- Confirmed problem or product purpose.
- Confirmed summary.
- Confirmed technologies.
- Explicit repository state.

The three cases remain in their current order.

### Scene 5: Range montage

Web Game, Roblox Game, and AI Wrapped appear as a short, faster montage. They demonstrate curiosity and breadth without competing with primary evidence. No unconfirmed descriptions are added.

### Scene 6: Verdict

Decorative proof fragments converge into `READY TO BUILD THE NEXT ONE.` The confirmed availability statement, email action, GitHub action, and language navigation remain clear. Pending destinations continue to render as disabled states rather than broken anchors.

## Visual system

### Palette

Retain the current core palette:

- Near-black void as the dominant field.
- Aged bone for primary text and the single method-scene inversion.
- Oxidized red for action, proof, state change, and brief interference.
- Muted warm gray for supporting evidence.

Red must not become a general decoration color. The bone inversion happens only once so that it functions as a narrative event.

### Typography

Retain self-hosted Archivo Variable and JetBrains Mono. Do not add another type family.

Archivo handles monumental statements and case titles. JetBrains Mono handles evidence labels, states, technical relationships, destinations, and navigation. SplitText is limited to selected display headings.

### Composition

Desktop compositions use large negative space, asymmetric alignment, oversized type, restrained borders, and technical canvases. Mobile preserves the same hierarchy through vertical composition rather than shrinking the desktop stage.

The global decorative forensic cursor is removed. A scoped evidence lens may appear only over project previews on fine-pointer devices. It cannot reveal essential information and is absent on touch and reduced-motion experiences.

### Project previews

Existing preview concepts remain valid but receive stronger visual scale and scene-specific microanimation:

- QGC Planner: mission route assembly.
- BorderPass AI: decision path and document state.
- Ticket OCR Scanner: scan and structured output recovery.

Their component boundaries must continue to allow later replacement with real screenshots or video without rewriting the project scene.

## Component architecture

Server-rendered components own content and semantics:

- `ExperienceHeader` — primary navigation, locale switch, and scene progress.
- `ProofIntro` — name, role, availability, and opening challenge.
- `ExecutionClaim` — professional positioning.
- `BuildMethod` — method stages, capabilities, and formation evidence.
- `ProjectEvidence` — semantic container for primary cases.
- `ProjectCaseScene` — shared case composition.
- `ExperimentMontage` — secondary work.
- `FormationTrace` — formation details integrated into the method scene.
- `ProofVerdict` — conclusion, availability, and destinations.
- `EvidenceLens` — optional decorative fine-pointer layer.

One client component owns motion:

- `MotionExperience` — initializes the GSAP scene registry and owns cleanup.

`PortfolioPage` renders the complete localized semantic document first. Presentation components expose explicit DOM contracts such as `data-scene="method"`, `data-motion-heading`, and `data-project-case="qgc-planner"`. Motion functions query only inside the portfolio root.

The remodel replaces the standalone `src/browser/portfolio-effects.ts` runtime and generic CSS view-timeline reveals. The `build:browser` step may be removed only after confirming that no other browser entry consumes it. The custom static server remains independently evaluated because it also provides compressed export hosting.

## Motion architecture

Restore `gsap` and `@gsap/react` as project dependencies. Use only GSAP core, `ScrollTrigger`, `SplitText`, and `Flip`. Do not add ScrollSmoother, Three.js, WebGL, or another animation library.

`MotionExperience` uses `useGSAP()` with a scoped root reference. The motion implementation is divided into single-purpose scene factories:

- `createIntroScene`
- `createExecutionClaimScene`
- `createBuildMethodScene`
- `createProjectEvidenceScene`
- `createExperimentMontageScene`
- `createVerdictScene`
- `createEvidenceLens`

An orchestrator creates them in document order and returns cleanup through the GSAP context. Scene factories receive resolved elements and return GSAP animations or explicit cleanup functions. They do not read localized content or mutate React state.

Use `gsap.matchMedia()` for three explicit conditions:

- Desktop experience at `min-width: 960px` without reduced motion.
- Compact experience below `960px` without reduced motion.
- Reduced-motion experience at any width.

Use `ScrollTrigger.refresh()` after fonts and preview geometry are stable. SplitText uses responsive re-splitting for line-based headings. Flip transitions restore inline state on cleanup.

Official implementation references:

- [GSAP official AI skills](https://github.com/greensock/gsap-skills)
- [GSAP React integration](https://github.com/greensock/react)
- [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Flip documentation](https://gsap.com/docs/v3/Plugins/Flip/)

## Scene choreography

The experience may use no more than three pinned sequences:

1. Cold open.
2. Build method.
3. Primary project evidence.

Scroll remains native. No feature changes its speed or direction, and no mandatory snap is introduced.

### Desktop

- The cold open pins briefly while the challenge and evidence window resolve.
- Positioning fragments reorganize with Flip in natural document flow.
- The method scene pins while four stages assemble and SVG connectors draw.
- Primary evidence uses one controlled stage. Semantic case text advances naturally while the preview composition transitions between cases.
- The experiment montage translates horizontally for a short scrubbed sequence without directional scroll hijacking.
- The verdict resolves in document flow.

### Mobile

- The opening sequence is compressed and does not use a prolonged pin.
- The method stages stack vertically.
- Project cases render as independent vertical sections without a shared pinned stage.
- Experiments render as a native vertical list or touch-scrollable strip.
- The evidence lens is absent.

### Reduced motion

- No pinning, scrub, parallax, animated SplitText, animated Flip, scanning line, glitch, or pointer tracking.
- All content appears in its final semantic order.
- Decorative duplicates are removed or hidden.
- Navigation and direct anchors behave normally.

### Motion constraints

- Scrubbed animations use linear easing.
- Discrete timelines use short cinematic easing.
- Glitches last between 120 and 250 milliseconds and never loop continuously.
- Prefer `x`, `y`, `scale`, `rotation`, `autoAlpha`, restrained `clip-path`, SVG stroke progress, and CSS variables.
- Do not animate layout properties, large blur filters, or large shadow fields per frame.
- Pause preview microanimations when their case is inactive.
- Do not apply hidden initial states until `MotionExperience` has initialized successfully.

## Content model and data flow

The data flow remains unidirectional:

`portfolio.es.ts / portfolio.en.ts → PortfolioPage → semantic components → scoped motion contracts`

The strict `PortfolioContent` model is expanded to hold the approved challenge, professional claim, four method stages, scene labels, and verdict in both locales. Motion durations, easings, selectors, and plugin configuration do not belong in localized content.

Retain:

- `PrimaryProjectId` and its exhaustive three-project union.
- `ExternalDestination` and explicit pending/published states.
- Strict tuple constraints where a fixed number of narrative lines or stages is required.
- Exhaustive `Record<PrimaryProjectId, PreviewComponent>` mapping.
- Build-time bilingual content validation.

Remove narrative copy tied exclusively to the deprecated unknown-session concept after its replacements exist in both locales and tests have been updated.

No backend, CMS, runtime content API, analytics service, or form submission is added.

## Error handling

Create a specific `MotionContractError` containing the scene name, missing selector, and current route when a required scene contract cannot be resolved.

Do not add catch-all handlers or silently skip required scenes. Development and browser tests must surface contract failures directly. Optional effects such as the evidence lens are created only when their declared media conditions match; within a matching condition, missing required elements are errors.

Semantic content does not depend on motion initialization. A GSAP load or runtime failure leaves the server-rendered final composition available rather than an intentionally hidden page.

`useGSAP` and scene cleanup must revert timelines, ScrollTriggers, SplitText instances, Flip inline state, media-query contexts, and pointer listeners.

## Accessibility

- Preserve one visible `h1` naming Miquel Manzano.
- Preserve semantic landmarks and direct anchors for `profile`, `capabilities`, `projects`, `education`, and `contact`.
- Preserve the keyboard skip path and visible focus styles.
- Do not apply `aria-hidden` to essential narrative sections or project content.
- Hide visual duplicates, scan layers, connectors, and the evidence lens from assistive technology.
- Ensure pinned scenes do not trap focus or create internal scrolling regions.
- Ensure SplitText maintains a complete accessible name and is not applied across interactive descendants.
- Keep language metadata and reciprocal locale links correct.
- Keep touch content independent of hover.

## Performance budgets

Retain the existing Lighthouse assertions for both locales:

- Largest Contentful Paint no greater than 2.5 seconds.
- Cumulative Layout Shift no greater than 0.1.

Import GSAP and plugins only through the client motion boundary. Avoid video backgrounds, canvas, WebGL, smooth-scroll layers, and unbounded always-running animations. Keep a maximum of three pinned sequences and pause inactive preview motion.

The full desktop experience must remain smooth on a representative mid-range laptop. Mobile deliberately reduces simultaneous transforms, depth, and pinning rather than relying on device failure to degrade the experience.

## Validation strategy

Use the repository's existing integration-first strategy:

- Content validation for Spanish and English.
- ESLint.
- Strict TypeScript checking.
- Static Next.js production build.
- Playwright desktop and mobile navigation flows.
- Direct-anchor and locale-switch verification.
- Scene-contract verification for all six narrative stages.
- Observable pinning and project-stage behavior in a real browser.
- Keyboard-only navigation.
- Axe analysis before scrolling, within pinned scenes, and after the project stage.
- Dedicated reduced-motion flow.
- Dedicated JavaScript-disabled flow proving that the full argument and all projects remain available.
- Lighthouse on `/` and `/en`.
- Manual visual review at desktop, tablet, and mobile widths.

Do not add unit tests for GSAP internals, exact timeline implementation, or coverage targets. Tests assert visible behavior and accessibility contracts.

## Acceptance criteria

The remodel is complete when all of the following are true:

- The opening viewport identifies Miquel and communicates the inspect-the-work premise.
- The visitor can understand the complex-problem-to-working-product positioning without relying on animation.
- The four-stage method is clear in both locales.
- All three primary projects remain factual, ordered, readable, and visually distinct.
- Secondary experiments remain subordinate and contain no invented descriptions.
- The verdict provides the confirmed availability and explicit destination states.
- Desktop uses no more than three pinned sequences.
- Mobile contains no prolonged pinning or horizontal page overflow.
- Reduced motion and JavaScript-disabled experiences expose all essential content.
- Keyboard navigation, language navigation, axe checks, strict types, build, Playwright, and Lighthouse budgets pass.
- Motion resources clean up without stale ScrollTriggers, duplicated SplitText wrappers, or retained pointer listeners.

## Out of scope

- New project facts, metrics, screenshots, or videos not supplied by Miquel.
- Publishing currently pending repository, email, or GitHub destinations.
- Contact form, backend, database, CMS, or analytics.
- WebGL, Three.js, Canvas scenes, ScrollSmoother, or another animation library.
- Audio, autoplay media, scroll-direction hijacking, or mandatory snap navigation.
- A generic animation playground unrelated to the hiring argument.
