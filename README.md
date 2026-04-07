# Playwright TypeScript Test Suite — Shifts

Automated end-to-end test suite for the **Capabilities → Shifts** module of the Werkstattplanung demo platform, written in TypeScript using Playwright.

---

## What's in this repo

| Path | Description |
|------|-------------|
| `src/pages/ShiftsPage.ts` | Page Object Model for the Shifts page — locators and actions |
| `src/pages/LoginPage.ts` | Page Object Model for the login page |
| `src/config/env.ts` | Environment variable loader with validation |
| `tests/setup/auth.setup.ts` | Global auth setup — logs in once and saves browser storage state |
| `tests/capabilities/shifts.test.ts` | Automated tests: create, edit, and delete a shift |
| `TEST_CASES.md` | Full manual test case documentation for the Shifts module |
| `eslint.config.mjs` | ESLint config (TypeScript + Playwright rules) |
| `.prettierrc` | Prettier formatting config |
| `.github/workflows/playwright.yml` | CI pipeline: lint → test on every push/PR |

### What is covered

The test suite runs three serial tests that chain together:

1. **Create** — opens the add shift form, fills all fields (title, description, type, resources, date, time), saves, and asserts the event appears on the calendar
2. **Edit** — double-clicks the created shift, changes the shift type, saves, and asserts the calendar reflects the update
3. **Delete** — double-clicks the edited shift, deletes it, and asserts the event is gone from the calendar

The `ShiftsPage` POM also exposes helpers for filters (employee, position, telephone, note) and the day-range slider, ready for additional tests.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A VPN connection to Germany (required to reach the demo platform)
- Access credentials for the demo environment

---

## Setup

**1. Clone the repo**

```bash
git clone <repo-url>
cd playwright-ts-test
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install chromium --with-deps
```

**4. Configure environment variables**

Create a `.env` file in the project root:

```env
BASE_URL=https://werkstattplanung.net
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
```

> The `.env` file is gitignored and never committed.

---

## Running the tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (all configured browsers) |
| `npm run test:chromium` | Run tests in Chromium only |
| `npm run test:headed` | Run with a visible browser window |
| `npm run test:debug` | Open Playwright Inspector for step-by-step debugging |
| `npm run setup` | Run auth setup only (generates `playwright/.auth/admin.json`) |
| `npm run report` | Open the last HTML test report |

### First run note

The auth setup project runs automatically before the tests. It logs in with the credentials from `.env`, then saves the browser storage state to `playwright/.auth/admin.json`. Subsequent tests reuse this state — no repeated logins.

---

## Linting and formatting

| Command | Description |
|---------|-------------|
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix fixable lint issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing (used in CI) |

---

## CI — GitHub Actions

The pipeline runs on every push and pull request to `main`:

1. **Lint job** — runs `eslint` and `prettier --check`
2. **Test job** — runs after lint passes, executes `npm run test:chromium`

The HTML report is uploaded as an artifact after every run. Screenshots and videos are uploaded on failure.

### Required GitHub secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `BASE_URL` | The base URL of the demo platform |
| `ADMIN_USERNAME` | Login username |
| `ADMIN_PASSWORD` | Login password |

---

## Project structure

```
playwright-ts-test/
├── src/
│   ├── config/
│   │   └── env.ts               # Env var loader
│   └── pages/
│       ├── LoginPage.ts         # Login POM
│       └── ShiftsPage.ts        # Shifts POM
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts        # Global auth setup
│   └── capabilities/
│       └── shifts.test.ts       # Shifts test suite
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline
├── TEST_CASES.md                # Manual test documentation
├── playwright.config.ts
├── eslint.config.mjs
├── .prettierrc
└── tsconfig.json
```
