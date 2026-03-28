<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&pause=1000&color=00D4FF&center=true&vCenter=true&width=800&lines=Scaffy+%F0%9F%9A%80;One+Command.+Any+Framework." alt="Scaffy" />

<p align="center">
  <strong>The universal CLI scaffolding tool for modern developers.</strong><br/>
  Set up any framework project in seconds — using official installers,<br/>driven by a community-powered plugin system.
</p>

<p align="center">
  <a href="https://github.com/TanvirHossen112/scaffy/actions/workflows/ci.yml">
    <img src="https://github.com/TanvirHossen112/scaffy/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://www.npmjs.com/package/scaffy-tool">
    <img src="https://img.shields.io/npm/v/scaffy-tool?color=cb3837&logo=npm" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/scaffy-tool">
    <img src="https://img.shields.io/npm/dm/scaffy-tool?color=cb3837&logo=npm" alt="npm downloads" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?logo=node.js" alt="Node" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  </a>
  <a href="CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </a>
  <a href="https://buymeacoffee.com/TanvirHossen112">
    <img src="https://img.shields.io/badge/☕-buy%20me%20a%20coffee-yellow" alt="Buy Me A Coffee" />
  </a>
</p>

<p align="center">
  <a href="#the-solution">Quick Start</a> ·
  <a href="#-available-frameworks">Frameworks</a> ·
  <a href="#-plugin-system">Plugin System</a> ·
  <a href="#-contributing">Contributing</a> ·
  <a href="#️-roadmap">Roadmap</a>
</p>

</div>

---

## The Problem

Every developer knows this pain. You want to start a new project. Instead of coding, you spend the next hour:

- Googling the exact install command for the framework
- Figuring out which version is currently stable
- Installing dependencies one by one
- Configuring Docker, databases, auth — all manually
- Realizing you missed a step halfway through

**Scaffy eliminates all of that.**

---

## The Solution

```bash
$ scaffy laravel

  🔍 Checking requirements...
    ✅ php — found
    ✅ composer — found

  ✅ All requirements met!

  ? Project name:  my-blog
  ? Starter kit:   Breeze
  ? Database:      PostgreSQL
  ? Docker (Sail): Yes

  ⠸ Scaffolding your Laravel project...

  ✅ Done! Your project is ready.
     📁 cd my-blog
     🚀 php artisan serve
```

One command. A few questions. Ready to code.

---

## ✨ Why Scaffy?

Existing scaffolding tools are framework-specific, opinionated, and go stale fast. Scaffy takes a fundamentally different approach.

|                             | Traditional Scaffolding    | Scaffy                             |
| --------------------------- | -------------------------- | ---------------------------------- |
| **Multi-framework support** | ❌ One tool per framework  | ✅ Every framework, one tool       |
| **Always up to date**       | ❌ Stores stale templates  | ✅ Uses official CLI commands      |
| **Requirement checking**    | ❌ Breaks halfway through  | ✅ Validates before starting       |
| **Community extensible**    | ❌ Closed, maintainer-only | ✅ Add any framework in 3 files    |
| **Version management**      | ❌ Usually locked to one   | ✅ Multiple versions per framework |

---

## ⚡ Quick Start

**Install**

```bash
npm install -g scaffy-tool
```

**Run**

```bash
# Interactive mode — Scaffy guides you through everything
scaffy

# Direct mode — jump straight to your framework
scaffy laravel
scaffy nestjs
scaffy django
```

**Other Commands**

```bash
scaffy list              # Browse all available frameworks
scaffy search <query>    # Search by name or language
scaffy --version         # Current version
scaffy --help            # Help
```

---

## 📋 Available Frameworks

<table>
<tr>
  <th>Language</th>
  <th>Framework</th>
  <th>Command</th>
  <th>Supported Versions</th>
</tr>
<tr>
  <td rowspan="2"><strong>PHP</strong></td>
  <td>Laravel</td>
  <td><code>scaffy laravel</code></td>
  <td>v11, v12, v13</td>
</tr>
<tr>
  <td>Symfony</td>
  <td><code>scaffy symfony</code></td>
  <td>v7</td>
</tr>
<tr>
  <td rowspan="4"><strong>JavaScript</strong></td>
  <td>NestJS</td>
  <td><code>scaffy nestjs</code></td>
  <td>v10, v11</td>
</tr>
<tr>
  <td>VueJS</td>
  <td><code>scaffy vue</code></td>
  <td>v3</td>
</tr>
<tr>
  <td>NextJS</td>
  <td><code>scaffy nextjs</code></td>
  <td>v14</td>
</tr>
<tr>
  <td>ExpressJS</td>
  <td><code>scaffy express</code></td>
  <td>v4</td>
</tr>
<tr>
  <td rowspan="3"><strong>Python</strong></td>
  <td>Django</td>
  <td><code>scaffy django</code></td>
  <td>v5</td>
</tr>
<tr>
  <td>FastAPI</td>
  <td><code>scaffy fastapi</code></td>
  <td>v1</td>
</tr>
<tr>
  <td><strong>Go</strong></td>
  <td>Gin</td>
  <td><code>scaffy gin</code></td>
  <td>v1</td>
</tr>
</table>

