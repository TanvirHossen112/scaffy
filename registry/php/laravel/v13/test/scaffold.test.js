import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Laravel v13 scaffold', () => {
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

  it('runs the laravel v13 installer', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        starterKit: 'none',
        database: 'sqlite',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('laravel/laravel:^13.0 my-app')
    );
  });

  it('installs breeze when selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        starterKit: 'breeze',
        database: 'sqlite',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('breeze')
    );
  });

  it('installs jetstream when selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        starterKit: 'jetstream',
        database: 'sqlite',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('jetstream')
    );
  });

  it('sets database env vars', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        starterKit: 'none',
        database: 'mysql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.setEnv).toHaveBeenCalledWith(
      'my-app',
      expect.objectContaining({ DB_CONNECTION: 'mysql' })
    );
  });

  it('installs sail when docker is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        starterKit: 'none',
        database: 'sqlite',
        docker: true,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('sail')
    );
  });
});
