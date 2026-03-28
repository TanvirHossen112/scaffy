# SCAFFY — AI PROJECT CONTEXT DOCUMENT

# Feed this file to any AI agent to instantly understand

# the full project, goals, decisions, and current status.

# Last Updated: Sprint 1 Complete

---

# 🧠 WHO ARE WE

## The Team

- Project Manager: Claude (AI)
- Lead Developer: Tanvir Hossen (GitHub: TanvirHossen112)
- Role Split:
  - Claude → Planning, architecture, code generation,
    PR reviews, sprint management, reporting
  - Tanvir → Writing code, making commits, PRs, decisions

## Project Type

Open source CLI tool built with Node.js
Published on npm, hosted on GitHub
MIT License

---

# 🎯 WHAT IS SCAFFY

## One Line

"One command. Any framework. Ready to code."

## The Problem It Solves

Every developer wastes 30-60 minutes setting up a new
project — googling install commands, figuring out versions,
installing dependencies manually, configuring Docker and
databases. Scaffy eliminates all of that.

## The Solution

A universal CLI scaffolding tool that:

- Works across ANY framework (Laravel, NestJS, Vue, Django...)
- Uses the framework's OFFICIAL installer — never stores templates
- Checks requirements BEFORE running (nothing breaks halfway)
- Is driven by a community plugin system (3 files to add a framework)
- Supports multiple versions per framework

## The Difference From Existing Tools

|                      | Traditional Tools         | Scaffy                 |
| -------------------- | ------------------------- | ---------------------- |
| Multi-framework      | ❌ One tool per framework | ✅ All frameworks      |
| Up to date           | ❌ Stale templates        | ✅ Official CLI always |
| Requirement check    | ❌ Breaks halfway         | ✅ Validates first     |
| Community extensible | ❌ Closed                 | ✅ 3 files to add      |
| Version management   | ❌ One version            | ✅ Multiple versions   |

---

# 🏗️ TECHNICAL ARCHITECTURE

## Tech Stack

- Runtime: Node.js 18+
- Language: JavaScript (CommonJS — NOT ESM)
- Module system: require() and module.exports ONLY
- Programming style: Functional (pure functions, no classes)
- Package manager: npm
- Testing: Jest (80% coverage threshold)
- Linting: ESLint + Prettier
- Pre-commit: Husky + lint-staged
- CI/CD: GitHub Actions

## CRITICAL: Module System Rule

Scaffy uses CommonJS strictly. This is non-negotiable.
ALWAYS use require() and module.exports.
NEVER use import/export ESM syntax.
Reason: Jest works natively, zero contributor friction.

## CRITICAL: Programming Style Rule

All core/ modules use functional programming.
Pure functions only. No classes. No 'this'.
Every function independently exportable and testable.

## Folder Structure

```
scaffy/
├── cli.js                    # Entry point
├── core/
│   ├── detector.js           # Checks required tools (functional)
│   ├── registry.js           # Loads/searches plugins (functional)
│   ├── interviewer.js        # User questions (functional)
│   ├── executor.js           # Command runner (TODO Sprint 2)
│   ├── utils.js              # Shared helpers (TODO Sprint 2)
│   ├── plugin-validator.js   # Validates plugins (TODO Sprint 2)
│   └── tests/
│       ├── detector.test.js
│       ├── registry.test.js
│       └── interviewer.test.js
├── registry/
│   ├── index.json            # Master framework list
│   ├── php/
│   │   ├── laravel/
│   │   │   ├── plugin.json
│   │   │   ├── v11/
│   │   │   │   ├── questions.js
│   │   │   │   ├── scaffold.js
│   │   │   │   └── tests/scaffold.test.js
│   │   │   └── v10/
│   │   └── symfony/v7/
│   ├── javascript/
│   │   ├── nestjs/v10/
│   │   ├── vuejs/v3/
│   │   ├── nextjs/v14/
│   │   └── expressjs/v4/
│   ├── python/
│   │   ├── django/v5/
│   │   ├── fastapi/v0/
│   │   └── flask/v3/
│   └── go/gin/v1/
├── test-utils/
│   ├── mock-runner.js        # Fake command runner for tests
│   ├── sandbox.js            # Temp folders for integration tests
│   └── plugin-contract.js    # Auto validates plugin structure
└── .github/
    ├── workflows/
    │   ├── ci.yml            # Runs on every PR
    │   └── test-plugins.yml  # Runs when registry/ changes
    └── ISSUE_TEMPLATE/
```

---

# 🔌 THE PLUGIN SYSTEM

## How It Works

Every framework is a self-contained plugin of exactly 3 files.
Scaffy runs the framework's OFFICIAL installer — never copies files.

## Plugin Contract (3 Files)

### 1. plugin.json — Identity and requirements

