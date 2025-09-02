# Data Grid Task

Lightweight data-grid demo built with Vue 3, TypeScript and Vite. This repository implements a simple loan table UI with sorting and filtering and uses Pinia for state. It's intended as a small, easy-to-run SPA for evaluation and development.

## Quick start

Prerequisites: Node.js (16+ recommended) and npm.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Generate or regenerate sample data (uses `tsx`):

```bash
npm run setup
```

Note: the repository includes `data/loans.json` (full sample) and `data/loans_100.json` (smaller sample).

## Scripts

- `dev` - start Vite dev server
- `build` - type-check and build production bundle (`vue-tsc -b && vite build`)
- `preview` - preview built app
- `setup` - run `scripts/generate-data.ts` to (re)generate sample `data/*.json`

## Project structure (key files)

- `index.html` — app entry
- `src/main.ts` — app bootstrap
- `src/App.vue` — root component
- `src/components/Table.vue` — main data-table component (sorting/filtering UI)
- `src/components/HeaderComponent.vue` — header / toolbar
- `src/stores/useDataTableStore.ts` — Pinia store holding loans and UI state
- `src/types/Loan.ts` — Loan type definitions
- `scripts/generate-data.ts` — utility to generate loan JSON files
- `data/` — sample JSON datasets used by the app

## Notes for developers

- Uses Vue 3 `<script setup>` SFCs and Pinia for state management.
- Type checking is performed with `vue-tsc` (included in `build`).
- Vitest and testing helpers are present in devDependencies. To run tests after adding them, you can use `npx vitest` or add a `test` script.

## Suggestions / Next steps

- Add unit tests (Vitest) and a `test` script.
- Add pagination, column customization, and accessibility improvements.

## License

This repository is provided as-is for evaluation. Add a LICENSE file if you plan to reuse or publish.