> **Missing your framework?** [Add it in 3 files](#-plugin-system) — it takes less than 30 minutes.

---

## 🔌 Plugin System

Scaffy's power comes from its plugin architecture. Every framework is a self-contained plugin — just **3 files**:

```
registry/
└── php/
    └── laravel/
        ├── plugin.json       ← framework metadata & requirements
        └── v11/
            ├── questions.js  ← what to ask the user
            └── scaffold.js   ← which official commands to run
```

### How It Works Under The Hood

Scaffy does **not** store template files. Instead, `scaffold.js` calls the framework's **own official installer** — ensuring your project is always set up correctly with the latest tooling:

```javascript
// registry/php/laravel/v11/scaffold.js
module.exports = async (answers, utils) => {
  const { projectName, starterKit, database } = answers;

  // Step 1 — Official Laravel installer
  await utils.run(`composer create-project laravel/laravel ${projectName}`);

  // Step 2 — Layered on top with your choices
  if (starterKit === 'Breeze') {
    await utils.runInProject(projectName, `php artisan breeze:install`);
  }
};
```

When a new framework version releases tomorrow, a community member can add support in minutes — with zero changes to Scaffy's core.

---

## 🛡️ Requirement Safety

Scaffy checks that all required tools are installed **before** running anything. Nothing is worse than a half-created broken project.

```bash
$ scaffy laravel

  🔍 Checking requirements...
    ✅ php — found
    ❌ composer — not found
       💻 Install (mac):    brew install composer
       💻 Install (linux):  sudo apt install composer
       📖 Docs: https://getcomposer.org/download

  ──────────────────────────────────────────
  ❌ Requirements not met.
     Please install missing tools and retry.
     Nothing was created. Your system is clean.
  ──────────────────────────────────────────
```

If something is missing, Scaffy tells you exactly how to fix it — for your specific OS.

---

## 🏗️ Architecture

```
scaffy/
├── cli.js                    # Entry point & command routing
├── core/
│   ├── detector.js           # Requirement checking engine
│   ├── registry.js           # Plugin loader & search
│   ├── interviewer.js        # User question engine
│   ├── executor.js           # Command runner
│   └── utils.js              # Shared utilities
└── registry/
    ├── index.json            # Master framework registry
    ├── php/laravel/          # Framework plugins
    ├── javascript/nestjs/
    ├── python/django/
    └── ...
```

Every core module is written in **functional programming style** — pure functions, no classes, every function independently testable in isolation.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode during development
npm run test:watch

# Full coverage report
npm run test:coverage
```

Scaffy maintains a minimum **80% test coverage** across all core modules. Every plugin ships with dry-run tests that verify the correct commands are generated — without executing anything on your machine.

---

## 🛣️ Roadmap

**v0.1.0 — Hello World** _(current)_

- [x] Core engine — detector, registry, interviewer, executor
- [x] Functional programming architecture
- [x] Requirement checking with OS-specific install guides
- [x] Laravel v11, NestJS v10, VueJS v3 plugins
- [x] GitHub Actions CI pipeline
- [x] Published on npm

**v0.2.0 — Community Ready**

- [ ] ESM migration — modern JavaScript standard
- [ ] Plugin contribution system with automated CI validation
- [ ] Full documentation site
- [ ] 15+ framework plugins

**v0.3.0 — Growth**

- [ ] AI mode — describe your project in plain English
- [ ] `scaffy add github:user/plugin` — install external plugins
- [ ] Discord community

**v1.0.0 — Ecosystem**

- [ ] VS Code extension
- [ ] Plugin marketplace website
- [ ] Enterprise adoption

---

## 🤝 Contributing

Scaffy is built by the community, for the community. There are many ways to get involved:

- 🐛 **Report a bug** — open an issue using the bug report template
- 💡 **Request a feature** — open an issue using the feature request template
- 🔌 **Add a framework plugin** — the most impactful contribution you can make
- 📖 **Improve documentation** — fix typos, improve clarity, add examples
- 🧪 **Write tests** — help reach higher coverage

Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started. First time contributing to open source? Scaffy is a great place to begin — adding a framework plugin is self-contained, well-documented, and genuinely useful to thousands of developers.

---

## 💛 Support The Project

Scaffy is completely free and open source, and will always remain so. If it saves you time, consider supporting its development:

<a href="https://buymeacoffee.com/TanvirHossen112">
  <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" />
</a>

Your support helps fund active maintenance, new framework plugins, and the features on the roadmap.

---

## 👥 Contributors

Thanks to every person who has contributed to making Scaffy better. 🎉

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Want to see your name here? Check out [CONTRIBUTING.md](CONTRIBUTING.md) and submit your first PR.

---

## 📄 License

Scaffy is open source software licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with dedication by the Scaffy community

<br/>

<a href="https://buymeacoffee.com/TanvirHossen112">☕ Buy me a coffee</a>
&nbsp;·&nbsp;
<a href="https://github.com/TanvirHossen112/scaffy/issues/new?template=bug_report.md">🐛 Report a bug</a>
&nbsp;·&nbsp;
<a href="https://github.com/TanvirHossen112/scaffy/issues/new?template=feature_request.md">💡 Request a feature</a>
&nbsp;·&nbsp;
<a href="https://github.com/TanvirHossen112/scaffy/discussions">💬 Join the discussion</a>

</div>
