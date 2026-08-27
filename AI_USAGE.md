# AI/LLM Usage Note

I used ChatGPT/Codex as an active development assistant. It helped translate the brief into a four-hour plan, compare architecture choices, scaffold and refine implementation, propose edge cases, create focused tests, run checks, perform responsive and accessibility audits, and prepare documentation.

I retained ownership of product scope and final acceptance. Choices such as curated inventory, Luxon, URL-backed search, TanStack Query, shared Zod contracts, an in-memory API, server-authoritative pricing, and deferred production features were made explicitly against the timebox. Generated changes were inspected in repository context and accepted only after relevant local checks.

Guardrails:

- Kept the four-hour scope and avoided speculative features and dependencies.
- Read surrounding code and preserved established architecture.
- Treated generated code as untrusted until checks passed.
- Used shared validation and kept booking prices authoritative on the server.
- Exercised failure, empty, invalid, missing, mobile, tablet, and desktop states.
- Did not provide secrets, credentials, production personal data, or confidential company source code.
- Documented incomplete production concerns instead of presenting the app as production-ready.

AI output was material to scaffolding, repetitive CSS migration, tests, audit automation, comments, and documentation. Verification included Prettier, ESLint, a TypeScript/Vite build, 11 Vitest/Supertest tests, and an eight-scenario browser audit. Final responsibility for the submitted behavior and tradeoffs remains mine.