```json
{
  "name": "Laravel",
  "alias": ["laravel"],
  "language": "php",
  "latest": "v11",
  "versions": ["v11", "v10"],
  "description": "The PHP Framework for Web Artisans",
  "requires": [
    {
      "tool": "php",
      "checkCommand": "php --version",
      "parseVersion": "PHP ([0-9.]+)",
      "minVersion": "8.2.0",
      "installGuide": {
        "mac": "brew install php",
        "linux": "sudo apt install php8.2",
        "windows": "https://windows.php.net/download",
        "docs": "https://www.php.net"
      }
    },
    {
      "tool": "composer",
      "checkCommand": "composer --version",
      "installGuide": {
        "mac": "brew install composer",
        "linux": "sudo apt install composer",
        "docs": "https://getcomposer.org"
      }
    }
  ],
  "maintainer": "community"
}
```

### 2. questions.js — What to ask user

```javascript
module.exports = [
  {
    type: 'list',
    name: 'starterKit',
    message: 'Starter kit?',
    choices: ['Breeze', 'Jetstream', 'None'],
  },
  {
    type: 'list',
    name: 'database',
    message: 'Database?',
    choices: ['mysql', 'postgresql', 'sqlite'],
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Add Docker (Sail)?',
  },
];
```

### 3. scaffold.js — What commands to run

```javascript
module.exports = async (answers, utils) => {
  const { projectName, starterKit, database, docker } = answers;

  // ALWAYS use official installer
  await utils.run(`composer create-project laravel/laravel ${projectName}`);

  if (starterKit === 'Breeze') {
    await utils.runInProject(projectName, `php artisan breeze:install`);
  }

  utils.success(`✅ Laravel v11 ready! cd ${projectName}`);
};
```

## The utils API (available in every scaffold.js)

- utils.run(command) — run in current dir
- utils.runInProject(name, command) — run inside project folder
- utils.setEnv(project, vars) — set .env variables
- utils.appendToFile(path, content) — append to any file
- utils.log(message) — info output
- utils.success(message) — green success output
- utils.warn(message) — yellow warning output

## Adding A New Framework = 3 Files Only

Anyone can add a framework by:

1. Creating registry/<language>/<framework>/plugin.json
2. Creating registry/<language>/<framework>/<version>/questions.js
3. Creating registry/<language>/<framework>/<version>/scaffold.js
4. Adding entry to registry/index.json
5. Writing tests in <version>/tests/scaffold.test.js
6. Submitting a PR

---

# 🌿 GIT WORKFLOW

## Branch Strategy

- main → stable, production only
- develop → integration, all features merge here
- ALWAYS branch from develop, NEVER from main

## Branch Naming

- feature/xxx → new features
- bugfix/xxx → bug fixes
- plugin/xxx → new framework plugins
- test/xxx → adding tests
- docs/xxx → documentation
- ci/xxx → CI/CD changes
- refactor/xxx → code improvements

## Commit Convention (Conventional Commits)

- feat: new feature
- fix: bug fix
- test: adding tests
- docs: documentation
- chore: setup/config
- refactor: code improvement
- plugin: new framework plugin
- ci: CI/CD changes

## PR Rules

- Always PR to develop (never main)
- Must pass CI (ESLint + Prettier + Jest)
- Must have tests for new code
- Must use PR template
- Link issue with Closes #XXX
- Use squash merge to keep history clean

## Branch Protection

- main: requires PR, linear history, CI must pass
- develop: requires PR, linear history, CI must pass

---

# 📋 AGILE PROCESS

## Tools

- GitHub Issues → tasks and bugs
- GitHub Projects → kanban board (Scaffy Roadmap)
- GitHub Milestones → milestone tracking
- GitHub Actions → CI/CD

## Sprint Structure

- Sprint length: 1 week
- Branch from develop for every issue
- PR back to develop when done
- Claude gives sprint report at end

## Issue Labels

- type:feature, type:bug, type:test, type:docs, type:plugin
- priority:critical, priority:high, priority:medium, priority:low
- status:in-progress, status:blocked, status:needs-review

## Board Columns

- Backlog → Sprint Ready → In Progress → In Review → Done

## Definition of Done

An issue is ONLY done when:

- Code written
- Tests written and passing
- PR reviewed and merged to develop
- No ESLint errors
- Card moved to Done on board

---

# 📊 CURRENT STATUS

## Completed — Sprint 1 ✅

- #001 npm project initialized (package.json, .gitignore, LICENSE)
- #002 Full folder structure created
- #003 ESLint + Prettier configured
- #004 Jest configured (80% threshold)
- #005 Husky + lint-staged pre-commit hooks
- #006 cli.js entry point (commander, chalk, figlet, inquirer)
- #007 detector.js built (functional style) + tests
- #008 registry.js built (functional style) + tests
- #009 interviewer.js built (functional style) + tests
- #010 GitHub Actions CI (Node 18.x, 20.x, latest)
- README.md (professional, with animated header)
- CONTRIBUTING.md (professional, full plugin guide)

## Currently Passing

- 67 tests passing
- CI green on develop
- All Sprint 1 branches deleted

## Not Yet Built (Sprint 2+)

