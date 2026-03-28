import scaffold from '../scaffold.js';

// ─── Mock Utils Factory ────────────────────────────────
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
    setEnvCalled: project =>
      calls.find(c => c.type === 'setEnv' && c.project === project),
    calls: () => calls,
  };
};

// ─── Base Answers ──────────────────────────────────────
const baseAnswers = {
  projectName: 'my-app',
  starterKit: 'none',
  database: 'sqlite',
  docker: false,
};

// ─── Core Scaffold ────────────────────────────────────
describe('Laravel v11 scaffold — core', () => {
  test('runs composer create-project', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('composer create-project')).toBe(true);
  });

  test('includes project name in create-project command', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('my-app')).toBe(true);
  });

  test('runs php artisan key:generate', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ranInProject('my-app', 'key:generate')).toBe(true);
  });

  test('configures database in .env', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    const envCall = mock.setEnvCalled('my-app');
    expect(envCall).toBeDefined();
    expect(envCall.vars.DB_CONNECTION).toBe('sqlite');
  });

  test('sets app name in .env', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    const envCall = mock.setEnvCalled('my-app');
    expect(envCall.vars.APP_NAME).toBe('my-app');
  });
});

// ─── Database Options ─────────────────────────────────
describe('Laravel v11 scaffold — database', () => {
  test('sets mysql as DB_CONNECTION', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'mysql' }, mock.utils);
    const envCall = mock.setEnvCalled('my-app');
    expect(envCall.vars.DB_CONNECTION).toBe('mysql');
  });

  test('sets pgsql as DB_CONNECTION', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'pgsql' }, mock.utils);
    const envCall = mock.setEnvCalled('my-app');
    expect(envCall.vars.DB_CONNECTION).toBe('pgsql');
  });
});

// ─── Starter Kit — None ───────────────────────────────
describe('Laravel v11 scaffold — no starter kit', () => {
  test('does not install breeze when none selected', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('breeze')).toBe(false);
  });

  test('does not install jetstream when none selected', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('jetstream')).toBe(false);
  });
});

// ─── Starter Kit — Breeze ─────────────────────────────
describe('Laravel v11 scaffold — breeze', () => {
  test('installs breeze composer package', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'breeze' }, mock.utils);
    expect(mock.ran('laravel/breeze')).toBe(true);
  });

  test('runs breeze:install artisan command', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'breeze' }, mock.utils);
    expect(mock.ranInProject('my-app', 'breeze:install')).toBe(true);
  });

  test('runs npm install after breeze', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'breeze' }, mock.utils);
    expect(mock.ranInProject('my-app', 'npm install')).toBe(true);
  });

  test('runs npm run build after breeze', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'breeze' }, mock.utils);
    expect(mock.ranInProject('my-app', 'npm run build')).toBe(true);
  });
});

// ─── Starter Kit — Jetstream ──────────────────────────
describe('Laravel v11 scaffold — jetstream', () => {
  test('installs jetstream composer package', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'jetstream' }, mock.utils);
    expect(mock.ran('laravel/jetstream')).toBe(true);
  });

  test('runs jetstream:install artisan command', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'jetstream' }, mock.utils);
    expect(mock.ranInProject('my-app', 'jetstream:install')).toBe(true);
  });

  test('does not install breeze when jetstream selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, starterKit: 'jetstream' }, mock.utils);
    expect(mock.ran('breeze')).toBe(false);
  });
});

// ─── Docker / Sail ────────────────────────────────────
describe('Laravel v11 scaffold — docker', () => {
  test('installs sail when docker is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, docker: true }, mock.utils);
    expect(mock.ran('laravel/sail')).toBe(true);
  });

  test('runs sail:install artisan command', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, docker: true }, mock.utils);
    expect(mock.ranInProject('my-app', 'sail:install')).toBe(true);
  });

  test('does not install sail when docker is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('laravel/sail')).toBe(false);
  });
});

// ─── Full Stack Combination ───────────────────────────
describe('Laravel v11 scaffold — full stack', () => {
  test('breeze + mysql + docker all run together', async () => {
    const mock = createMockUtils();
    await scaffold(
      {
        projectName: 'full-app',
        starterKit: 'breeze',
        database: 'mysql',
        docker: true,
      },
      mock.utils
    );
    expect(mock.ran('composer create-project')).toBe(true);
    expect(mock.ran('laravel/breeze')).toBe(true);
    expect(mock.ran('laravel/sail')).toBe(true);
    const envCall = mock.setEnvCalled('full-app');
    expect(envCall.vars.DB_CONNECTION).toBe('mysql');
  });
});
