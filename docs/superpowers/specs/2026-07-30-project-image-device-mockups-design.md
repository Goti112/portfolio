# Project Image Device Mockups Design

## Goal

Replace the three abstract project previews with complete, recognizable product images presented inside device mockups. The images must show what each project looks like in use and remain fully visible at desktop and compact breakpoints.

## Visual Direction

Use the approved device-mockup direction:

- Each project receives one landscape `16:10` image asset.
- QGC Planner and BorderPass AI appear inside restrained laptop frames.
- Ticket OCR appears as a detailed Android phone interface centered within the same landscape canvas.
- Device chrome remains secondary to the product screen and uses the portfolio's black, warm gray, bone, and red palette.
- The product interface stays front-facing enough to remain readable. Perspective and shadows add depth without cropping or obscuring the screen.
- No annotations, floating marketing copy, decorative badges, or cinematic scenery compete with the interface.

The mockups are deterministic project screenshots assembled for the portfolio rather than live embeds. This keeps them stable, fast, and independent of repository demos or external services.

## Project Images

### QGC Planner

Show a desktop mission-planning workspace containing:

- a large satellite-style map;
- a clearly connected red flight path;
- numbered waypoints;
- a mission-step panel;
- altitude, speed, battery, and link telemetry;
- a visible MAVLink connected state.

The finished image must read immediately as a drone ground-control and mission-planning product.

### BorderPass AI

Show a desktop CBAM operations dashboard containing:

- summary metrics for active imports, pending reviews, emissions, and compliance status;
- an emissions or shipment trend visualization;
- a recent-imports table;
- a review queue;
- a clear CBAM status treatment.

The finished interface must feel like a credible professional operations tool rather than a generic analytics template.

### Ticket OCR

Show a detailed Android receipt-scanning flow containing:

- a camera or captured-ticket area with a clear scan boundary;
- an OCR processing or completed state;
- extracted merchant, date, subtotal, tax, and total fields;
- confidence or validation feedback;
- a clear XLSX export action.

The phone interface must be internally coherent and substantially more detailed than the current abstract ticket graphic.

## Asset and Component Structure

Store the final optimized assets at:

- `public/projects/qgc-planner.webp`
- `public/projects/borderpass-ai.webp`
- `public/projects/ticket-ocr.webp`

Each source composition uses a `1600 × 1000` canvas. Export each final WebP at that resolution and keep it at or below `300 KB` while preserving sharp UI text.

Add one typed `ProjectPreviewImage` component that accepts an imported local image and renders it with explicit intrinsic dimensions. Replace the internal abstract markup of `QgcPreview`, `BorderPassPreview`, and `OcrPreview` with this shared component and their corresponding static image imports. Keep the existing project IDs, preview component mapping, `data-project-preview`, and inline-preview structure so the GSAP scene contract does not change.

The adjacent project name and summary already identify each image. Render the image as presentational evidence with empty alternative text to avoid repeating the same content to screen-reader users.

## Layout and Responsive Behavior

- Use `object-fit: contain` so every mockup remains fully visible.
- Preserve the existing `16:10` preview geometry on desktop and mobile.
- Do not crop the laptop screen, phone body, or primary interface controls.
- Keep the current sticky desktop transition between projects and the existing inline mobile previews.
- Add only the minimum framing styles needed for the new images; remove obsolete abstract-preview styles after confirming they have no other consumers.
- Reserve image dimensions through the component so loading does not shift the project copy.

## Loading and Failure Behavior

Import the local image files statically so missing files fail during compilation instead of silently falling back to placeholders. Do not add remote image hosts, runtime screenshot services, or fallback graphics.

## Verification

- Confirm all three local image assets render at their intended project.
- Verify Planner shows a mission-planning interface, BorderPass shows a CBAM dashboard, and Ticket OCR shows a detailed Android scanning flow.
- Verify the full device and product screen remain visible at desktop, tablet, and narrow mobile widths.
- Confirm project scroll transitions and the sticky preview still select the correct image.
- Confirm no layout shift or horizontal overflow is introduced.
- Check exported asset clarity and file weight.
- Run content validation, lint, type checking, production build, focused project browser coverage, and the repository's existing validation command.
- Inspect desktop and compact screenshots in a real browser before completion.

## Non-goals

- No changes to project names, descriptions, technology lists, destinations, demos, APKs, or repository links.
- No changes to the project-section copy, scroll choreography, navigation, or secondary-project placeholders.
- No live application embeds or iframe previews.
- No new dependency or image carousel.
