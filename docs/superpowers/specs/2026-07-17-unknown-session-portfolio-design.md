# UNKNOWN_SESSION Portfolio Design

## Product goal

Build a bilingual portfolio for Miquel Manzano that communicates a technically grounded, creative, and adaptable full-stack profile. The portfolio supports job applications by showing evidence of real work, technical foundations, education, and a clear professional direction.

The site must feel memorable without obscuring its content. Its central narrative presents the visitor as an unknown local session while the interface reconstructs Miquel's profile from projects, code, and technical decisions. Cybersecurity is a visual and narrative vocabulary, not a claimed professional specialization.

## Audience and positioning

The primary audience is recruiters, hiring managers, and technical team members evaluating a full-stack candidate. The portfolio must establish the following within the opening viewport:

- Name: Miquel Manzano.
- Profile: full-stack developer with a technical foundation and an adaptable approach.
- Availability statement: "Disponible para crear, aprender y llevar ideas hasta producción."
- Immediate access to projects, skills, education, language selection, and contact.

The Spanish version is the default. An English version is available at `/en`.

## Creative direction

The approved concept is **UNKNOWN_SESSION**.

The visitor is represented as an unknown read-only session. As the visitor scrolls, the system reconstructs Miquel's professional identity through evidence. The experience combines:

- A dark, nocturnal, lightly punk visual language.
- Psychological tension and asymmetric composition associated with a technical thriller.
- Authentic programming artifacts such as typed code, logs, diagnostics, protocols, and repository states.
- Continuous transformation rather than a layout that visibly separates into floating pieces.

The visual identity uses deep black, aged bone, oxidized red, and restrained terminal accents. Display typography is condensed and assertive. Technical information uses a monospaced typeface. The design avoids generic neon-green hacker imagery, fake security claims, and copied artist or television branding.

## Experience narrative

The page is a continuous vertical experience with semantic sections underneath the visual transitions.

### 1. Session detection

Introduce Miquel and the availability statement. The interface reports an unknown visitor and continues in read-only mode. The first viewport remains readable and professional before visual corruption increases.

### 2. WHOAMI

Explain the full-stack profile and working method. State that Miquel has an independent technical foundation and uses AI as an accelerator for complex work rather than as a substitute for programming knowledge.

### 3. SOURCE ANALYSIS

Present technical capabilities through typed code, system diagnostics, and relationships rather than percentage bars.

Core technologies:

- TypeScript, JavaScript, React, HTML, and CSS.
- PHP, MySQL, Java, and Python.
- Flutter.

Engineering capabilities:

- Git and GitHub.
- REST APIs, HTTP, and JSON.
- Database design, SQL, and relational modeling.
- Authentication, sessions, and user management.
- CRUD and client-server applications.
- Responsive design and web accessibility.
- Linux, terminal workflows, and web deployment.
- Docker.
- MVC and object-oriented programming.

MAVLink and OCR appear only in the projects where Miquel used them.

### 4. EVIDENCE

Show three primary project case studies:

1. **QGC Planner** — a mission planner inspired by Mission Planner, built with React, TypeScript, and MAVLink.
2. **BorderPass AI** — an assistant for customs professionals and importers handling CBAM-related controls for goods imported from outside Europe.
3. **Ticket OCR Scanner** — a Flutter application that scans tickets and extracts structured information with OCR.

Each case presents the confirmed problem, product purpose, relevant stack, and repository state. The initial release must not invent unconfirmed implementation details, metrics, technical decisions, or personal contributions. Those fields can be added to the typed content later when Miquel supplies the project-specific information.

Project previews are stylized interface representations based on actual functionality. Their composition must allow later replacement with real screenshots without restructuring the section.

### 5. RECOVERED FILES

Present the web game, Roblox game, and AI Wrapped as secondary experiments. They demonstrate range and curiosity without competing with the three primary cases. Because no functional descriptions have been supplied for these experiments, the initial release shows only their confirmed names and categories and does not infer features or results.

### 6. FORMATION LOG

Show education as a continuous technical progression at Institut Bernat el Ferrer:

- CFGM in Sistemas Microinformáticos y Redes (SMX), 2022–2024.
- CFGS in Desarrollo de Aplicaciones Web (DAW), 2024–2026.

Education supports the profile but does not replace the project evidence as the primary story.

### 7. SESSION COMPLETE

End with the availability statement and actions for email and the general GitHub profile.

## Interaction and motion

Scrolling gradually transforms the interface instead of breaking it into independent pieces:

- Typography shifts, compresses, stretches, and gains controlled distortion.
- Logs and source fragments emerge from the existing composition.
- Project cases grow out of the narrative flow.
- A cursor-based forensic probe reveals technical decisions and project details on capable pointer devices.
- Direct navigation remains available for visitors who want to skip to projects, capabilities, education, or contact.

