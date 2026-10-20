# DemoQA Practice Form — Playwright POM Tests

End-to-end tests for the [DemoQA Practice Form](https://demoqa.com/automation-practice-form), written in TypeScript with Playwright Test and the Page Object Model.

## Project structure

```text
.
├── .github/workflows/playwright.yml  # CI, report artifact, GitHub Pages deployment
├── data/                             # Reusable test data
├── enums/                            # Gender, Hobby, and validation enums
├── fixtures/                         # Shared Playwright fixtures
├── page-objects/                     # BasePage and PracticeFormPage
├── tests/                            # Test cases and the prerequisite setup test
└── playwright.config.ts
```

## Requirements

- Node.js 24 (CI uses Node.js 24)
- npm

## Install and run locally

```bash
npm ci
npx playwright install chromium
npx playwright test
```

To run with a visible browser:

```bash
npx playwright test --headed
```

To run a specific test file:

```bash
npx playwright test tests/practice-form.spec.ts --headed
```

The Playwright HTML report is written to `playwright-report/`. Open it locally with:

```bash
npx playwright show-report
```

## Run and debug from Antigravity IDE

Install Microsoft's **Playwright Test for VS Code** extension in Antigravity. Open the **Testing** view to see Playwright tests and their Run buttons. Set a breakpoint and choose **Debug Test** to debug a test. Turn on **Show Browser** in the Playwright sidebar to watch the browser while tests run.

## GitHub Actions

The workflow is [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). It runs on pushes and pull requests targeting `main`, and can also be started manually. It first runs a setup check, then the tests. A failed setup prevents the test project from running; failures in individual tests do not stop the remaining tests. The workflow writes a **Test Execution Summary** with the environment, trigger, author, execution status, report links, and run logs. The Playwright HTML report is saved as a downloadable workflow artifact. On pushes to `main` and manual runs from `main`, the workflow publishes the latest report to GitHub Pages, including a fallback page if Playwright could not create a report.

### Enable GitHub Pages

Do this once in the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Settings → Actions → General** and make sure Actions are allowed for the repository. The workflow itself grants the Pages deployment job the required `pages: write` and `id-token: write` permissions.
4. Push a commit to `main` or run the workflow manually from the **Actions** tab. For a manual run, select **🧪 Playwright POM — Run Tests & Publish Report**, click **Run workflow**, and choose `main`.
5. When the `Publish HTML report to GitHub Pages` job completes, open the URL shown in that job's environment. This repository's expected URL is [https://vladryl.github.io/demoqa-automation-practice-form-ts/](https://vladryl.github.io/demoqa-automation-practice-form-ts/).

Pull requests run the tests and retain the report as an artifact, but do not deploy to Pages. Download it from the completed workflow run under **Artifacts**.