- executor.js (command runner)
- utils.js (shared helpers)
- plugin-validator.js (validates plugin structure)
- Laravel v11 plugin (questions + scaffold + tests)
- NestJS v10 plugin (questions + scaffold + tests)
- VueJS v3 plugin (questions + scaffold + tests)
- cli.js full end-to-end connection
- npm publish

---

# 🏁 MILESTONES

## v0.1.0 — Hello World (40% complete)

Goal: Working CLI with 3 plugins, published on npm

- [x] Core engine built
- [ ] Laravel, NestJS, VueJS plugins
- [ ] Full end-to-end working
- [ ] Published on npm

## v0.2.0 — Community Ready

Goal: Plugin contribution system, CI validation, 15+ plugins

- [ ] Plugin contribution CI validation
- [ ] Full documentation site
- [ ] 15+ framework plugins

## v0.3.0 — Growth

Goal: AI mode, external plugins, Discord

- [ ] AI mode (describe project in plain English)
- [ ] scaffy add github:user/plugin
- [ ] Discord community

## v1.0.0 — Ecosystem

Goal: VS Code extension, plugin marketplace

- [ ] VS Code extension
- [ ] Plugin marketplace website

---

# 🎯 SPRINT 2 PLAN (NOT STARTED)

## Goal

Build first 3 real working plugins and connect
everything together in cli.js

## Issues To Create

- #011 → Build executor.js + utils.js (core runner)
- #012 → Connect cli.js end to end
- #013 → Laravel v11 plugin + tests
- #014 → NestJS v10 plugin + tests
- #015 → VueJS v3 plugin + tests
- #016 → Smoke testing all plugins

---

# 💰 BUSINESS MODEL

## Revenue

- Buy Me A Coffee: buymeacoffee.com/TanvirHossen112
- GitHub Sponsors (future)
- No ads, no paywalls, always free and open source

## Success Metrics

- Phase 1: 100 GitHub stars, 5 plugins
- Phase 2: 500 stars, 15 plugins, 10 contributors
- Phase 3: 2000 stars, 50+ plugins, npm top 1000
- Phase 4: 5000+ stars, industry adoption

## Target Users

- Junior devs who don't know setup steps
- Senior devs tired of repetitive setup
- Teams wanting standardized project structure
- Open source contributors maintaining frameworks

---

# 🔑 KEY DECISIONS MADE

1. CommonJS over ESM
   → Jest native support, zero contributor friction

2. Functional programming over OOP
   → Pure functions, independently testable, no classes

3. Official installers over template files
   → Always fresh, never stale, community maintainable

4. Plugin system with 3 files
   → Low barrier to contribution, self-contained, versioned

5. Requirement checking before scaffolding
   → Never leave system in broken state

6. develop branch as default
   → main is always stable and deployable

7. Squash merge strategy
   → Clean git history on develop and main

8. 80% test coverage threshold
   → Quality gate, raised as project matures

---

# 📦 DEPENDENCIES

## Production

- commander → CLI argument parsing
- chalk → Terminal colors
- figlet → ASCII art banner
- ora → Loading spinners
- inquirer → Interactive prompts
- semver → Version comparison

## Development

- jest → Testing
- eslint → Linting
- prettier → Formatting
- husky → Pre-commit hooks
- lint-staged → Run checks on staged files only

---

# 🤖 INSTRUCTIONS FOR AI AGENT

If you are an AI agent reading this file, here is
exactly how to work with Tanvir on this project:

1. You are the PROJECT MANAGER. Tanvir is the DEVELOPER.
   You plan, architect, and generate code.
   Tanvir writes, commits, and makes final decisions.

2. Always follow the agile process:
   - Plan sprints with GitHub Issues
   - One branch per issue
   - PR to develop with proper message
   - Move cards on board

3. Always write code in:
   - CommonJS (require/module.exports)
   - Functional style (no classes)
   - With tests included

4. Always give PR messages when asked

5. Sprint report format:
   ✅ Completed: X tasks
   🔄 Carried over: X tasks
   🐛 Bugs found/fixed: X
   📊 Test coverage: XX%
   🎯 Milestone progress: XX%

6. Current branch to work on: develop
   Current sprint: Sprint 2 (not started)
   Next task: Create Sprint 2 issues

7. GitHub repo: github.com/TanvirHossen112/scaffy
   npm package name: scaffy-tool
   Node requirement: >=18.0.0

---

# 📝 NOTES AND LESSONS LEARNED

- GitHub issue numbers never reset even if deleted
  (first 3 issues were deleted, so issues start at #4 not #1)
- package.json must NOT have "type":"module" (breaks Jest)
- GitHub Actions YAML — strategy and steps must be
  indented INSIDE the job, not at job level
- lint-staged should NOT run jest --findRelatedTests
  on config files — use --passWithNoTests or run
  full npm test in pre-commit hook instead
- Branch protection: set yourself as bypass actor
  when working solo so you can merge your own PRs
- Use squash merge to keep git history clean
- Draft issues on GitHub Projects board = tasks (private)
  Real issues on repo = trackable work items (public)
