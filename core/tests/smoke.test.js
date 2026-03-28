import * as registry from '../registry.js';
import * as detector from '../detector.js';
import * as executor from '../executor.js';
import { buildPluginUtils } from '../utils.js';

// ─── Mock Executor Factory ────────────────────────────
const createMockExecutor = () => {
  const calls = [];

  return {
    executor: {
      run: async cmd => calls.push({ type: 'run', cmd }),
      runInProject: async (project, cmd) =>
        calls.push({ type: 'runInProject', project, cmd }),
      setEnv: async (project, vars) =>
        calls.push({ type: 'setEnv', project, vars }),
      appendToFile: async (path, content) =>
        calls.push({ type: 'appendToFile', path, content }),
      createFile: async (path, content) =>
        calls.push({ type: 'createFile', path, content }),
    },
    ran: partial => calls.some(c => c.cmd && c.cmd.includes(partial)),
    ranInProject: (project, partial) =>
      calls.some(
        c =>
          c.type === 'runInProject' &&
          c.project === project &&
          c.cmd.includes(partial)
      ),
    setEnvCalled: project =>
      calls.find(c => c.type === 'setEnv' && c.project === project),
    createdFile: partial =>
      calls.some(c => c.type === 'createFile' && c.path.includes(partial)),
    calls: () => calls,
  };
};

// ─── Helper — Load Plugin And Build Utils ─────────────
const loadPluginWithMockExecutor = async (frameworkAlias, version) => {
  const framework = registry.findFramework(frameworkAlias);
  if (!framework) throw new Error(`Framework not found: ${frameworkAlias}`);

  const plugin = await registry.loadPlugin(framework, version);
  const mock = createMockExecutor();
  const utils = buildPluginUtils(mock.executor);

  return { plugin, mock, utils, framework };
};

// ─────────────────────────────────────────────────────
// LARAVEL V11 — FULL FLOW SMOKE TESTS
// ─────────────────────────────────────────────────────
describe('Smoke Test — Laravel v11', () => {
  test('plugin loads successfully', async () => {
    const { plugin } = await loadPluginWithMockExecutor('laravel', 'v11');
    expect(plugin).toHaveProperty('meta');
  });

  test('plugin has required fields', async () => {
    const { plugin } = await loadPluginWithMockExecutor('laravel', 'v11');
    expect(plugin).toHaveProperty('meta');
    expect(plugin).toHaveProperty('questions');
    expect(plugin).toHaveProperty('scaffold');
    expect(plugin.meta.name).toBe('Laravel');
    expect(typeof plugin.scaffold).toBe('function');
  });

  test('plugin.json has valid requires array', async () => {
    const { plugin } = await loadPluginWithMockExecutor('laravel', 'v11');
    expect(Array.isArray(plugin.meta.requires)).toBe(true);
    expect(plugin.meta.requires.length).toBeGreaterThan(0);
    plugin.meta.requires.forEach(req => {
      expect(req).toHaveProperty('tool');
      expect(req).toHaveProperty('checkCommand');
      expect(req).toHaveProperty('installGuide');
    });
  });

  test('full scaffold flow — default options', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'laravel',
      'v11'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-laravel',
        starterKit: 'none',
        database: 'sqlite',
        docker: false,
      },
      utils
    );

    expect(mock.ran('composer create-project')).toBe(true);
    expect(mock.ran('smoke-laravel')).toBe(true);
    expect(mock.ranInProject('smoke-laravel', 'key:generate')).toBe(true);
    expect(mock.setEnvCalled('smoke-laravel')).toBeDefined();
  });

  test('full scaffold flow — breeze + mysql + docker', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'laravel',
      'v11'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-laravel-full',
        starterKit: 'breeze',
        database: 'mysql',
        docker: true,
      },
      utils
    );

    expect(mock.ran('composer create-project')).toBe(true);
    expect(mock.ran('laravel/breeze')).toBe(true);
    expect(mock.ran('laravel/sail')).toBe(true);
    const envCall = mock.setEnvCalled('smoke-laravel-full');
    expect(envCall.vars.DB_CONNECTION).toBe('mysql');
  });

  test('full scaffold flow — jetstream', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'laravel',
      'v11'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-laravel-jet',
        starterKit: 'jetstream',
        database: 'pgsql',
        docker: false,
      },
      utils
    );

    expect(mock.ran('laravel/jetstream')).toBe(true);
    expect(mock.ran('breeze')).toBe(false);
    const envCall = mock.setEnvCalled('smoke-laravel-jet');
    expect(envCall.vars.DB_CONNECTION).toBe('pgsql');
  });
});

