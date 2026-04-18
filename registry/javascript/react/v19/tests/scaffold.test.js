import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('React scaffold', () => {
  let scaffold;
  let mockUtils;

  beforeEach(async () => {
    jest.resetModules();
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

  it('runs create-vite with react-ts template', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      'npm create vite@latest my-app -- --template react-ts'
    );
  });

  it('runs create-vite with javascript variant', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      'npm create vite@latest my-app -- --template react'
    );
  });

  it('installs with npm', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      'npm install'
    );
  });

  it('installs with yarn', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'yarn' },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith('my-app', 'yarn');
  });

  it('installs with pnpm', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'pnpm' },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      'pnpm install'
    );
  });

  it('calls title with React', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.title).toHaveBeenCalledWith('React');
  });

  it('calls step 1 and step 2', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.step).toHaveBeenCalledWith(1, expect.any(String));
    expect(mockUtils.step).toHaveBeenCalledWith(2, expect.any(String));
  });

  it('calls success with project name', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react-ts', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.success).toHaveBeenCalledWith('my-app is ready!');
  });

  it('logs npm run dev for npm', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react', packageManager: 'npm' },
      mockUtils
    );
    expect(mockUtils.log).toHaveBeenCalledWith('  npm run dev');
  });

  it('logs yarn dev for yarn', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react', packageManager: 'yarn' },
      mockUtils
    );
    expect(mockUtils.log).toHaveBeenCalledWith('  yarn dev');
  });

  it('logs pnpm dev for pnpm', async () => {
    await scaffold(
      { projectName: 'my-app', variant: 'react', packageManager: 'pnpm' },
      mockUtils
    );
    expect(mockUtils.log).toHaveBeenCalledWith('  pnpm dev');
  });
});
