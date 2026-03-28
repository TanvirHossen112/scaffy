import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Symfony v7 scaffold', () => {
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

  it('runs skeleton installer', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('symfony/skeleton:"7.*" my-app')
    );
  });

  it('installs orm-pack when database is selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'mysql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('orm-pack')
    );
  });

  it('sets DATABASE_URL env for mysql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'mysql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.setEnv).toHaveBeenCalledWith(
      'my-app',
      expect.objectContaining({
        DATABASE_URL: expect.stringContaining('mysql'),
      })
    );
  });

  it('sets DATABASE_URL env for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'postgresql',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.setEnv).toHaveBeenCalledWith(
      'my-app',
      expect.objectContaining({
        DATABASE_URL: expect.stringContaining('postgresql'),
      })
    );
  });

  it('skips database setup when none is selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.setEnv).not.toHaveBeenCalled();
  });

  it('creates docker-compose.yml when docker is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'none',
        docker: true,
      },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('docker-compose.yml'),
      expect.any(String)
    );
  });

  it('skips docker-compose when docker is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'none',
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.createFile).not.toHaveBeenCalled();
  });

  it('includes db service in docker-compose for mysql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'mysql',
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls[0][1];
    expect(content).toContain('mysql:8.0');
  });

  it('includes db service in docker-compose for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        projectType: 'webapp',
        database: 'postgresql',
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls[0][1];
    expect(content).toContain('postgres:15');
  });
});
