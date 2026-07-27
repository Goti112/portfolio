# Experiment Montage Horizontal Scroll

## Status

Approved design for restoring and strengthening the horizontal movement of the three secondary-project cards in the `ARCHIVOS SECUNDARIOS` / `SECONDARY FILES` section.

## Product outcome

Reintroduce the memorable horizontal traversal of the three experiment cards while preserving the portfolio's native vertical scroll, accessibility, and hiring clarity.

The sequence should feel like a compact digital exhibit inside the larger portfolio:

1. The section enters naturally.
2. Its visual stage stays fixed on desktop.
3. Vertical scroll advances the three cards horizontally.
4. Each card becomes the temporary focus when it reaches the center.
5. The third card is shown completely before the page continues to the verdict.

The effect exists to demonstrate range and experimental craft. It must remain subordinate to the primary project evidence and must not hide, truncate, or delay access to any experiment.

## Current problem

The current desktop scene creates a scrubbed horizontal tween but does not pin the section. Its ScrollTrigger range is derived from the section's vertical bounds rather than from the strip's real horizontal overflow.

In the running page, the strip remains at its initial position and the third card stays clipped. The markup and experiment content are still valid; the motion choreography is the part that needs redesigning.

## Approaches considered

### Natural-flow horizontal translation

Keep the section in normal document flow and translate the strip while the visitor crosses its vertical height.

This is the lightest implementation, but it recreates the current structural weakness: the available vertical distance is too short to give three large cards a clear, complete traversal.

### Pinned horizontal stage

Pin the section on desktop while native vertical scroll controls a horizontal GSAP timeline.

This is the approved approach. It provides enough controlled distance to show all three cards, creates a memorable moment, and preserves the familiar vertical input model.

### Mandatory horizontal carousel

Require wheel, drag, or button input inside an independently scrollable carousel.

This was rejected because it creates an interaction mode change, increases the risk of scroll trapping, and makes the content less predictable for keyboard and assistive-technology users.

## Approved behavior

### Desktop

The section pins once its heading and stage are fully legible. Native vertical scrolling advances one continuous GSAP timeline.

The strip travels from its natural starting position to an end position calculated from its rendered width and the stage's visible width. The calculation must guarantee that the trailing edge of the third card reaches the intended stage padding rather than remaining clipped.

During the traversal:

- The card nearest the visual focus point is the active card.
- The active card uses full opacity and neutral scale.
- Non-active cards use a restrained reduction in scale and contrast.
- State changes remain continuous and do not reflow the layout.
- The heading and section identity remain stable while the cards move.
- The final card holds briefly in a fully readable position before the pin releases.

The section releases back into normal vertical flow and hands off cleanly to the verdict. The sequence does not add wheel interception, direction reversal, mandatory snapping, or an internal scroll container.

### Compact and touch layouts

Below the existing desktop motion breakpoint, the section does not pin.

The three cards become a native horizontal strip with touch scrolling and CSS scroll snapping. The layout exposes enough of the following card to communicate that more content is available, while every card can be brought fully into view.

The page itself must not gain horizontal overflow. Keyboard users must be able to reach every interactive destination in DOM order.

### Reduced motion

When `prefers-reduced-motion` is active, the section uses no pinning, scrubbed translation, scaling, or opacity choreography.

The experiments remain in semantic order in a readable static layout. No content depends on GSAP initialization or animation progress.

## Motion architecture

Retain the existing `ExperimentMontage` semantic component and `data-scene="experiments"` contract. The three experiments continue to be rendered as articles in content order.

Update the existing `createExperimentMontageScene` factory rather than adding a second motion owner. The factory remains responsible for this scene's GSAP resources and cleanup.

The desktop implementation uses one GSAP timeline with one ScrollTrigger:

- `trigger` targets the experiment section.
- `pin` fixes the section for the calculated traversal.
- `scrub` maps native scroll progress to the timeline.
- `end` is a function derived from the horizontal travel distance, with a small explicit hold allowance.
- `invalidateOnRefresh` forces geometry to be recalculated after viewport or layout changes.
- The strip's final `x` value is calculated from measured stage and strip geometry.
- Card emphasis is driven by the same timeline or ScrollTrigger progress, not by separate competing triggers.