// ─────────────────────────────────────────────────────
// NESTJS V10 — FULL FLOW SMOKE TESTS
// ─────────────────────────────────────────────────────
describe('Smoke Test — NestJS v10', () => {
  test('plugin loads successfully', async () => {
    const { plugin } = await loadPluginWithMockExecutor('nestjs', 'v10');
    expect(plugin).toHaveProperty('meta');
  });

  test('plugin has required fields', async () => {
    const { plugin } = await loadPluginWithMockExecutor('nestjs', 'v10');
    expect(plugin).toHaveProperty('meta');
    expect(plugin).toHaveProperty('questions');
    expect(plugin).toHaveProperty('scaffold');
    expect(plugin.meta.name).toBe('NestJS');
    expect(typeof plugin.scaffold).toBe('function');
  });

  test('questions is async function', async () => {
    const { plugin } = await loadPluginWithMockExecutor('nestjs', 'v10');
    expect(typeof plugin.questions).toBe('function');
  });

  test('questions returns array when called', async () => {
    const { plugin } = await loadPluginWithMockExecutor('nestjs', 'v10');
    const questions = await plugin.questions();
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  test('full scaffold flow — default options', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'nestjs',
      'v10'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-nest',
        packageManager: 'npm',
        database: 'none',
        auth: false,
        docker: false,
      },
      utils
    );

    expect(mock.ran('@nestjs/cli')).toBe(true);
    expect(mock.ran('smoke-nest')).toBe(true);
    expect(mock.ran('--skip-git')).toBe(true);
    expect(mock.ran('typeorm')).toBe(false);
    expect(mock.ran('passport')).toBe(false);
  });

  test('full scaffold flow — postgres + auth + docker', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'nestjs',
      'v10'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-nest-full',
        packageManager: 'npm',
        database: 'postgres',
        auth: true,
        docker: true,
      },
      utils
    );

    expect(mock.ran('@nestjs/cli')).toBe(true);
    expect(mock.ranInProject('smoke-nest-full', 'typeorm')).toBe(true);
    expect(mock.ranInProject('smoke-nest-full', 'passport-jwt')).toBe(true);
    expect(mock.createdFile('Dockerfile')).toBe(true);
    expect(mock.createdFile('.dockerignore')).toBe(true);
  });

  test('full scaffold flow — mongodb', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'nestjs',
      'v10'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-nest-mongo',
        packageManager: 'npm',
        database: 'mongodb',
        auth: false,
        docker: false,
      },
      utils
    );

    expect(mock.ranInProject('smoke-nest-mongo', 'mongoose')).toBe(true);
    expect(mock.ran('typeorm')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────
// VUEJS V3 — FULL FLOW SMOKE TESTS
// ─────────────────────────────────────────────────────
describe('Smoke Test — VueJS v3', () => {
  test('plugin loads successfully', async () => {
    const { plugin } = await loadPluginWithMockExecutor('vue', 'v3');
    expect(plugin).toHaveProperty('meta');
  });

  test('plugin has required fields', async () => {
    const { plugin } = await loadPluginWithMockExecutor('vue', 'v3');
    expect(plugin).toHaveProperty('meta');
    expect(plugin).toHaveProperty('questions');
    expect(plugin).toHaveProperty('scaffold');
    expect(plugin.meta.name).toBe('VueJS');
    expect(typeof plugin.scaffold).toBe('function');
  });

  test('questions is async function', async () => {
    const { plugin } = await loadPluginWithMockExecutor('vue', 'v3');
    expect(typeof plugin.questions).toBe('function');
  });

  test('questions returns array when called', async () => {
    const { plugin } = await loadPluginWithMockExecutor('vue', 'v3');
    const questions = await plugin.questions();
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  test('full scaffold flow — minimal options', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'vue',
      'v3'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-vue',
        packageManager: 'npm',
        router: false,
        pinia: false,
        vitest: false,
        typescript: false,
        eslint: false,
      },
      utils
    );

    expect(mock.ran('create-vue')).toBe(true);
    expect(mock.ran('smoke-vue')).toBe(true);
    expect(mock.ran('--no-router')).toBe(true);
    expect(mock.ran('--no-pinia')).toBe(true);
    expect(mock.ranInProject('smoke-vue', 'npm install')).toBe(true);
  });

  test('full scaffold flow — all options enabled', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'vue',
      'v3'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-vue-full',
        packageManager: 'npm',
        router: true,
        pinia: true,
        vitest: true,
        typescript: true,
        eslint: true,
      },
      utils
    );

    expect(mock.ran('create-vue')).toBe(true);
    expect(mock.ran('--router')).toBe(true);
    expect(mock.ran('--pinia')).toBe(true);
    expect(mock.ran('--typescript')).toBe(true);
    expect(mock.ran('--eslint')).toBe(true);
    expect(mock.ranInProject('smoke-vue-full', 'vue-tsc')).toBe(true);
  });

  test('full scaffold flow — pnpm package manager', async () => {
    const { plugin, mock, utils } = await loadPluginWithMockExecutor(
      'vue',
      'v3'
    );

    await plugin.scaffold(
      {
        projectName: 'smoke-vue-pnpm',
        packageManager: 'pnpm',
        router: true,
        pinia: false,
        vitest: false,
        typescript: false,
        eslint: false,
      },
      utils
    );

    expect(mock.ranInProject('smoke-vue-pnpm', 'pnpm install')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────
// REGISTRY SMOKE TESTS
// ─────────────────────────────────────────────────────
describe('Smoke Test — Registry', () => {
  test('all 3 sprint 2 frameworks are in registry', () => {
    expect(registry.findFramework('laravel')).toBeDefined();
    expect(registry.findFramework('nestjs')).toBeDefined();
    expect(registry.findFramework('vue')).toBeDefined();
  });

  test('laravel has correct metadata', () => {
    const framework = registry.findFramework('laravel');
    expect(framework.name).toBe('Laravel');
    expect(framework.language).toBe('php');
    expect(framework.latest).toBe('v13');
  });

  test('nestjs has correct metadata', () => {
    const framework = registry.findFramework('nestjs');
    expect(framework.name).toBe('NestJS');
    expect(framework.language).toBe('javascript');
    expect(framework.latest).toBe('v10');
  });

  test('vue has correct metadata', () => {
    const framework = registry.findFramework('vue');
    expect(framework.name).toBe('VueJS');
    expect(framework.language).toBe('javascript');
    expect(framework.latest).toBe('v3');
  });

  test('search finds laravel by language', () => {
    const results = registry.searchFrameworks('php');
    const names = results.map(f => f.name);
    expect(names).toContain('Laravel');
  });

  test('search finds nestjs by name', () => {
    const results = registry.searchFrameworks('nest');
    const names = results.map(f => f.name);
    expect(names).toContain('NestJS');
  });
});
