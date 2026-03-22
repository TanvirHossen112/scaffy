<div align="center">

# Contributing to Scaffy

**Thank you for investing your time in contributing to Scaffy.**

Every contribution — whether it's a bug report, a new framework plugin, a test, or a typo fix — makes Scaffy better for thousands of developers around the world. This guide will walk you through everything you need to know to contribute effectively.

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [First Time Contributing?](#-first-time-contributing)
- [Ways To Contribute](#-ways-to-contribute)
- [Development Setup](#️-development-setup)
- [Project Structure](#-project-structure)
- [Branching Strategy](#-branching-strategy)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Adding A Framework Plugin](#-adding-a-framework-plugin)
- [Writing Tests](#-writing-tests)
- [Code Style](#-code-style)
- [Reporting Bugs](#-reporting-bugs)
- [Requesting Features](#-requesting-features)
- [Getting Help](#-getting-help)

---

## 🤝 Code of Conduct

Scaffy is committed to providing a welcoming and inclusive environment for everyone, regardless of experience level, gender, gender identity, sexual orientation, disability, personal appearance, race, ethnicity, age, religion, or nationality.

**We expect all contributors to:**

- Be kind, patient, and respectful in all interactions
- Welcome contributors of all experience levels — especially beginners
- Accept constructive feedback openly and graciously
- Focus on what is best for the community, not the individual
- Show empathy toward other community members

**We will not tolerate:**

- Harassment, intimidation, or discrimination of any kind
- Dismissive or condescending responses to questions
- Personal attacks or insults
- Publishing others' private information without explicit permission

Violations may result in removal from the project. If you experience or witness unacceptable behavior, please report it by opening a private issue or contacting the maintainer directly.

---

## 👋 First Time Contributing?

Welcome! Everyone starts somewhere. Here are some suggestions for your first contribution:

**Start small:**
- Look for issues labeled [`good first issue`](https://github.com/TanvirHossen112/scaffy/labels/good%20first%20issue) — these are intentionally approachable
- Fix a typo or improve clarity in the documentation
- Add a missing test for an existing function
- Improve an error message

**Understand the project first:**
- Read this entire document
- Read the [README](README.md) to understand what Scaffy does
- Browse the `core/` and `registry/` folders to understand the architecture
- Run `npm test` and make sure everything passes on your machine

**Don't be afraid to ask:**
- Open a discussion if you're unsure where to start
- Comment on an issue before working on it — someone may already be working on it
- Ask questions in your PR — that's what the review process is for

---

## 💡 Ways To Contribute

### 🐛 Reporting Bugs
Found something broken? Open an issue using the **Bug Report** template. A good bug report includes reproduction steps, your environment details, and the exact error output. See [Reporting Bugs](#-reporting-bugs) for the full guide.

### ✨ Requesting Features
Have an idea that would make Scaffy better? Open an issue using the **Feature Request** template. Describe the problem you're trying to solve — not just the solution — so we can discuss the best approach together.

### 🔌 Adding A Framework Plugin
This is the single most impactful contribution you can make. Every new plugin immediately helps developers who use that framework. It takes less than 30 minutes and requires only 3 files. See [Adding A Framework Plugin](#-adding-a-framework-plugin) for the complete step-by-step guide.

### 🔄 Updating An Existing Plugin
Frameworks release new versions. When they do, someone needs to add support. If you notice a plugin is outdated — create a new version folder inside the existing plugin. Follow the same process as adding a new plugin.

### 🧪 Writing Tests
More test coverage means more confidence in every release. Browse the `core/tests/` folder and look for functions that have incomplete test coverage. Every new test you write directly protects against future regressions.

### 📖 Improving Documentation
Clear documentation lowers the barrier to entry for new contributors. Improvements to the README, this guide, inline code comments, and the wiki are always welcome — even small clarity improvements.

### 🔍 Reviewing Pull Requests
If you have experience with Node.js CLI tools or any of the frameworks Scaffy supports, reviewing open PRs is incredibly valuable. A thoughtful review accelerates the contribution cycle for everyone.

---

## 🛠️ Development Setup

### Prerequisites

Make sure you have the following installed before setting up:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 18.0.0 | `node --version` |
| npm | 8.0.0 | `npm --version` |
| Git | Any recent | `git --version` |

### Step-by-Step Setup

**1. Fork the repository**

Click the **Fork** button at the top right of the [Scaffy repository](https://github.com/TanvirHossen112/scaffy). This creates your own copy to work in.

**2. Clone your fork**

```bash
git clone https://github.com/TanvirHossen112/scaffy.git
cd scaffy
```

**3. Add the upstream remote**

This lets you pull in future changes from the original repo:

```bash
git remote add upstream https://github.com/TanvirHossen112/scaffy.git
```

Verify your remotes:
```bash
git remote -v
# origin    https://github.com/TanvirHossen112/scaffy.git (fetch)
# origin    https://github.com/TanvirHossen112/scaffy.git (push)
# upstream  https://github.com/TanvirHossen112/scaffy.git (fetch)
# upstream  https://github.com/TanvirHossen112/scaffy.git (push)
```

**4. Install dependencies**

```bash
npm install
```

**5. Verify your setup**

```bash
npm test
```

All tests should pass. If any fail, please [open an issue](https://github.com/TanvirHossen112/scaffy/issues) before continuing.

**6. Try the CLI**

```bash
node cli.js --help
node cli.js --version
node cli.js list
```

You are now ready to contribute.

### Keeping Your Fork In Sync

Before starting any new branch, sync your fork with upstream:

```bash
git checkout develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

---

## 📁 Project Structure

Understanding where things live will help you navigate the codebase confidently.

```
scaffy/
│
├── cli.js                        # Entry point — command routing and banner
│
├── core/                         # The engine — all core logic lives here
│   ├── detector.js               # Checks if required tools are installed
│   ├── registry.js               # Loads and searches framework plugins
│   ├── interviewer.js            # Asks the user questions interactively
│   ├── executor.js               # Runs shell commands safely
│   ├── utils.js                  # Shared helper functions
│   └── tests/                    # Unit tests for every core module
│       ├── detector.test.js
│       ├── registry.test.js
│       └── interviewer.test.js
│
├── registry/                     # All framework plugins live here
│   ├── index.json                # Master list — register new plugins here
│   │
│   ├── php/
│   │   ├── laravel/
│   │   │   ├── plugin.json       # Framework metadata & requirements
│   │   │   ├── v11/
│   │   │   │   ├── questions.js  # Questions to ask the user
│   │   │   │   ├── scaffold.js   # Commands to run
│   │   │   │   └── tests/
│   │   │   │       └── scaffold.test.js
│   │   │   └── v10/
│   │   └── symfony/
│   │
│   ├── javascript/
│   │   ├── nestjs/
│   │   ├── vuejs/
│   │   ├── nextjs/
│   │   └── expressjs/
│   │
│   ├── python/
│   │   ├── django/
│   │   ├── fastapi/
│   │   └── flask/
│   │
│   └── go/
│       └── gin/
│
├── test-utils/                   # Shared testing utilities
│   ├── mock-runner.js            # Fake command runner for dry-run tests
│   ├── sandbox.js                # Creates temp folders for integration tests
│   └── plugin-contract.js        # Validates plugin structure automatically
│
├── docs/                         # Additional documentation
│
└── .github/
    ├── workflows/
    │   ├── ci.yml                # Runs on every PR — tests, lint, format
    │   └── test-plugins.yml      # Runs when registry/ changes
    ├── ISSUE_TEMPLATE/           # Bug report, feature request, plugin request
    └── pull_request_template.md  # PR checklist
```

### Core Architecture Philosophy

Every module in `core/` is written in **functional programming style** — pure functions with no classes, no `this`, and no shared mutable state. This makes every function independently testable in complete isolation.

```javascript
// ✅ How Scaffy code is written — pure functions
const findFramework = query => {
  const q = query.toLowerCase().trim()
  return getFrameworks().find(f =>
    f.name.toLowerCase() === q ||
    f.alias.some(a => a.toLowerCase() === q)
  ) || null
}

module.exports = { findFramework }

// ❌ Not how Scaffy code is written — no classes
class Registry {
  findFramework(query) { ... }
}
```

Please follow this pattern in all core contributions.

---

## 🌿 Branching Strategy

Scaffy uses a simplified Git Flow. There are two permanent branches:

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code. Only release merges. |
| `develop` | Integration branch. All feature branches merge here. |

**Always branch from `develop`. Never branch from `main`.**

```bash
# Always start here
git checkout develop
git pull upstream develop
git checkout -b your-branch-name
```

### Branch Naming Convention

Use these prefixes consistently. They make the branch list readable and help CI know what kind of change is incoming.

| Prefix | Use For | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/scaffold-list-command` |
| `bugfix/` | Bug fixes | `bugfix/detector-version-crash` |
| `plugin/` | New framework plugins | `plugin/django-v5` |
| `test/` | Adding or improving tests | `test/registry-coverage` |
| `docs/` | Documentation only | `docs/improve-plugin-guide` |
| `refactor/` | Code improvements, no feature change | `refactor/executor-error-handling` |
| `ci/` | CI/CD configuration | `ci/add-codecov-reporting` |

**Use kebab-case. Be descriptive but concise.**

```bash
# ✅ Good branch names
git checkout -b plugin/django-v5
git checkout -b bugfix/detector-crashes-on-missing-composer
git checkout -b docs/clarify-plugin-contract

# ❌ Bad branch names
git checkout -b fix
git checkout -b my-changes
git checkout -b update
```

---

## 📝 Commit Convention

Scaffy follows the [Conventional Commits](https://www.conventionalcommits.org) specification. This enables automatic changelog generation and makes the git history readable as documentation.

### Format

```
<type>: <short description>

[optional body]

[optional footer]
```

### Types

| Type | When To Use |
|------|-------------|
| `feat` | A new feature or user-facing capability |
| `fix` | A bug fix |
| `test` | Adding or updating tests |
| `docs` | Documentation changes only |
| `chore` | Setup, config, dependencies, tooling |
| `refactor` | Code restructuring with no behavior change |
| `plugin` | A new or updated framework plugin |
| `ci` | Changes to CI/CD configuration |
| `perf` | Performance improvements |

### Rules

- Use the **imperative mood** in the subject line: "add django plugin" not "added django plugin"
- Keep the subject line under **72 characters**
- Reference the issue number when applicable
- Do not end the subject line with a period

### Examples

```bash
# ✅ Good commit messages
git commit -m "plugin: add django v5 plugin"
git commit -m "fix: detector crashes when composer is not in PATH"
git commit -m "feat: add scaffy search command with fuzzy matching"
git commit -m "test: add edge case tests for registry.findFramework"
git commit -m "docs: clarify scaffold.js utils API in plugin guide"
git commit -m "chore: upgrade inquirer to v9.2.0"

# ❌ Bad commit messages
git commit -m "fix stuff"
git commit -m "WIP"
git commit -m "changes"
git commit -m "Updated the thing"
```

---

## 🔀 Pull Request Process

### Before Opening A PR

Run through this checklist locally before pushing:

```bash
# 1. Make sure your branch is up to date
git fetch upstream
git rebase upstream/develop

# 2. Run the full test suite — all must pass
npm test

# 3. Check test coverage — must be above 80%
npm run test:coverage

# 4. Run the linter — zero errors allowed
npm run lint

# 5. Check formatting
npm run format:check
```

### Opening The PR

- Open your PR against the `develop` branch, **never `main`**
- Fill in the PR template completely — incomplete templates will be asked to complete before review
- Link the related issue using `Closes #XXX` in the PR body — this auto-closes the issue on merge
- Use a descriptive title that follows the commit convention: `plugin: add django v5 plugin`

### What Happens After You Open A PR

```
PR opened
    │
    ▼
CI runs automatically
    ├── ESLint check
    ├── Prettier format check
    ├── Full test suite (Node 18.x and 20.x)
    └── Coverage threshold check
    │
    ▼
If CI passes → maintainer reviews
    │
    ├── Changes requested → you address feedback → re-review
    │
    └── Approved → squash merged into develop ✅
```

### Review Etiquette

- Be patient — reviews may take a few days
- Respond to all review comments, even if just to acknowledge them
- If you disagree with feedback, explain your reasoning respectfully
- Mark conversations as resolved once you have addressed them

### Your PR Will Be Rejected If

```
❌ Tests are missing for new code
❌ Any existing test is failing
❌ ESLint errors are present
❌ PR template is not filled in
❌ Branch is not based on develop
❌ Commit messages don't follow the convention
❌ scaffold.js copies template files instead of using official CLI
❌ plugin.json is missing required fields
❌ No entry added to registry/index.json
```

---

## 🔌 Adding A Framework Plugin

This is the most impactful contribution you can make to Scaffy. Here is the complete step-by-step guide.

### The 3-File Contract

Every plugin consists of exactly 3 files. Nothing more is needed:

```
registry/
└── <language>/
    └── <framework>/
        ├── plugin.json          ← Who am I? What do I need?
        └── <version>/
            ├── questions.js     ← What should I ask the user?
            └── scaffold.js      ← What commands should I run?
```

### Step 1 — Check It Doesn't Already Exist

Search the registry before starting:

```bash
# Check registry/index.json
cat registry/index.json | grep -i "your-framework"

# Or browse the folder
ls registry/<language>/
```

If it exists but is outdated, add a new version folder instead of a new plugin entirely.

### Step 2 — Create Your Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b plugin/<framework-name>-<version>

# Example
git checkout -b plugin/django-v5
```

### Step 3 — Create The Folder Structure

```bash
# Replace with your actual language, framework, and version
mkdir -p registry/<language>/<framework>/<version>/tests

touch registry/<language>/<framework>/plugin.json
touch registry/<language>/<framework>/<version>/questions.js
touch registry/<language>/<framework>/<version>/scaffold.js
touch registry/<language>/<framework>/<version>/tests/scaffold.test.js
```

Example for Django v5:

```bash
mkdir -p registry/python/django/v5/tests

touch registry/python/django/plugin.json
touch registry/python/django/v5/questions.js
touch registry/python/django/v5/scaffold.js
touch registry/python/django/v5/tests/scaffold.test.js
```

### Step 4 — Write plugin.json

`plugin.json` defines who your plugin is and what tools the user needs before scaffolding can begin. Every field is required.

```json
{
  "name": "Django",
  "alias": ["django"],
  "language": "python",
  "latest": "v5",
  "versions": ["v5"],
  "description": "The web framework for perfectionists with deadlines",
  "requires": [
    {
      "tool": "python",
      "checkCommand": "python3 --version",
      "parseVersion": "Python ([0-9.]+)",
      "minVersion": "3.10.0",
      "installGuide": {
        "mac": "brew install python",
        "linux": "sudo apt install python3",
        "windows": "https://www.python.org/downloads",
        "docs": "https://www.python.org"
      }
    },
    {
      "tool": "pip",
      "checkCommand": "pip3 --version",
      "installGuide": {
        "mac": "brew install python (pip included)",
        "linux": "sudo apt install python3-pip",
        "windows": "https://pip.pypa.io/en/stable/installation",
        "docs": "https://pip.pypa.io"
      }
    }
  ],
  "maintainer": "community"
}
```

**Field reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Display name shown to users |
| `alias` | string[] | ✅ | Names users can type: `scaffy django` |
| `language` | string | ✅ | Programming language — must match folder name |
| `latest` | string | ✅ | The default version (must exist in `versions`) |
| `versions` | string[] | ✅ | All supported versions — must match folder names |
| `description` | string | ✅ | One-line description of the framework |
| `requires` | object[] | ✅ | Tools that must be installed before scaffolding |
| `maintainer` | string | ✅ | Use `"community"` for community-added plugins |

**Requirement object reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tool` | string | ✅ | Tool name displayed to user |
| `checkCommand` | string | ✅ | Shell command to check if tool exists |
| `parseVersion` | string | ⬜ | Regex to extract version number from output |
| `minVersion` | string | ⬜ | Minimum semver version required |
| `installGuide` | object | ✅ | Per-OS install instructions |
| `installGuide.mac` | string | ⬜ | macOS install command |
| `installGuide.linux` | string | ⬜ | Linux install command |
| `installGuide.windows` | string | ⬜ | Windows install URL or command |
| `installGuide.docs` | string | ✅ | Official documentation URL — always required |

### Step 5 — Write questions.js

`questions.js` exports an array of [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) question objects. These are the questions Scaffy will ask the user **after** the base project name question (which Scaffy handles automatically).

Only ask questions that meaningfully change what commands get run. Don't ask questions just for the sake of it.

```javascript
// registry/python/django/v5/questions.js

module.exports = [
  {
    type: 'input',
    name: 'appName',
    message: 'Initial app name?',
    default: 'core',
    validate: input => {
      if (!input.trim()) return 'App name is required'
      if (!/^[a-z0-9_]+$/.test(input)) {
        return 'Use only lowercase letters, numbers, and underscores'
      }
      return true
    }
  },
  {
    type: 'list',
    name: 'database',
    message: 'Default database?',
    choices: [
      { name: 'SQLite (recommended for development)', value: 'sqlite3' },
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'MySQL', value: 'mysql' }
    ],
    default: 'sqlite3'
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Add Docker support?',
    default: false
  }
]
```

**Supported question types:** `input`, `list`, `checkbox`, `confirm`, `password`

**Always include:**
- A `validate` function on `input` questions
- A sensible `default` value on every question
- Descriptive `name` labels in `list` choices

### Step 6 — Write scaffold.js

`scaffold.js` is the heart of your plugin. It receives the user's answers and the `utils` helper, and runs the official framework commands in the correct order.

**The golden rule: always use the framework's official installer. Never copy files.**

```javascript
// registry/python/django/v5/scaffold.js

module.exports = async (answers, utils) => {
  const { projectName, appName, database, docker } = answers

  // ── Step 1: Install Django via official pip ───────────
  await utils.run('pip3 install django')

  // ── Step 2: Create project via official django-admin ──
  await utils.run(
    `django-admin startproject ${projectName}`
  )

  // ── Step 3: Create the initial app ────────────────────
  await utils.runInProject(projectName,
    `python manage.py startapp ${appName}`
  )

  // ── Step 4: Configure database in settings.py ─────────
  if (database !== 'sqlite3') {
    await utils.appendToFile(
      `${projectName}/requirements.txt`,
      database === 'postgresql'
        ? 'psycopg2-binary\n'
        : 'mysqlclient\n'
    )
  }

  // ── Step 5: Add Docker support if requested ───────────
  if (docker) {
    await utils.appendToFile(
      `${projectName}/Dockerfile`,
      [
        'FROM python:3.11-slim',
        'WORKDIR /app',
        'COPY requirements.txt .',
        'RUN pip install -r requirements.txt',
        'COPY . .',
        'EXPOSE 8000',
        'CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]'
      ].join('\n')
    )
  }

  // ── Done ──────────────────────────────────────────────
  utils.success(`
    ✅ Django v5 project ready!
    📁 cd ${projectName}
    🚀 python manage.py runserver
  `)
}
```

**The `utils` API — everything available to scaffold.js:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `run` | `run(command)` | Run a shell command in the current directory |
| `runInProject` | `runInProject(projectName, command)` | Run a command inside the newly created project folder |
| `setEnv` | `setEnv(projectName, vars)` | Set variables in the project's `.env` file |
| `appendToFile` | `appendToFile(filePath, content)` | Append content to any file |
| `log` | `log(message)` | Print an info message to the terminal |
| `success` | `success(message)` | Print a success message (green) |
| `warn` | `warn(message)` | Print a warning message (yellow) |

### Step 7 — Register In index.json

Open `registry/index.json` and add your framework to the `frameworks` array. Maintain alphabetical order within each language group:

```json
{
  "frameworks": [
    {
      "name": "Django",
      "alias": ["django"],
      "language": "python",
      "latest": "v5",
      "versions": ["v5"],
      "path": "python/django"
    }
  ]
}
```

### Step 8 — Write Tests

Every plugin **must** ship with tests. Tests verify that your `scaffold.js` generates the correct commands for every combination of user answers — without actually running anything on the reviewer's machine.

```javascript
// registry/python/django/v5/tests/scaffold.test.js

const scaffold = require('../scaffold')

// ─── Mock Utils Factory ───────────────────────────────────
// Creates a fake utils object that records all calls
// instead of actually running shell commands
const createMockUtils = () => {
  const calls = []

  const utils = {
    run: async cmd =>
      calls.push({ type: 'run', context: 'root', cmd }),

    runInProject: async (project, cmd) =>
      calls.push({ type: 'run', context: project, cmd }),

    appendToFile: async (path, content) =>
      calls.push({ type: 'file', path, content }),

    setEnv: async (project, vars) =>
      calls.push({ type: 'env', project, vars }),

    success: () => {},
    log: () => {},
    warn: () => {}
  }

  return {
    utils,
    // Helper: did a command matching this string run?
    ran: partial =>
      calls.some(c => c.cmd && c.cmd.includes(partial)),
    // Helper: was a file written matching this path?
    wrote: partial =>
      calls.some(c => c.path && c.path.includes(partial)),
    // Access all recorded calls for detailed assertions
    calls: () => calls
  }
}

// ─── Default Answers ─────────────────────────────────────
const defaultAnswers = {
  projectName: 'test-project',
  appName: 'core',
  database: 'sqlite3',
  docker: false
}

// ─── Tests ───────────────────────────────────────────────
describe('Django v5 Scaffold', () => {

  describe('always runs', () => {

    test('installs django via pip', async () => {
      const mock = createMockUtils()
      await scaffold(defaultAnswers, mock.utils)
      expect(mock.ran('pip3 install django')).toBe(true)
    })

    test('creates project via django-admin', async () => {
      const mock = createMockUtils()
      await scaffold(defaultAnswers, mock.utils)
      expect(
        mock.ran('django-admin startproject test-project')
      ).toBe(true)
    })

    test('creates initial app', async () => {
      const mock = createMockUtils()
      await scaffold(defaultAnswers, mock.utils)
      expect(mock.ran('startapp core')).toBe(true)
    })

  })

  describe('database configuration', () => {

    test('does not write requirements.txt for sqlite', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, database: 'sqlite3' },
        mock.utils
      )
      expect(mock.wrote('requirements.txt')).toBe(false)
    })

    test('writes psycopg2 for postgresql', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, database: 'postgresql' },
        mock.utils
      )
      const file = mock.calls().find(
        c => c.path && c.path.includes('requirements.txt')
      )
      expect(file).toBeDefined()
      expect(file.content).toContain('psycopg2-binary')
    })

    test('writes mysqlclient for mysql', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, database: 'mysql' },
        mock.utils
      )
      const file = mock.calls().find(
        c => c.path && c.path.includes('requirements.txt')
      )
      expect(file).toBeDefined()
      expect(file.content).toContain('mysqlclient')
    })

  })

  describe('docker support', () => {

    test('does not create Dockerfile when docker is false', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, docker: false },
        mock.utils
      )
      expect(mock.wrote('Dockerfile')).toBe(false)
    })

    test('creates Dockerfile when docker is true', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, docker: true },
        mock.utils
      )
      expect(mock.wrote('Dockerfile')).toBe(true)
    })

    test('Dockerfile exposes port 8000', async () => {
      const mock = createMockUtils()
      await scaffold(
        { ...defaultAnswers, docker: true },
        mock.utils
      )
      const dockerfile = mock.calls().find(
        c => c.path && c.path.includes('Dockerfile')
      )
      expect(dockerfile.content).toContain('EXPOSE 8000')
    })

  })

})
```

**Test coverage requirements for plugins:**

- Every boolean option (`docker`, `auth`, etc.) must have a test for both `true` and `false`
- Every `list` option must have a test for each meaningful choice
- The primary install command must always be tested
- The primary project creation command must always be tested

### Step 9 — Verify Everything

```bash
# Run all tests including yours
npm test

# Check your plugin appears in the list
node cli.js list

# Try searching for it
node cli.js search django
```

### Step 10 — Submit Your PR

```bash
git add .
git commit -m "plugin: add django v5 plugin"
git push origin plugin/django-v5
```

Open a PR against `develop` using the PR template. In the description, explain:
- What framework you added
- What questions it asks
- What official commands it runs
- Which versions are supported

---

## 🧪 Writing Tests

Scaffy takes testing seriously. Here is everything you need to know to write good tests for this project.

### Test File Location

Tests always live in a `tests/` folder adjacent to the file being tested:

```
core/
├── detector.js
└── tests/
    └── detector.test.js

registry/php/laravel/v11/
├── scaffold.js
└── tests/
    └── scaffold.test.js
```

### Running Tests

```bash
npm test                  # Run all tests once
npm run test:watch        # Re-run on file changes
npm run test:coverage     # Full coverage report
```

### Coverage Requirements

Scaffy enforces a minimum of **80% coverage** on branches, functions, lines, and statements. PRs that drop coverage below this threshold will not be merged.

### Writing Good Tests

```javascript
// ✅ Descriptive, specific test names
describe('findFramework()', () => {
  test('returns null when query does not match any framework', () => {})
  test('finds framework by exact name case-insensitively', () => {})
  test('finds framework by alias', () => {})
})

// ❌ Vague, unhelpful test names
describe('findFramework', () => {
  test('works', () => {})
  test('test 1', () => {})
  test('handles edge case', () => {})
})
```

```javascript
// ✅ Test one thing per test
test('returns null for unknown framework', () => {
  const result = findFramework('unknownxyz')
  expect(result).toBeNull()
})

// ❌ Testing multiple unrelated things in one test
test('framework stuff', () => {
  expect(findFramework('laravel').name).toBe('Laravel')
  expect(findFramework('unknownxyz')).toBeNull()
  expect(searchFrameworks('php').length).toBeGreaterThan(0)
})
```

```javascript
// ✅ Use beforeEach for shared setup
describe('Registry', () => {
  let frameworks

  beforeEach(() => {
    frameworks = getFrameworks()
  })

  test('returns at least one framework', () => {
    expect(frameworks.length).toBeGreaterThan(0)
  })
})
```

---

## 🎨 Code Style

Scaffy uses **ESLint** and **Prettier** to enforce consistent style automatically. Husky runs these checks before every commit — so if your commit goes through, it's clean.

### Module System — CommonJS Only

Scaffy uses CommonJS. This is a strict requirement, not a preference.

```javascript
// ✅ Always use require/module.exports
const chalk = require('chalk')
const { findFramework } = require('./registry')

module.exports = { findFramework, searchFrameworks }

// ❌ Never use ESM syntax
import chalk from 'chalk'
export const findFramework = () => {}
```

Why? Jest works natively with CommonJS. ESM requires additional configuration that creates friction for contributors. Every major Node.js CLI tool — ESLint, Prettier, create-react-app — uses CommonJS.

### Functional Style — No Classes

All code in `core/` must be written as pure functions:

```javascript
// ✅ Pure function — testable in isolation
const formatFrameworkLine = framework =>
  chalk.white(`  • ${framework.name}`) +
  chalk.gray(` (${framework.alias.join(', ')})`)

// ❌ Class — harder to test, more boilerplate
class FrameworkFormatter {
  format(framework) {
    return chalk.white(`  • ${framework.name}`)
  }
}
```

### Naming Conventions

```javascript
// Functions — camelCase, verb-first
const findFramework = () => {}
const buildVersionChoices = () => {}
const formatToolStatus = () => {}

// Constants — SCREAMING_SNAKE_CASE
const REGISTRY_PATH = path.join(__dirname, '..', 'registry')
const INDEX_PATH = path.join(REGISTRY_PATH, 'index.json')

// Files — camelCase
// detector.js, registry.js, mockRunner.js
```

### General Guidelines

- Keep functions small and focused — one function, one responsibility
- Avoid `console.log` in production code — use `utils.log()` instead
- Handle errors gracefully — never let the CLI crash with an unhandled exception
- Use early returns to avoid deep nesting
- Prefer descriptive variable names over short ones

---

## 🐛 Reporting Bugs

A well-written bug report dramatically reduces the time it takes to investigate and fix the issue. Please use the **Bug Report** issue template and include all of the following:

**Environment information:**
```bash
# Run these and paste the output
node --version
npm --version
scaffy --version
uname -a          # macOS/Linux
# or
ver               # Windows
```

**Reproduction steps:** List the exact commands you ran, in order, with the exact output you saw.

**Expected vs actual behavior:** What did you expect to happen? What happened instead?

**Error output:** Paste the complete error output — not a screenshot.

A bug report that says *"it doesn't work"* will be closed immediately. A bug report with full reproduction steps will be fixed fast.

---

## ✨ Requesting Features

Before opening a feature request, please search existing issues to make sure it hasn't already been requested or discussed.

When opening a feature request, focus on **the problem**, not the solution:

```
❌ "Add a --skip-install flag"

✅ "When I'm on a slow internet connection, waiting for
    npm install to complete during scaffolding is painful.
    I'd like a way to scaffold the project structure
    without installing dependencies."
```

The problem-first framing opens up better solutions. The maintainer or community may have a better approach than the specific feature you had in mind.

---

## 🙋 Getting Help

Stuck? Not sure where to start? There are several ways to get help:

- **Browse existing issues** — your question may already be answered
- **Open a discussion** — for questions that aren't bugs or feature requests
- **Comment on the issue** — if you're planning to work on something, say so first — someone may already be working on it and can save you duplicated effort

When asking for help, always include:
- What you were trying to do
- What you tried
- What happened instead
- Relevant code or error output

---

## ☕ Support The Project

Scaffy is completely free, open source, and built in spare time. If it saves you time on your projects, consider buying the maintainer a coffee. It genuinely helps keep the project alive and maintained.

<a href="https://buymeacoffee.com/TanvirHossen112">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" />
</a>

---

<div align="center">

**Thank you for contributing to Scaffy.** 🎉

Every contribution — no matter how small — makes a real difference to developers around the world.

</div>