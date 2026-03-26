import { jest } from '@jest/globals';
import {
  log,
  success,
  warn,
  error,
  title,
  divider,
  step,
  buildPluginUtils,
} from '../utils.js';

// ─── Silence console output during tests ──────────────
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ─── log() ────────────────────────────────────────────
describe('log()', () => {
  test('calls console.log', () => {
    log('test message');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes message in output', () => {
    log('hello world');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('hello world');
  });
});

// ─── success() ────────────────────────────────────────
describe('success()', () => {
  test('calls console.log', () => {
    success('it worked!');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes message in output', () => {
    success('project created');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('project created');
  });
});

// ─── warn() ───────────────────────────────────────────
describe('warn()', () => {
  test('calls console.log', () => {
    warn('something is off');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes message in output', () => {
    warn('missing optional tool');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('missing optional tool');
  });
});

// ─── error() ──────────────────────────────────────────
describe('error()', () => {
  test('calls console.log', () => {
    error('something broke');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes message in output', () => {
    error('command failed');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('command failed');
  });
});

// ─── title() ──────────────────────────────────────────
describe('title()', () => {
  test('calls console.log', () => {
    title('Setting Up Project');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes message in output', () => {
    title('Setting Up Project');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('Setting Up Project');
  });
});

// ─── divider() ────────────────────────────────────────
describe('divider()', () => {
  test('calls console.log', () => {
    divider();
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});

// ─── step() ───────────────────────────────────────────
describe('step()', () => {
  test('calls console.log', () => {
    step(1, 'Installing dependencies');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('includes step number in output', () => {
    step(3, 'Configuring database');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('3');
  });

  test('includes message in output', () => {
    step(1, 'Installing dependencies');
    const output = console.log.mock.calls[0][0];
    expect(output).toContain('Installing dependencies');
  });
});

// ─── buildPluginUtils() ───────────────────────────────
describe('buildPluginUtils()', () => {
  const mockExecutor = {
    run: jest.fn(),
    runInProject: jest.fn(),
    setEnv: jest.fn(),
    appendToFile: jest.fn(),
    createFile: jest.fn(),
  };

  test('returns object with all executor methods', () => {
    const utils = buildPluginUtils(mockExecutor);
    expect(utils).toHaveProperty('run');
    expect(utils).toHaveProperty('runInProject');
    expect(utils).toHaveProperty('setEnv');
    expect(utils).toHaveProperty('appendToFile');
    expect(utils).toHaveProperty('createFile');
  });

  test('returns object with all util methods', () => {
    const utils = buildPluginUtils(mockExecutor);
    expect(utils).toHaveProperty('log');
    expect(utils).toHaveProperty('success');
    expect(utils).toHaveProperty('warn');
    expect(utils).toHaveProperty('error');
    expect(utils).toHaveProperty('step');
  });

  test('run points to executor.run', () => {
    const utils = buildPluginUtils(mockExecutor);
    expect(utils.run).toBe(mockExecutor.run);
  });

  test('log is a function', () => {
    const utils = buildPluginUtils(mockExecutor);
    expect(typeof utils.log).toBe('function');
  });
});
