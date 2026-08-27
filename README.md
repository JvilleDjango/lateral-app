# Wayfare

Wayfare is a responsive travel-booking assessment covering one complete journey: browse, inspect a stay, add a review, choose dates and guests, complete a mocked checkout, and receive confirmation.

Built within a four-hour timebox, it prioritizes a credible end-to-end product and explicit failure states over catalog breadth or production infrastructure.

## Quick Start

Requirements: Node.js 22 LTS or 24+, and npm 10+. Node 23 is outside ESLint 10 support and may emit engine warnings.

    npm ci
    npm run dev

Open **http://localhost:5173**. Vite runs on 5173, Express on 3001, and Vite proxies **/api** to Express.

## Scripts

| Command                  | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| **npm run dev**          | Start frontend and API with file watching                   |
| **npm run dev:client**   | Start only Vite                                             |
| **npm run dev:server**   | Start only Express                                          |
| **npm run build**        | Type-check and create dist/                                 |
| **npm run preview**      | Serve the production frontend                               |
| **npm run lint**         | Run ESLint                                                  |
| **npm run format**       | Format with Prettier                                        |
| **npm run format:check** | Check formatting                                            |
| **npm test**             | Run unit and API integration tests                          |
| **npm run test:watch**   | Run Vitest in watch mode                                    |
| **npm run audit:ux**     | Run responsive and accessibility-oriented browser scenarios |

The UX audit expects the app to be running and launches local Microsoft Edge. Screenshots go to **.artifacts/**, which Git ignores.

## Product Scope

1. Search stays by destination, dates, and guests.
2. Review details, amenities, availability, pricing, and reviews.
3. Add a validated review.
4. Carry URL-backed booking intent into checkout.
5. Validate guest and mocked card details.
6. Create a server-priced booking and show confirmation.

Loading, empty, invalid, unavailable, not-found, API-error, progress, and success states are included across mobile, tablet, and desktop.

## Architecture

    src/
      api/          fetch client and normalized API errors
      app/          TanStack Query configuration
      components/   shell and error boundaries
      features/     stays, reviews, and bookings
      pages/        route composition
      routes/       createBrowserRouter configuration
    server/
      data/         in-memory fixtures
      app.ts        Express routes and validation
    shared/
      domain.ts     response contracts
      schemas.ts    Zod write contracts
      pricing.ts    shared price calculation

- React Router owns navigation and URL-backed intent.
- TanStack Query owns remote data, loading, errors, and invalidation.
- Components own temporary forms and validation presentation.
- Zod validates untrusted writes.
- CSS Modules use BEM-style local names; global CSS holds tokens and resets.

Detail and checkout show preliminary prices. **POST /api/bookings** validates intent, calculates nights in UTC, and rebuilds totals from the server-owned nightly rate. Client totals are ignored.

## API

All endpoints use the **/api** prefix.

| Method | Endpoint                                       | Behavior                        |
| ------ | ---------------------------------------------- | ------------------------------- |
| GET    | /health                                        | Health status                   |
| GET    | /stays?destination=&checkIn=&checkOut=&guests= | Filter destination and capacity |
| GET    | /stays/:stayId                                 | Get a stay                      |
| GET    | /stays/:stayId/reviews                         | Get reviews                     |
| POST   | /stays/:stayId/reviews                         | Validate and create a review    |
| POST   | /bookings                                      | Validate, price, and confirm    |
| GET    | /bookings/:bookingId                           | Get confirmation                |

Errors consistently include **error.code**, **error.message**, and optional **error.fields**. Creation returns 201, invalid input 400, missing resources 404, and unavailable inventory 409.

## Decisions

- **Curated fixtures:** preserve time for the complete journey.
- **Data router plus TanStack Query:** separate navigation from remote state.
- **Shared TypeScript and Zod contracts:** align client and server.
- **In-memory Express API:** demonstrate boundaries without database setup.
- **Luxon:** keep UTC date arithmetic explicit.
- **CSS Modules with BEM:** combine local scope with clear ownership.
- **Focused tests:** cover business rules and API behavior before snapshots.

## Tests and CI

Tests cover pricing and fee rounding, booking dates, review validation, deterministic card expiry, booking creation/retrieval, structured errors, unavailable inventory, and authoritative totals.

GitHub Actions uses Node 24 on main pushes and pull requests:

    npm ci
    npm run format:check
    npm run lint
    npm test
    npm run build

The local browser audit adds eight wide, tablet, and mobile scenarios including empty results, API failure, missing details, invalid checkout, and confirmation.

## Accessibility

- Semantic landmarks and logical headings
- Persistent labels and associated errors
- Status and alert announcements
- Visible keyboard focus
- Image alternatives and accessible rating names
- Stable image ratios and controls at least 40px high
- No overflow at audited 375px, 768px, and 1440px widths

Automation does not replace manual screen-reader, forced-colors, or browser-zoom testing.

## Assumptions and Tradeoffs

- Availability is a fixture boolean, not date-range inventory.
- Search dates continue through the journey but do not filter availability.
- Payment is mocked; card values never leave the browser.
- Reviews and bookings last only for the API process lifetime.
- Authentication, taxes, refunds, email, maps, and currency conversion are excluded.
- Remote Unsplash images require network access.
- Route-level code splitting was deferred for this application size.

## Known Issues

- Inventory is not transactionally locked.
- Restarting the API clears reviews and confirmations.
- New reviews do not recalculate rating/count aggregates.
- There is no request tracing, metrics, or hosted error reporting.
- The Edge-based UX audit is local rather than part of CI.
- No deployment URL or recording is stored in this repository.

## Next Steps

1. Add persistence, transactional availability, and idempotent bookings.
2. Add authentication and server-created payment intents.
3. Recalculate review aggregates and add abuse controls.
4. Add interaction tests for search, reviews, and checkout focus.
5. Add structured logs, error reporting, and telemetry.
6. Self-host responsive images and measure code splitting.
7. Deploy both processes with automated browser smoke tests.

## AI/LLM Usage

AI assisted with planning, implementation, tests, refactoring, audits, and documentation. See [AI_USAGE.md](./AI_USAGE.md) for the honest disclosure and guardrails.

## Recording

See [SCREEN_RECORDING.md](./SCREEN_RECORDING.md) for the seven-minute walkthrough outline.
