# Changelog

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
