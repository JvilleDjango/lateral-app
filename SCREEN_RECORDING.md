# Screen Recording Outline

Target length: 7 minutes.

## 0:00-0:40 - Product and Scope

- Introduce the curated weekend-stay experience and four-hour constraint.
- Explain why one complete booking journey took priority.
- Name exclusions: accounts, real payments, persistence, and inventory locking.

## 0:40-1:40 - Browse and Search

- Show stay cards, prices, ratings, and availability.
- Search by destination, dates, and guests; point out URL-backed state.
- Briefly demonstrate an empty result and mention loading/error coverage.

## 1:40-2:45 - Details and Reviews

- Show the property summary, amenities, rating, reviews, and booking panel.
- Change dates and explain preliminary pricing.
- Submit a review and show validation, progress, and cache invalidation.

## 2:45-4:00 - Checkout and Confirmation

- Trigger one checkout validation error.
- Explain that mock card data stays in the browser.
- Complete a booking and show its reference and final total.
- Explain that the API ignores client totals and recalculates pricing.

## 4:00-4:50 - Responsive and Accessibility

- Resize to mobile and scan the journey.
- Highlight labels, focus, announcements, stable images, and tap targets.
- Mention the eight browser scenarios and remaining screen-reader testing.

## 4:50-5:50 - Architecture and API

- Show the feature structure, shared contracts, and Express app.
- Explain Router, TanStack Query, Zod, and CSS Module ownership.
- Show the API error contract and in-memory tradeoff.

## 5:50-6:35 - Tests and CI

- Open pricing, checkout-schema, and booking API tests.
- Show CI running install, formatting, lint, tests, and build on Node 24.
- State the local result: four files, 11 tests, build, and UX audit passing.

## 6:35-7:00 - Tradeoffs and Next Steps

- Open the README known-issues section.
- Prioritize persistence, inventory locking, payment intents, authentication, observability, and interaction tests.
- Close by noting that incomplete production concerns are documented.
