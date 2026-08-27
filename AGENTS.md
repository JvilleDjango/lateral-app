# Wayfare Agent Instructions

## Project context

Wayfare is a time-boxed React and TypeScript travel-booking assessment with an Express API. Preserve its deliberately narrow product scope and existing feature-based architecture. Prefer focused fixes over broad rewrites or new dependencies.

## Required working practices

- Read `README.md` and the relevant source files before proposing changes.
- Treat `shared/schemas.ts` and `shared/domain.ts` as the client/server contract boundary.
- Keep server-calculated booking prices authoritative.
- Preserve URL-backed search state, TanStack Query server state, Zod validation, CSS Modules, and React Router data-router conventions.
- Never claim a check passed unless its command was run successfully.
- Do not overwrite unrelated working-tree changes.

## Verification

Run the smallest relevant test while iterating. Before declaring repository-wide work complete, run:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

For user-facing or responsive changes, also run `npm run audit:ux` while the application is running.

## Review skills

Use the matching instructions in `.agents/skills/`:

- `senior-frontend-pr-review`: regression-focused PR review.
- `accessibility-audit`: keyboard, semantics, forms, announcements, contrast, and responsive accessibility.
- `architecture-report`: boundaries, state ownership, API contracts, and maintainability.
- `test-quality-audit`: meaningful coverage and test design.
- `performance-security-audit`: frontend performance and practical web/API security.
- `release-readiness`: consolidated submission and production-readiness gate.

Reviews lead with actionable findings ordered by severity. Each finding must include evidence, impact, and a specific remediation. Say explicitly when no findings are discovered and list remaining test gaps.
