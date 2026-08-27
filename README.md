# Wayfare

Wayfare is a focused travel-booking assessment built around one complete journey: browse, inspect, review, reserve, and confirm a curated stay.

> Work in progress. Full setup, scripts, tradeoffs, and submission notes will be completed in the documentation milestone.

## Foundation Decisions

- **Narrow product scope:** a curated collection makes comparison quality more important than catalog breadth and keeps the four-hour build focused on the complete booking path.
- **React Router data router:** `createBrowserRouter` keeps the route tree centralized and leaves room for route-level errors and data APIs, while TanStack Query owns remote-data caching and mutation state.
- **TanStack Query:** stay, review, and booking requests need explicit loading, error, cache, and invalidation behavior without mixing remote state into page components.
- **Shared contracts and Zod schemas:** frontend and backend agree on core shapes, and the API validates untrusted writes at runtime.
- **Backend-authoritative pricing:** checkout may preview a price, but `POST /api/bookings` calculates nights, fees, and the final total.
- **In-memory Express API:** persistence and availability locking are deliberately deferred; the assessment can demonstrate API boundaries without database setup consuming the timebox.
- **Plain CSS:** a small token layer and native layout primitives provide enough consistency and responsiveness without adopting a component framework.
- **Node support:** use Node 22 LTS or Node 24+. Node 23 is outside ESLint 10's supported engine range.

## Current Scripts

```bash
npm run dev       # start the API and Vite client
npm run build     # type-check and create the production client build
npm run lint      # lint the repository
npm run format    # format supported files with Prettier
npm run format:check # verify formatting without changing files
npm test          # run the test suite once
```

The Vite development server proxies `/api` to the Express server on port `3001`.

<!-- The remaining Vite template notes are retained temporarily during development. -->

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
