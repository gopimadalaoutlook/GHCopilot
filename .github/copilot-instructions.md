<!-- Auto-generated guidance for AI coding agents working on Bucks2Bar -->
# Guidance for AI coding agents — Bucks2Bar

This repository is a small static web app that visualizes monthly income vs expense using Chart.js. Use these targeted instructions to be productive quickly.

- **Big picture:** The UI is in `index.html` (Bootstrap markup). Behavior lives in `script.js`: user edits numeric inputs 10 debounced update 10 Chart.js re-renders 10 data persisted to `localStorage` under key `bucks2bar.data`.

- **Key files:**
  - `index.html`: input grid (IDs `income-01`..`income-12`, `expense-01`..`expense-12`) and `<canvas id="incomeExpenseChart">`.
  - `script.js`: contains constants `MONTHS`, `STORAGE_KEY`, `debounce()`, `readInputs()`, `initChart()`, `saveData()/loadData()` and DOM wiring on `DOMContentLoaded`.

- **Data flow & invariants:**
  - Inputs 10 `readInputs()` returns `{ incomes, expenses }` arrays length 12.
  - `saveData()` writes `{ incomes, expenses, updated }` JSON to `localStorage` using `STORAGE_KEY`.
  - `loadData()` expects arrays; if absent, the app seeds random defaults and saves them.
  - Do not change `STORAGE_KEY` without providing a migration (older saved data will become inaccessible).

- **UI patterns & conventions to follow:**
  - All buttons must be pink color.
  - Input fields are named `income-XX` / `expense-XX` where `XX` is zero-padded month number. Follow this ID scheme for any new inputs.
  - Debounce semantics: updates are debounced to 300ms (`debounce(updateChartFromInputs, 300)`), with `.flush()` called on blur/Enter. Preserve flush behavior when adding input handlers.
  - Validation: negative values mark the input with Bootstrap `is-invalid` class 10 keep this pattern for client-side checks.
  - Chart usage: `chart` is a global variable created by `initChart()`. Update datasets in-place and call `chart.update()` rather than re-creating unless necessary.

- **External integrations:**
  - Chart.js and Bootstrap are loaded from CDNs in `index.html`. When modifying versions, test bundle compatibility locally.

- **Dev / run instructions:**
  - This is a static site. The simplest way to run locally is to open `index.html` in a browser. For a local HTTP server (recommended for some browsers):
    - `python -m http.server 8000` (from repository root) then open `http://localhost:8000`.

- **Common change examples:**
  - Add a new series to the chart: add dataset in `initChart()` and ensure `readInputs()` returns matching-length arrays. Update `populateInputsFromData()` and `saveData()` shape accordingly.
  - Change currency formatting: modify `formatCurrency()` in `script.js` (currently uses `currency: 'USD'`).

- **Tests & linting:**
  - There are no automated tests in the repo. When adding code, prefer small, manually verifiable changes (open page and exercise inputs). If you add modules, include a minimal README and run instructions.

- **Safety & backwards-compatibility guidance for agents:**
  - Preserve `localStorage` data shape (`incomes` and `expenses` arrays). If you must change the structure, write a migration path: detect old shape in `loadData()` and convert.
  - When changing the DOM IDs or input names, update all selector uses in `script.js` (`document.getElementById` and `querySelectorAll` selectors for `.income-input` / `.expense-input`).

- **Where to look for examples in this repo:**
  - Input wiring and debounced behavior: see `script.js` lines where `debounce()` is created and used (`DOMContentLoaded` block).
  
If anything here is unclear or you want more examples (tests, build scripts, or CI), tell me which area to expand and I'll iterate.
