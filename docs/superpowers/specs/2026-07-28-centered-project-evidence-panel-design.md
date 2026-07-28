# Centered Project Evidence Panel Design

## Goal

Keep the desktop project-preview panel vertically centered in the viewport while the project evidence sequence is pinned. The cursor lens and project-change animation remain unchanged.

## Scope

- Apply only at the existing desktop motion breakpoint (`min-width: 960px`) when motion is ready.
- Center the visual stage against the viewport during its ScrollTrigger pin.
- Preserve the current panel size, project-preview crossfade, inline/mobile previews, and cursor lens behavior.

## Implementation

The visual stage currently aligns to the start of its grid area and is pinned from the top edge. Update its desktop motion layout so the pinned stage has a viewport-relative vertical offset that centers its fixed height. Keep the existing pin boundaries and `pinSpacing: false`; only the stage position changes.

## Verification

- Add a desktop browser assertion that the visual stage is vertically centered while the first project case is active.
- Verify the project preview remains inside the grid column and changes as each project case becomes active.
- Run the focused project-motion browser test and the existing type, lint, and build checks.

## Non-goals

- No change to the evidence lens, cursor tracking, preview contents, copy-track layout, or mobile behavior.
