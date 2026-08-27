# Travel Booking Assessment: 4-Hour Plan

## Goal

Deliver a small, credible travel-booking product that demonstrates product judgment and engineering discipline through one complete user journey:

**Browse stays -> inspect a stay -> choose dates and guests -> review pricing -> book -> see confirmation**

Reviews are included on the stay-detail page, with a small add-review flow. Payment is explicitly mocked.

The four-hour limit is firm. At 4:00, stop implementation and submit the best working state, documenting anything incomplete.

## Product Direction

Build a focused weekend-stay finder with a small, curated inventory. The experience should feel calm, trustworthy, and easy to scan rather than attempting Booking.com's feature breadth.

Primary user: a traveler who wants to compare a few properties and confidently complete a reservation on either mobile or desktop.

Product priorities:

1. A complete booking flow with clear availability and pricing.
2. Strong information hierarchy and responsive behavior.
3. Honest handling of loading, error, and empty states.
4. A codebase and README that make the decisions easy to review.

## Scope

### Must Ship

- Browse/search page with destination search and stay cards.
- Stay detail page with images, amenities, rating, reviews, pricing, and availability.
- Add-review form with validation and an immediate persisted response from the API.
- Checkout form with booking summary, guest details, mock payment, and price breakdown.
- Booking confirmation state with a reference number and reservation summary.
- Minimal backend API with mocked in-memory data.
- Responsive layouts at mobile and desktop widths.
- Loading, empty, API-error, validation, and success states.
- Keyboard-friendly controls, semantic labels, visible focus states, and useful image alt text.
- Meaningful tests around core business behavior and the main user path.
- GitHub Actions CI running lint, tests, and production build.
- Submission-ready README, including AI usage and guardrails.

### Explicitly Out of Scope

- Authentication or user accounts.
- Real payments, maps, geolocation, email, or third-party APIs.
- Inventory concurrency, cancellation, refunds, taxes by jurisdiction, or currency conversion.
- Favorites, sorting, pagination, complex filters, or an admin interface.
- Database persistence. Data resets when the backend restarts.
- Pixel-perfect reproduction of another travel product.
- Multiple destinations or a large catalog if they dilute the main flow.

## Proposed Technical Shape

- **Frontend:** React + TypeScript + Vite.
- **Routing:** React Router with `/`, `/stays/:stayId`, `/checkout`, and `/booking/:bookingId`.
- **Server state:** a small typed API client plus focused data hooks; avoid a state library unless complexity proves it necessary.
- **Local state:** component state for search, forms, selected dates, and guests. Pass booking intent through route state or a small booking context.
- **Backend:** Express with typed request validation and in-memory fixtures.
- **Testing:** Vitest + React Testing Library; Supertest only if API tests fit comfortably.
- **Styling:** plain CSS organized around tokens and page/component boundaries. Use native responsive layout primitives.
- **Images:** a small set of consistent remote or checked-in property images with stable dimensions and fallback treatment.

Suggested repository layout:

```text
src/
  api/
  components/
  features/
    bookings/
    reviews/
    stays/
  pages/
  test/
  types/
server/
  data/
  routes/
  index.ts
.github/workflows/ci.yml
```

Keep abstractions proportional to the app. Shared primitives should exist only where they remove real duplication or centralize behavior such as status messaging, price formatting, and form controls.

## API Contract

```text
GET  /api/stays?destination=&checkIn=&checkOut=&guests=
GET  /api/stays/:stayId
GET  /api/stays/:stayId/reviews
POST /api/stays/:stayId/reviews
POST /api/bookings
GET  /api/bookings/:bookingId
```

Key behaviors:

- Return consistent JSON error objects: `{ "error": { "code", "message" } }`.
- Validate required inputs and return appropriate `400`, `404`, and `201` responses.
- Treat availability as a simple fixture-backed rule and disclose that simplification.
- Calculate the authoritative booking total on the backend; do not trust a total sent by the client.
- Generate review and booking IDs on the backend.

## Four-Hour Schedule

### 0:00-0:20 (20 min): Foundation and Decisions

- Initialize Git if needed and preserve a clean starting point.
- Install only essential packages.
- Define core TypeScript models and 4-6 realistic stay fixtures.
- Establish routes, design tokens, global layout, and API/server scripts.
- Add a short decision log to the README as choices are made.

**Checkpoint:** frontend and backend start together; routes render; fixtures and types exist.

### 0:20-1:05 (45 min): Browse Experience

- Build compact header and destination/date/guest search controls.
- Build responsive stay results with useful card content: image, location, rating, key amenity, nightly price, and availability cue.
- Wire `GET /api/stays` and URL-backed search parameters where practical.
- Add skeleton/loading, no-results, and retryable error states.

**Checkpoint:** a user can browse, search, and open a stay on mobile or desktop.

### 1:05-1:55 (50 min): Stay Details and Reviews

- Build image-led detail layout with property summary, amenities, rating, and booking panel.
- Show availability and a transparent preliminary price calculation.
- Wire review list and add-review form.
- Include validation, submit progress, API error feedback, and success behavior.

