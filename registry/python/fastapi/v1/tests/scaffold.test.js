import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('FastAPI v1 scaffold', () => {
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

  it('creates project and app directories', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    const calls = mockUtils.run.mock.calls.map(c => c[0]);
    expect(calls.some(c => c.includes('mkdir my-api'))).toBe(true);
    expect(calls.some(c => c.includes('mkdir my-api/app'))).toBe(true);
  });

  it('creates virtual environment', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('python3 -m venv venv')
    );
  });

  it('installs fastapi and uvicorn', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('fastapi')
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('uvicorn')
    );
  });

  it('creates main.py', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('main.py'),
      expect.stringContaining('FastAPI')
    );
  });

  it('creates async route when async is true', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: true, docker: false },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('main.py')
    )[1];
    expect(content).toContain('async def root');
  });

  it('creates sync route when async is false', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('main.py')
    )[1];
    expect(content).not.toContain('async def root');
  });

  it('creates requirements.txt', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('requirements.txt'),
      expect.stringContaining('fastapi')
    );
  });

  // ─── Database ──────────────────────────────────────────

  it('installs sqlalchemy and alembic when database selected', async () => {
    await scaffold(
      {
        projectName: 'my-api',
        database: 'postgresql',
        async: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('sqlalchemy')
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('alembic')
    );
  });

  it('installs asyncpg for postgresql with async', async () => {
    await scaffold(
      {
        projectName: 'my-api',
        database: 'postgresql',
        async: true,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('asyncpg')
    );
  });

  it('installs psycopg2-binary for postgresql without async', async () => {
    await scaffold(
      {
        projectName: 'my-api',
        database: 'postgresql',
        async: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('psycopg2-binary')
    );
  });

  it('installs aiomysql for mysql with async', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'mysql', async: true, docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('aiomysql')
    );
  });

  it('installs mysqlclient for mysql without async', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'mysql', async: false, docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('mysqlclient')
    );
  });

  it('installs aiosqlite for sqlite with async', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'sqlite', async: true, docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('aiosqlite')
    );
  });

  it('creates database.py when database selected', async () => {
    await scaffold(
      {
        projectName: 'my-api',
        database: 'postgresql',
        async: false,
        docker: false,
      },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('database.py'),
      expect.any(String)
    );
  });

  it('skips database setup when none selected', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('database.py'))).toBe(false);
  });

  // ─── Docker ────────────────────────────────────────────

  it('creates Dockerfile and docker-compose.yml when docker is true', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: true },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(true);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(true);
  });

  it('includes postgres service in docker-compose for postgresql', async () => {
    await scaffold(
      {
        projectName: 'my-api',
        database: 'postgresql',
        async: false,
        docker: true,
      },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('postgres:15');
  });

  it('includes mysql service in docker-compose for mysql', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'mysql', async: false, docker: true },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('mysql:8.0');
  });

  it('skips docker files when docker is false', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', async: false, docker: false },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(false);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(false);
  });
});