Geometry must be derived from the section's inner stage rather than from `window.innerWidth`. This keeps the final alignment correct when page gutters or container widths change.

Use existing motion media conditions. Desktop motion is created only for the desktop, non-reduced-motion branch. Compact and reduced-motion presentation remain CSS-owned.

The scene cleanup must kill its timeline and ScrollTrigger and restore inline transform, opacity, and scale state. Re-entering the route or refreshing media conditions must not create duplicate triggers.

## Component and styling adjustments

Add a stable stage wrapper only if it is needed to separate the pinned viewport from the moving strip. Keep the heading and semantic articles in the server-rendered document.

CSS owns:

- Stage dimensions and overflow clipping on desktop.
- Card width, gaps, and visual hierarchy.
- Native overflow and scroll snapping on compact layouts.
- Final readable presentation before motion initializes.
- Focus-visible styles.
- Static reduced-motion presentation.

GSAP owns:

- Desktop strip translation.
- Desktop card emphasis during the pinned traversal.
- The duration of the pinned scene as a function of measured travel.

CSS and GSAP must not animate the same property on the same element concurrently.

## Accessibility

- Keep all three articles in their natural DOM order.
- Do not clone essential card content for the motion effect.
- Do not hide inactive cards from assistive technology.
- Do not introduce an internal vertical scroll area or focus trap.
- Keep repository actions reachable and visibly focused throughout the sequence.
- Ensure direct keyboard navigation can move through the three cards even while the desktop scene is pinned.
- Treat scale and opacity differences as decorative emphasis only; active state must not be the sole source of meaning.
- Preserve a complete static presentation when JavaScript is unavailable.

## Performance

Animate only compositor-friendly `transform` and `opacity` properties.

The scene uses a single scrubbed timeline and avoids per-frame layout writes. Geometry may be read during creation and ScrollTrigger refresh, but not repeatedly during animation progress.

Do not add another animation dependency, smooth-scroll layer, canvas, video, or continuous background effect.

## Validation strategy

Use the repository's existing integration-first validation:

- Strict TypeScript checking.
- ESLint.
- Production build.
- Existing content and navigation tests.
- Browser verification at representative desktop, laptop, tablet, and mobile widths.
- Reduced-motion browser verification.
- Keyboard traversal through all three experiment actions.
- JavaScript-disabled verification that all experiments remain readable.

The browser checks must observe the scene at these points:

1. Before the pin starts.
2. First card centered.
3. Second card centered.
4. Third card centered and completely visible.
5. Final hold.
6. After the section releases into the verdict.

Also verify:

- The strip's transform changes during desktop scrolling.
- The pin duration scales with the measured horizontal travel.
- Resizing and orientation changes recalculate the end position.
- No horizontal page overflow appears.
- No duplicate ScrollTriggers remain after remounting.
- Both Spanish and English routes preserve the same behavior.

## Acceptance criteria

The feature is complete when:

- Desktop vertical scroll visibly moves all three experiment cards horizontally.
- The experiment stage pins without trapping input or focus.
- Each card receives a clear central focus moment.
- The third card becomes fully visible before the scene releases.
- The handoff into the verdict has no jump or blank region.
- Compact layouts use native touch scrolling without prolonged pinning.
- Reduced-motion and JavaScript-disabled experiences expose all three experiments.
- Keyboard navigation remains usable in DOM order.
- Resize and refresh preserve correct start and end alignment.
- Existing type, lint, build, browser, accessibility, and performance gates continue to pass.

## Out of scope

- Changing the three experiment titles, categories, repository destinations, or order.
- Promoting secondary experiments above the primary project evidence.
- Adding drag controls, carousel buttons, mandatory snapping, or wheel interception on desktop.
- Redesigning unrelated portfolio sections.
- Adding new media, project claims, metrics, or animation libraries.
