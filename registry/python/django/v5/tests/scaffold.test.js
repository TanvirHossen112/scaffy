import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Django v5 scaffold', () => {
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

  it('installs django', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('django>=5.0,<6.0')
    );
  });

  it('runs django-admin startproject', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('django-admin startproject my-app')
    );
  });

  it('creates requirements.txt', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('requirements.txt'),
      expect.stringContaining('django>=5.0,<6.0')
    );
  });

  // ─── Database ──────────────────────────────────────────

  it('installs psycopg2-binary for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'postgresql',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('psycopg2-binary')
    );
  });

  it('includes psycopg2-binary in requirements.txt for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'postgresql',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('requirements.txt')
    )[1];
    expect(content).toContain('psycopg2-binary');
  });

  it('installs mysqlclient for mysql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'mysql',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('mysqlclient')
    );
  });

  it('skips db driver install for sqlite', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    const calls = mockUtils.runInProject.mock.calls.map(c => c[1]);
    expect(
      calls.some(c => c.includes('psycopg2') || c.includes('mysqlclient'))
    ).toBe(false);
  });

  // ─── REST Framework ────────────────────────────────────

  it('installs djangorestframework when selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: true,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-app',
      expect.stringContaining('djangorestframework')
    );
  });

  it('appends rest_framework to INSTALLED_APPS in settings.py', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: true,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.appendToFile).toHaveBeenCalledWith(
      expect.stringContaining('settings.py'),
      expect.stringContaining('rest_framework')
    );
  });

  it('includes djangorestframework in requirements.txt when selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: true,
        docker: false,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('requirements.txt')
    )[1];
    expect(content).toContain('djangorestframework');
  });

  it('skips rest framework when not selected', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.appendToFile).not.toHaveBeenCalled();
  });

  // ─── Docker ────────────────────────────────────────────

  it('creates Dockerfile and docker-compose.yml when docker is true', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: true,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(true);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(true);
  });

  it('includes postgres db service in docker-compose for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'postgresql',
        restFramework: false,
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('postgres:15');
  });

  it('includes mysql db service in docker-compose for mysql', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'mysql',
        restFramework: false,
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('mysql:8.0');
  });

  it('skips docker files when docker is false', async () => {
    await scaffold(
      {
        projectName: 'my-app',
        database: 'sqlite',
        restFramework: false,
        docker: false,
      },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(false);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(false);
  });
});
