import scaffold from '../scaffold.js';

// ─── Mock Utils Factory ───────────────────────────────
const createMockUtils = () => {
  const calls = [];

  return {
    utils: {
      run: async cmd => calls.push({ type: 'run', cmd }),
      runInProject: async (project, cmd) =>
        calls.push({ type: 'runInProject', project, cmd }),
      setEnv: async (project, vars) =>
        calls.push({ type: 'setEnv', project, vars }),
      appendToFile: async (path, content) =>
        calls.push({ type: 'appendToFile', path, content }),
      createFile: async (path, content) =>
        calls.push({ type: 'createFile', path, content }),
      log: () => {},
      success: () => {},
      warn: () => {},
      error: () => {},
      title: () => {},
      step: () => {},
    },
    ran: partial => calls.some(c => c.cmd && c.cmd.includes(partial)),
    ranInProject: (project, partial) =>
      calls.some(
        c =>
          c.type === 'runInProject' &&
          c.project === project &&
          c.cmd.includes(partial)
      ),
    calls: () => calls,
  };
};

// ─── Base Answers ─────────────────────────────────────
const baseAnswers = {
  projectName: 'my-vue-app',
  packageManager: 'npm',
  router: false,
  pinia: false,
  vitest: false,
  typescript: false,
  eslint: false,
};

// ─── Core Scaffold ────────────────────────────────────
describe('VueJS v3 scaffold — core', () => {
  test('runs create-vue command', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('create-vue')).toBe(true);
  });

  test('includes project name in command', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('my-vue-app')).toBe(true);
  });

  test('runs npm install after scaffolding', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ranInProject('my-vue-app', 'npm install')).toBe(true);
  });
});

// ─── Package Manager ──────────────────────────────────
describe('VueJS v3 scaffold — package manager', () => {
  test('runs yarn install when yarn selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, packageManager: 'yarn' }, mock.utils);
    expect(mock.ranInProject('my-vue-app', 'yarn')).toBe(true);
  });

  test('runs pnpm install when pnpm selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, packageManager: 'pnpm' }, mock.utils);
    expect(mock.ranInProject('my-vue-app', 'pnpm install')).toBe(true);
  });
});

// ─── Vue Router ───────────────────────────────────────
describe('VueJS v3 scaffold — router', () => {
  test('passes --router flag when router is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, router: true }, mock.utils);
    expect(mock.ran('--router')).toBe(true);
  });

  test('passes --no-router flag when router is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--no-router')).toBe(true);
  });
});

// ─── Pinia ────────────────────────────────────────────
describe('VueJS v3 scaffold — pinia', () => {
  test('passes --pinia flag when pinia is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, pinia: true }, mock.utils);
    expect(mock.ran('--pinia')).toBe(true);
  });

  test('passes --no-pinia flag when pinia is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--no-pinia')).toBe(true);
  });
});

// ─── TypeScript ───────────────────────────────────────
describe('VueJS v3 scaffold — typescript', () => {
  test('passes --typescript flag when typescript is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, typescript: true }, mock.utils);
    expect(mock.ran('--typescript')).toBe(true);
  });

  test('installs vue-tsc when typescript is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, typescript: true }, mock.utils);
    expect(mock.ranInProject('my-vue-app', 'vue-tsc')).toBe(true);
  });

  test('passes --no-typescript when typescript is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--no-typescript')).toBe(true);
  });

  test('does not install vue-tsc when typescript is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('vue-tsc')).toBe(false);
  });
});

// ─── ESLint ───────────────────────────────────────────
describe('VueJS v3 scaffold — eslint', () => {
  test('passes --eslint flag when eslint is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, eslint: true }, mock.utils);
    expect(mock.ran('--eslint')).toBe(true);
  });

  test('passes --no-eslint flag when eslint is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--no-eslint')).toBe(true);
  });
});

// ─── Full Stack Combination ───────────────────────────
describe('VueJS v3 scaffold — full stack', () => {
  test('all options enabled run together', async () => {
    const mock = createMockUtils();
    await scaffold(
      {
        projectName: 'full-vue-app',
        packageManager: 'pnpm',
        router: true,
        pinia: true,
        typescript: true,
        eslint: true,
      },
      mock.utils
    );
    expect(mock.ran('create-vue')).toBe(true);
    expect(mock.ran('--router')).toBe(true);
    expect(mock.ran('--pinia')).toBe(true);
    expect(mock.ran('--typescript')).toBe(true);
    expect(mock.ran('--eslint')).toBe(true);
    expect(mock.ranInProject('full-vue-app', 'pnpm install')).toBe(true);
    expect(mock.ranInProject('full-vue-app', 'vue-tsc')).toBe(true);
  });

  test('minimal options run cleanly', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('create-vue')).toBe(true);
    expect(mock.ran('--no-router')).toBe(true);
    expect(mock.ran('--no-pinia')).toBe(true);
    expect(mock.ran('--no-typescript')).toBe(true);
    expect(mock.ran('--no-eslint')).toBe(true);
  });
});
