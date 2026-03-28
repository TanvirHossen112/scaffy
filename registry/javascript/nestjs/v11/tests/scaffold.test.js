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
    createdFile: partial =>
      calls.some(c => c.type === 'createFile' && c.path.includes(partial)),
    calls: () => calls,
  };
};

// ─── Base Answers ─────────────────────────────────────
const baseAnswers = {
  projectName: 'my-nest-app',
  packageManager: 'npm',
  database: 'none',
  auth: false,
  docker: false,
};

// ─── Core Scaffold ────────────────────────────────────
describe('NestJS v11 scaffold — core', () => {
  test('runs nestjs cli new command', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('@nestjs/cli')).toBe(true);
  });

  test('includes project name in command', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('my-nest-app')).toBe(true);
  });

  test('passes package manager to cli', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--package-manager npm')).toBe(true);
  });

  test('skips git init flag is passed', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('--skip-git')).toBe(true);
  });
});

// ─── Package Manager ─────────────────────────────────
describe('NestJS v11 scaffold — package manager', () => {
  test('uses yarn when selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, packageManager: 'yarn' }, mock.utils);
    expect(mock.ran('--package-manager yarn')).toBe(true);
  });

  test('uses pnpm when selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, packageManager: 'pnpm' }, mock.utils);
    expect(mock.ran('--package-manager pnpm')).toBe(true);
  });

  test('uses npm install command with npm', async () => {
    const mock = createMockUtils();
    await scaffold(
      { ...baseAnswers, database: 'postgres', packageManager: 'npm' },
      mock.utils
    );
    expect(mock.ranInProject('my-nest-app', 'npm install')).toBe(true);
  });

  test('uses yarn add command with yarn', async () => {
    const mock = createMockUtils();
    await scaffold(
      { ...baseAnswers, database: 'postgres', packageManager: 'yarn' },
      mock.utils
    );
    expect(mock.ranInProject('my-nest-app', 'yarn add')).toBe(true);
  });

  test('uses pnpm install command with pnpm', async () => {
    const mock = createMockUtils();
    await scaffold(
      { ...baseAnswers, database: 'postgres', packageManager: 'pnpm' },
      mock.utils
    );
    expect(mock.ranInProject('my-nest-app', 'pnpm install')).toBe(true);
  });
});

// ─── Database — None ──────────────────────────────────
describe('NestJS v11 scaffold — no database', () => {
  test('does not install typeorm when none selected', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('typeorm')).toBe(false);
  });

  test('does not install mongoose when none selected', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ran('mongoose')).toBe(false);
  });
});

// ─── Database — PostgreSQL ────────────────────────────
describe('NestJS v11 scaffold — postgres', () => {
  test('installs typeorm and pg driver', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'postgres' }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'typeorm')).toBe(true);
    expect(mock.ranInProject('my-nest-app', 'pg')).toBe(true);
  });
});

// ─── Database — MySQL ─────────────────────────────────
describe('NestJS v11 scaffold — mysql', () => {
  test('installs typeorm and mysql2 driver', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'mysql' }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'typeorm')).toBe(true);
    expect(mock.ranInProject('my-nest-app', 'mysql2')).toBe(true);
  });
});

// ─── Database — SQLite ────────────────────────────────
describe('NestJS v11 scaffold — sqlite', () => {
  test('installs typeorm and sqlite3 driver', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'sqlite' }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'typeorm')).toBe(true);
    expect(mock.ranInProject('my-nest-app', 'sqlite3')).toBe(true);
  });
});

// ─── Database — MongoDB ───────────────────────────────
describe('NestJS v11 scaffold — mongodb', () => {
  test('installs mongoose instead of typeorm', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'mongodb' }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'mongoose')).toBe(true);
    expect(mock.ranInProject('my-nest-app', '@nestjs/mongoose')).toBe(true);
  });

  test('does not install typeorm when mongodb selected', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, database: 'mongodb' }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'typeorm')).toBe(false);
  });
});

// ─── Auth ─────────────────────────────────────────────
describe('NestJS v11 scaffold — auth', () => {
  test('installs @nestjs/passport when auth is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, auth: true }, mock.utils);
    expect(mock.ranInProject('my-nest-app', '@nestjs/passport')).toBe(true);
  });

  test('installs passport when auth is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, auth: true }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'passport ')).toBe(true);
  });

  test('installs passport-jwt when auth is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, auth: true }, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'passport-jwt')).toBe(true);
  });

  test('installs @nestjs/jwt when auth is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, auth: true }, mock.utils);
    expect(mock.ranInProject('my-nest-app', '@nestjs/jwt')).toBe(true);
  });

  test('installs @types/passport-jwt dev dependency when auth is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, auth: true }, mock.utils);
    expect(mock.ranInProject('my-nest-app', '@types/passport-jwt')).toBe(true);
  });

  test('does not install passport packages when auth is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.ranInProject('my-nest-app', 'passport-jwt')).toBe(false);
    expect(mock.ranInProject('my-nest-app', '@nestjs/jwt')).toBe(false);
  });
});

// ─── Docker ───────────────────────────────────────────
describe('NestJS v11 scaffold — docker', () => {
  test('creates Dockerfile when docker is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, docker: true }, mock.utils);
    expect(mock.createdFile('Dockerfile')).toBe(true);
  });

  test('creates .dockerignore when docker is true', async () => {
    const mock = createMockUtils();
    await scaffold({ ...baseAnswers, docker: true }, mock.utils);
    expect(mock.createdFile('.dockerignore')).toBe(true);
  });

  test('does not create Dockerfile when docker is false', async () => {
    const mock = createMockUtils();
    await scaffold(baseAnswers, mock.utils);
    expect(mock.createdFile('Dockerfile')).toBe(false);
  });
});

// ─── Full Stack Combination ───────────────────────────
describe('NestJS v11 scaffold — full stack', () => {
  test('postgres + auth + docker all run together', async () => {
    const mock = createMockUtils();
    await scaffold(
      {
        projectName: 'full-nest-app',
        packageManager: 'npm',
        database: 'postgres',
        auth: true,
        docker: true,
      },
      mock.utils
    );
    expect(mock.ran('@nestjs/cli')).toBe(true);
    expect(mock.ranInProject('full-nest-app', 'typeorm')).toBe(true);
    expect(mock.ranInProject('full-nest-app', 'passport-jwt')).toBe(true);
    expect(mock.createdFile('Dockerfile')).toBe(true);
  });
});
