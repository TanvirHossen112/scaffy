const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  run,
  runInProject,
  setEnv,
  appendToFile,
  createFile,
} = require('../executor');

const createTempDir = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffy-test-'));
  return tempDir;
};

const cleanupTempDir = dir => {
  fs.rmSync(dir, { recursive: true, force: true });
};

describe('run()', () => {
  test('runs a valid command successfully', async () => {
    await expect(run('node --version')).resolves.not.toThrow();
  });

  test('rejects on invalid command', async () => {
    await expect(run('fake-command-xyz --version')).rejects.toThrow();
  });

  test('rejects when command exits with non zero code', async () => {
    await expect(run('node -e "process.exit(1)"')).rejects.toThrow(
      'exit code 1'
    );
  });
});

describe('runInProject()', () => {
  let tempDir;
  let projectName;

  beforeEach(() => {
    tempDir = createTempDir();
    projectName = path.basename(tempDir);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  test('runs command inside project directory', async () => {
    const parentDir = path.dirname(tempDir);
    const originalCwd = process.cwd();
    process.chdir(parentDir);

    await expect(
      runInProject(projectName, 'node --version')
    ).resolves.not.toThrow();

    process.chdir(originalCwd);
  });
});

describe('setEnv()', () => {
  let tempDir;
  let projectName;
  let originalCwd;

  beforeEach(() => {
    tempDir = createTempDir();
    projectName = path.basename(tempDir);
    originalCwd = process.cwd();
    process.chdir(path.dirname(tempDir));

    fs.writeFileSync(
      path.join(tempDir, '.env'),
      'APP_NAME=Laravel\nDB_CONNECTION=mysql\n'
    );
  });

  afterEach(() => {
    process.chdir(originalCwd);
    cleanupTempDir(tempDir);
  });

  test('updates existing env variable', () => {
    setEnv(projectName, { DB_CONNECTION: 'postgresql' });
    const content = fs.readFileSync(path.join(tempDir, '.env'), 'utf8');
    expect(content).toContain('DB_CONNECTION=postgresql');
    expect(content).not.toContain('DB_CONNECTION=mysql');
  });

  test('appends new env variable', () => {
    setEnv(projectName, { DB_PORT: '5432' });
    const content = fs.readFileSync(path.join(tempDir, '.env'), 'utf8');
    expect(content).toContain('DB_PORT=5432');
  });

  test('updates multiple variables at once', () => {
    setEnv(projectName, {
      DB_CONNECTION: 'postgresql',
      DB_PORT: '5432',
    });
    const content = fs.readFileSync(path.join(tempDir, '.env'), 'utf8');
    expect(content).toContain('DB_CONNECTION=postgresql');
    expect(content).toContain('DB_PORT=5432');
  });

  test('throws when .env file does not exist', () => {
    expect(() => setEnv('non-existent-project', { KEY: 'value' })).toThrow(
      '.env file not found'
    );
  });
});

describe('appendToFile()', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    tempDir = createTempDir();
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    cleanupTempDir(tempDir);
  });

  test('creates file and appends content', () => {
    appendToFile('test.txt', 'hello world');
    const content = fs.readFileSync(path.join(tempDir, 'test.txt'), 'utf8');
    expect(content).toBe('hello world');
  });

  test('appends to existing file', () => {
    appendToFile('test.txt', 'line 1\n');
    appendToFile('test.txt', 'line 2\n');
    const content = fs.readFileSync(path.join(tempDir, 'test.txt'), 'utf8');
    expect(content).toBe('line 1\nline 2\n');
  });

  test('creates nested directories if needed', () => {
    appendToFile('nested/deep/test.txt', 'content');
    expect(fs.existsSync(path.join(tempDir, 'nested/deep/test.txt'))).toBe(
      true
    );
  });
});

describe('createFile()', () => {
  let tempDir;
  let originalCwd;

  beforeEach(() => {
    tempDir = createTempDir();
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    cleanupTempDir(tempDir);
  });

  test('creates file with content', () => {
    createFile('Dockerfile', 'FROM node:18\n');
    const content = fs.readFileSync(path.join(tempDir, 'Dockerfile'), 'utf8');
    expect(content).toBe('FROM node:18\n');
  });

  test('creates empty file when no content given', () => {
    createFile('empty.txt');
    expect(fs.existsSync(path.join(tempDir, 'empty.txt'))).toBe(true);
  });

  test('creates nested directories if needed', () => {
    createFile('src/config/app.js', 'module.exports = {}');
    expect(fs.existsSync(path.join(tempDir, 'src/config/app.js'))).toBe(true);
  });

  test('overwrites existing file', () => {
    createFile('test.txt', 'original');
    createFile('test.txt', 'updated');
    const content = fs.readFileSync(path.join(tempDir, 'test.txt'), 'utf8');
    expect(content).toBe('updated');
  });
});
