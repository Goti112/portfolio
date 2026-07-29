# BorderPass and future project placeholders design

**Goal:** publish the real BorderPass repository and represent the secondary-project area as reserved slots for future work.

## BorderPass AI

- The project destination is `https://github.com/Goti112/borderpass-ai`.
- The recovered-evidence labels reflect the primary technologies confirmed in the public repository: `Next.js`, `TypeScript`, `PostgreSQL`, and `Prisma`.
- The project keeps the existing external-action module, now in its active state with the real GitHub destination displayed.

## Secondary files

- Keep the existing three-card montage, its semantic region, and its animation contract so desktop and mobile composition remain stable.
- Remove the names, categories, and pending external actions associated with the previous secondary projects.
- Each reserved card renders a single visible `?` as the deliberate placeholder for a future project.
- The implementation remains translation-safe: English and Spanish content use the same placeholder data, with no stale project names or destinations exposed.

## Verification

- Update project and experiment content assertions to cover the live BorderPass destination and the three placeholder cards.
- Run the repository validation command and targeted Playwright coverage.
- Review the production deployment after pushing to `main` and manually redeploy it on Vercel.