No terminal command is required to navigate or reveal essential content. Decorative commands may react to the scroll position but cannot block access.

Motion is implemented with GSAP, CSS, and DOM layers. Animations primarily change transforms, opacity, and CSS variables. A single motion controller coordinates the page timeline.

On mobile, the visual identity and narrative remain intact while depth, distortion, noise, and simultaneous motion are reduced. With `prefers-reduced-motion`, all information appears directly in a stable composition.

## Information architecture and navigation

The site uses these top-level destinations:

- Profile.
- Capabilities.
- Projects.
- Education.
- Contact.
- ES/EN language switch.

The content remains semantic, keyboard accessible, and indexable even when animations are unavailable.

## Technical architecture

Use Next.js with the App Router, TypeScript in strict mode, and GSAP. Generate the portfolio statically because it has no server-side or user-specific data requirements.

Routes:

- `/` — Spanish default.
- `/en` — English.

Both routes include localized metadata and reciprocal language annotations.

Components have single responsibilities:

- `PortfolioShell` provides document structure, navigation, and language selection.
- `SessionIntro` renders the initial identity and availability statement.
- `IdentityTrace` explains the profile and working method.
- `CapabilityAnalysis` renders technical capabilities and source-analysis visuals.
- `ProjectEvidence` renders the three primary project cases.
- `RecoveredFiles` renders secondary experiments.
- `EducationLog` renders the education progression.
- `SessionExit` renders contact actions.
- `MotionController` owns GSAP setup, responsive motion rules, and cleanup.

Server-rendered components own content. Client components are limited to motion and interaction boundaries.

## Content model and data flow

All portfolio content lives in strictly typed local TypeScript data. Presentation components receive immutable data and do not mutate shared state.

Spanish and English dictionaries implement the same typed structure. A missing translation key or invalid content value must fail validation during the production build.

Repository, email, and GitHub destinations use an explicit discriminated union:

```ts
type ExternalDestination =
  | { readonly status: "pending" }
  | { readonly status: "published"; readonly url: string };
```

At initial release, project repositories, email, and the general GitHub profile use the `pending` state. The UI renders a visible disabled action such as `ENLACE_PENDIENTE` and never emits an empty or broken anchor. Publishing a destination requires changing its state and adding a valid URL in one content file.

No backend, database, analytics service, contact form, or external content API is in scope.

## Error handling

- Invalid bilingual content or missing required fields fails the build with a specific validation error.
- Invalid published URLs fail content validation.
- Motion setup errors must be surfaced during development and must not control whether semantic content exists.
- Pending destinations are rendered as explicit disabled states, not caught as runtime navigation errors.
- No external runtime service calls exist, so the initial site has no network retry behavior.

## Accessibility

- All sections use semantic headings and landmarks.
- Keyboard users can reach navigation, language selection, projects, and active contact actions.
- Focus indicators remain visible against the dark visual system.
- Text contrast meets WCAG AA.
- Decorative noise, scanning graphics, and source overlays are hidden from assistive technology.
- `prefers-reduced-motion` removes nonessential movement and exposes final states immediately.
- Touch devices do not depend on hover-only content.
- Language changes use correct document language metadata.

## Performance

- Statically generate both language routes.
- Load GSAP only in the client motion boundary.
- Prefer transforms, opacity, and CSS variables for animation.
- Self-host the selected fonts.
- Use HTML and CSS for initial project previews.
- Optimize future screenshots through `next/image`.
- Target an LCP below 2.5 seconds and avoid visible layout shifts under a representative mobile connection.
- Do not introduce WebGL or Three.js unless a later approved requirement cannot be achieved efficiently with the DOM and CSS.

## Validation strategy

Use behavior-focused validation rather than artificial unit coverage:

- TypeScript strict type checking.
- Linting and a production Next.js build.
- Playwright smoke coverage on desktop and mobile viewports.
- Full Spanish and English navigation flows.
- Keyboard navigation and visible-focus checks.
- Reduced-motion behavior.
- Verification that pending destinations do not create active or broken links.
- Visual review at representative desktop, tablet, and mobile sizes.
- Performance review of the production build and its animated scroll path.

## Initial release boundaries

The first release includes the complete bilingual narrative, responsive motion system, stylized project previews, education, capabilities, and explicit pending destinations.

The first release excludes:

- Published project repository links.
- Published email and general GitHub destinations.
- Real project screenshots or videos.
- Unconfirmed project metrics, implementation details, and contribution claims.
- A contact form.
- Analytics.
- A content management system.
- Backend services.
- WebGL scenes.

These exclusions keep the implementation focused while the data model preserves a direct path for adding real destinations and media later.
