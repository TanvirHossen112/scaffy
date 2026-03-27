import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('NextJS v14 scaffold', () => {
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

  it('runs create-next-app@14', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: true,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('create-next-app@14 my-app')
    );
  });

  it('runs package manager install after scaffolding', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: true,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('install')
    );
  });

  it('creates .env.local', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: true,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('.env.local'))).toBe(true);
  });

  it('creates .env.example', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: true,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('.env.example'))).toBe(true);
  });

  it('appends to .gitignore', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: true,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.appendToFile).toHaveBeenCalledWith(
      expect.stringContaining('.gitignore'),
      expect.stringContaining('.env.local')
    );
  });

  // ─── Flags ─────────────────────────────────────────────

  it('passes --typescript flag when typescript is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: true,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--typescript')
    );
  });

  it('passes --no-typescript flag when typescript is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--no-typescript')
    );
  });

  it('passes --tailwind flag when tailwind is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: true,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--tailwind')
    );
  });

  it('passes --no-tailwind flag when tailwind is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--no-tailwind')
    );
  });

  it('passes --app flag when appRouter is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: true,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--app')
    );
  });

  it('passes --no-app flag when appRouter is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--no-app')
    );
  });

  it('passes --src-dir flag when srcDir is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: true,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--src-dir')
    );
  });

  it('passes --no-src-dir flag when srcDir is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--no-src-dir')
    );
  });

  it('passes --use-npm flag for npm', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--use-npm')
    );
  });

  it('passes --use-yarn flag for yarn', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'yarn',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--use-yarn')
    );
  });

  it('passes --use-pnpm flag for pnpm', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'pnpm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--use-pnpm')
    );
  });

  it('passes --skip-install flag', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        packageManager: 'npm',
        typescript: false,
        tailwind: false,
        appRouter: false,
        srcDir: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('--skip-install')
    );
  });
});
