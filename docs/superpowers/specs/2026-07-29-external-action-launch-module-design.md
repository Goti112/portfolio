# External Action Launch Module Design

## Goal

Replace the portfolio's plain external-link treatment and Unicode arrow with a distinctive technical action module that matches the existing recovered-evidence visual system.

## Visual Direction

Use the approved "Launch Module" direction for every `ExternalAction`:

- A dark rectangular body with a one-sided red status rail.
- A primary uppercase action label.
- A secondary monospace line containing the real destination without the `https://` or `mailto:` prefix.
- A separate light icon bay containing a purpose-built external-link SVG.
- Sharp geometry and restrained motion consistent with the portfolio's dossier interface.

The active hover and keyboard-focus states raise the module slightly, strengthen its border, tint the body, turn the icon bay red, and move the arrow diagonally. These effects must not change surrounding layout.

## Component Structure

Keep `ExternalAction` as the shared renderer for project, experiment, email, and GitHub actions. Add one pure destination-formatting function that accepts a published URL and returns its display form:

- `https://github.com/Goti112` becomes `github.com/Goti112`.
- `mailto:mmanz2606@gmail.com` becomes `mmanz2606@gmail.com`.

Published actions render:

1. A text block containing the existing label and formatted destination.
2. An icon bay containing an inline SVG external-link arrow.

Pending actions preserve the same two-column module geometry. They render the existing pending label as secondary text and a geometric CSS status mark in the icon bay. They do not render a destination or SVG arrow.

No destination data, navigation behavior, project content, or translated label changes are part of this work.

## Layout and Responsive Behavior

The module uses a two-column grid: flexible text content plus a fixed square icon bay. It receives a practical minimum width on wide layouts and remains capped by its container. Existing full-width experiment actions remain full width.

Long destination text stays on one line and truncates with an ellipsis. Contact actions become equal-height modules. At compact breakpoints, actions use the available width without causing horizontal page overflow.

## Accessibility and Motion

- Preserve native anchors for published destinations and disabled non-anchor spans for pending destinations.
- Keep the accessible name equal to the existing action label even though destination metadata is visible.
- Mark the decorative SVG and geometric status mark as hidden from assistive technology.
- Retain the existing focus ring and add a clearly visible module focus state.
- Disable transforms and transitions when `prefers-reduced-motion: reduce` is active.

## Verification

- Add focused coverage for formatted GitHub and email destination metadata.
- Assert that published actions use the new text and icon-bay structure.
- Assert that the BorderPass pending action retains its disabled state, pending text, and non-link structure.
- Assert that the former Unicode arrow is absent from rendered action text.
- Verify focus visibility and that action modules remain within the compact viewport.
- Run content validation, lint, type checking, production build, focused browser tests, and the complete repository validation.
- Inspect the active, hover, focus, pending, and compact states in a real browser before publishing.

## Non-goals

- No changes to project images, project stacks, destinations, or BorderPass availability.
- No changes to navigation, project-card layout, experiment-card layout, or contact copy.
- No dependency additions and no icon library.
