import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Gin v1 scaffold', () => {
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
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.run).toHaveBeenCalledWith(
      expect.stringContaining('mkdir my-api')
    );
  });

  it('initializes go module', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('go mod init my-api')
    );
  });

  it('installs gin', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('gin-gonic/gin')
    );
  });

  it('creates main.go', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('main.go'),
      expect.stringContaining('gin.Default()')
    );
  });

  it('main.go includes health endpoint', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('main.go')
    )[1];
    expect(content).toContain('/health');
  });

  it('creates .gitignore', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('.gitignore'),
      expect.any(String)
    );
  });

  it('runs go mod tidy', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('go mod tidy')
    );
  });

  // ─── Database ──────────────────────────────────────────

  it('installs gorm when database selected', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'postgresql', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('gorm.io/gorm')
    );
  });

  it('installs postgres driver for postgresql', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'postgresql', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('gorm.io/driver/postgres')
    );
  });

  it('installs mysql driver for mysql', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'mysql', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('gorm.io/driver/mysql')
    );
  });

  it('installs sqlite driver for sqlite', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'sqlite', docker: false },
      mockUtils
    );
    expect(mockUtils.runInProject).toHaveBeenCalledWith(
      'my-api',
      expect.stringContaining('gorm.io/driver/sqlite')
    );
  });

  it('creates database.go when database selected', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'postgresql', docker: false },
      mockUtils
    );
    expect(mockUtils.createFile).toHaveBeenCalledWith(
      expect.stringContaining('database.go'),
      expect.stringContaining('gorm.Open')
    );
  });

  it('skips database setup when none selected', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('database.go'))).toBe(false);
  });

  it('skips gorm install when none selected', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    const calls = mockUtils.runInProject.mock.calls.map(c => c[1]);
    expect(calls.some(c => c.includes('gorm'))).toBe(false);
  });

  // ─── Docker ────────────────────────────────────────────

  it('creates Dockerfile and docker-compose.yml when docker is true', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: true },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(true);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(true);
  });

  it('Dockerfile uses multi-stage build', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: true },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('Dockerfile')
    )[1];
    expect(content).toContain('AS builder');
    expect(content).toContain('alpine:latest');
  });

  it('includes postgres service in docker-compose for postgresql', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'postgresql', docker: true },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('postgres:15');
  });

  it('includes mysql service in docker-compose for mysql', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'mysql', docker: true },
      mockUtils
    );
    const content = mockUtils.createFile.mock.calls.find(c =>
      c[0].includes('docker-compose.yml')
    )[1];
    expect(content).toContain('mysql:8.0');
  });

  it('skips docker files when docker is false', async () => {
    await scaffold(
      { projectName: 'my-api', database: 'none', docker: false },
      mockUtils
    );
    const paths = mockUtils.createFile.mock.calls.map(c => c[0]);
    expect(paths.some(p => p.includes('Dockerfile'))).toBe(false);
    expect(paths.some(p => p.includes('docker-compose.yml'))).toBe(false);
  });
});
