# Portfolio Destinations and Project Stack Design

## Goal

Publish the confirmed contact and repository destinations and replace generic project labels with the main languages and technologies verified from the public repositories.

## Scope

- Publish `mailto:mmanz2606@gmail.com` as the email destination.
- Publish `https://github.com/Goti112` as the GitHub profile destination.
- Publish `https://github.com/Goti112/Mission-Planner-Demo` for QGC Planner.
- Publish `https://github.com/Goti112/ticket_app` for Ticket OCR.
- Show `TypeScript`, `React`, `Mapbox GL`, and `Cesium` for QGC Planner.
- Show `Dart`, `Flutter`, `Google ML Kit`, and `XLSX` for Ticket OCR.
- Keep BorderPass AI pending and retain its current `AI` and `CBAM` labels until its repository is available.
- Keep project images and secondary experiment destinations unchanged.

## Architecture

Continue using `src/content/destinations.ts` as the single source of truth for shared destinations across Spanish and English content. Keep translated project copy in the locale files while using the same verified technology labels in both locales.

The existing `ExternalAction` component will render published destinations as external links. No component or styling changes are required.

## Validation

- Add browser coverage for the exact email, GitHub profile, QGC Planner, and Ticket OCR destinations.
- Assert that BorderPass remains disabled and pending.
- Assert the verified technology labels in both locale routes.
- Update the existing pending-link count to reflect the four newly published destinations.
- Run the content validation, focused browser tests, lint, type checking, and production build before pushing.

## Non-goals

- No BorderPass repository or stack update.
- No project image changes.
- No secondary experiment link changes.
- No redesign of project cards, contact actions, or link behavior.
