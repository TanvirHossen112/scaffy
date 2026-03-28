# Changelog

## [1.0.1] — 2026-03-28

### Fixed

- **Interactive Prompts**: Fixed an issue where the framework selection menu fell back to a plain text input due to incompatibility with `inquirer@13.x`'s new `select` API.
- **Terminal Interactivity**: Removed the `ora` loading spinner during scaffolding to prevent it from intercepting standard input, restoring full terminal interactivity for framework installers (e.g. Laravel/NestJS) that ask their own prompts.
- **Framework Display**: Updated the interactive menu to correctly list all available plugin versions inline (e.g. `v13 (latest), v12, v11`) before selection, matching the `scaffy list` command.
- **Hidden Plugins**: Ensured incomplete/stub framework plugins (like Flask) are fully excluded from the interactive selection menu.
- **Test Suite**: Synchronized the test suites to pass against the new inquirer API and the simplified Symfony plugin logic.

## [1.0.0] — 2026-03-28

### Added

- ESM migration — full codebase migrated from CommonJS to ESM (#38)
- Registry filter — only fully implemented plugins shown in CLI (#39)
- Laravel v12 plugin (#40)
- Laravel v13 plugin — now the default latest (#41)
- Symfony v7 plugin with webapp, api, microservice project types (#42)
- Django v5 plugin — first Python plugin (#43)
- FastAPI plugin with async/sync driver selection (#44)
- Gin v1 plugin — first Go plugin (#45)
- ExpressJS v4 plugin with TypeScript support (#46)
- NextJS v14 plugin with full create-next-app flag support (#47)
- NestJS v11 plugin — now the default latest (#48)

### Changed

- chalk, ora, inquirer upgraded to latest versions
- registry.loadPlugin() is now async

### Fixed

- Stub-only plugins no longer appear in scaffy list or scaffy search

## [0.1.0] — 2026-01-01

- Initial release
- Laravel v11, NestJS v10, VueJS v3 plugins
- Core CLI infrastructure
