import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('ExpressJS v4 scaffold', () => {
  let scaffold;
  let mockUtils;

  beforeEach(async () => {
    const mod = await import('../scaffold.js');
    scaffold = mod.default;

    mockUtils = {
      run: jest.fn().mockResolvedValue(),
      runInProject: jest.fn().mockResolvedValue(),
      setEnv: jest.fn(),
      createFile: jest.fn(),
      appendToFile: jest.fn(),
      log: jest.fn(),
      success: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      title: jest.fn(),
      step: jest.fn(),
      divider: jest.fn(),
    };
  });

  // ─── Core ──────────────────────────────────────────────

  it('creates project directory', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('mkdir my-app')
    );
  });

  it('runs package manager init', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('npm init -y')
    );
  });

  it('installs express', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('express')
    );
  });

  it('creates index.js when typescript is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('index.js'))).toBe(true);
    expect(paths.some(p => p.includes('index.ts'))).toBe(false);
  });

  it('creates .env and .env.example', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('.env'))).toBe(true);
    expect(paths.some(p => p.includes('.env.example'))).toBe(true);
  });

  it('creates .gitignore', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('.gitignore'),
      expect.any(String)
    );
  });

  // ─── TypeScript ────────────────────────────────────────

  it('installs typescript dependencies when typescript is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('typescript')
    );
  });

  it('creates tsconfig.json when typescript is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('tsconfig.json'),
      expect.stringContaining('compilerOptions')
    );
  });

  it('creates index.ts when typescript is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('index.ts'))).toBe(true);
    expect(paths.some(p => p.includes('index.js'))).toBe(false);
  });

  it('uses yarn add instead of npm install for yarn', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'yarn',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('yarn add express')
    );
  });

  // ─── Database ──────────────────────────────────────────

  it('installs mongoose for mongodb', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'mongodb',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('mongoose')
    );
  });

  it('installs pg for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'postgresql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('pg')
    );
  });

  it('installs mysql2 for mysql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'mysql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('mysql2')
    );
  });

  it('skips database install when none selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    const calls = mockUtils.runInProject.mock.calls.map(c => c[1]);
    expect(
      calls.some(
        c => c.includes('mongoose') || c.includes(' pg') || c.includes('mysql2')
      )
    ).toBe(false);
  });

  // ─── Docker ────────────────────────────────────────────

  it('creates Dockerfile and docker-compose.yml when docker is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: true,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(true);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(true);
  });

  it('includes mongo service in docker-compose for mongodb', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'mongodb',
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('mongo:7');
  });

  it('includes postgres service in docker-compose for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'postgresql',
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('postgres:15');
  });

  it('skips docker files when docker is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(false);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(false);
  });
});