**Checkpoint:** the detail page supports an informed booking decision and a review can be added.

### 1:55-2:45 (50 min): Checkout and Confirmation

- Carry selected stay, dates, and guests into checkout.
- Build contact and mock card fields with accessible validation.
- Display nights, nightly rate, fees, and total.
- Wire `POST /api/bookings`, make the server calculate totals, and handle failure/retry.
- Build a useful confirmation page with booking reference and summary.

**Checkpoint:** the primary journey works end to end without manual state manipulation.

### 2:45-3:15 (30 min): Responsive and UX Hardening

- Test narrow mobile, tablet, and wide desktop layouts.
- Verify keyboard navigation, focus visibility, heading order, labels, status announcements, contrast, and tap targets.
- Prevent layout shift with stable image/control dimensions.
- Exercise loading, empty, invalid, not-found, and API-error paths.
- Fix the highest-impact rough edges only.

**Checkpoint:** the experience remains coherent and usable outside the happy path.

### 3:15-3:40 (25 min): Tests and CI

- Add focused tests for price/date calculation and form validation.
- Add one integration test covering browse-to-book or booking API behavior.
- Configure GitHub Actions to run install, lint, tests, and build.
- Run the same commands locally and resolve failures.

**Checkpoint:** CI represents the actual production-quality gate and all checks pass locally.

### 3:40-4:00 (20 min): Submission Package

- Replace the scaffold README with setup, scripts, architecture, API, assumptions, tradeoffs, and next steps.
- Add the required AI/LLM usage note, describing approach and guardrails honestly.
- Run the production build and a final smoke test.
- Record known issues and unfinished work instead of making rushed changes.
- Prepare a 5-10 minute screen-recording outline.

**Hard stop at 4:00.**

## Test Strategy

Prioritize tests that demonstrate judgment rather than chasing coverage:

1. Price calculation: number of nights, fees, total, and invalid date ranges.
2. Checkout validation: missing contact/payment fields prevent submission and expose accessible errors.
3. Booking path: valid input reaches the backend and produces a confirmed booking with server-calculated pricing.
4. Optional if time remains: review submission or API `404`/validation behavior.

## Accessibility Baseline

- One logical page heading and semantic landmarks.
- Every input has a persistent label and errors are programmatically associated.
- Async feedback uses an appropriate live region without being disruptive.
- All actions work by keyboard with visible focus indication.
- Images use meaningful alt text unless decorative.
- Color is never the only signal for availability, errors, or ratings.
- Motion respects `prefers-reduced-motion` if motion is introduced.

## Scope-Control Rules

- Finish the vertical booking path before visual embellishment.
- Use one well-designed card/detail treatment rather than many variants.
- Do not add a package when a small native solution is clearer.
- If a milestone overruns by 10 minutes, simplify the current feature and preserve later verification time.
- At 3:15, stop feature development regardless of feature status.
- At 3:40, stop code changes except fixes required for lint, tests, or build.

## Cut Order if Behind

Remove or simplify features in this order:

1. Review submission persistence (retain a read-only review list).
2. Advanced search inputs; retain destination browsing and dates in the booking panel.
3. Separate confirmation lookup endpoint; render confirmation from the booking response.
4. Extra images, amenities, animations, and decorative polish.
5. API integration test; retain unit/component tests for core pricing and checkout behavior.

Never cut the complete booking path, error handling, responsive baseline, README, CI configuration, or production build verification.

## README Decision Record

Document these points while building:

- Why the chosen product angle and feature scope fit four hours.
- Why in-memory data is adequate and what production persistence would require.
- Where pricing is calculated and why the server owns the final total.
- State-management and routing choices.
- Accessibility and responsive decisions.
- Known limitations and risks.
- What would be built next: persisted inventory, authenticated trips, real payment intent, robust availability locking, observability, and broader test coverage.

## AI/LLM Usage Note Outline

Include a concise, truthful note covering:

- Tasks AI assisted with, such as planning, scaffolding, test-case brainstorming, and review.
- Human-owned decisions: scope, architecture, product behavior, and final code acceptance.
- Guardrails: inspect every generated change, keep dependencies minimal, run lint/tests/build, manually exercise critical states, and never paste secrets or candidate/company-confidential data into prompts.
- Any material AI-generated assets or code and how they were verified.

## Screen Recording Outline

1. Product premise and deliberate four-hour scope.
2. Browse and search, including loading/empty/error behavior.
3. Stay details, availability, pricing, and reviews.
4. Checkout validation and confirmed booking.
5. Responsive and accessibility details.
6. Architecture, API ownership of pricing, tests, and CI.
7. Tradeoffs, known limitations, and next steps.

## Definition of Done

- The primary journey completes against the provided API.
- The app is usable at mobile and desktop widths.
- Core loading, empty, validation, error, and success states are visible and intentional.
- Lint, meaningful tests, and production build pass locally.
- CI runs those same checks.
- README contains every requested submission topic, including AI usage.
- Remaining gaps are recorded honestly at the four-hour stop.
