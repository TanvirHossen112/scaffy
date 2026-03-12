const { execSync } = require('child_process');
const path = require('path');

// ─── Helper to run cli commands ───────────────────────
const runCli = command => {
  try {
    const output = execSync(
      `node ${path.join(__dirname, '../../cli.js')} ${command}`,
      {
        stdio: 'pipe',
        timeout: 10000,
      }
    ).toString();
    return { success: true, output };
  } catch (err) {
    return {
      success: false,
      output: err.stdout ? err.stdout.toString() : err.message,
    };
  }
};

// ─── --version ────────────────────────────────────────
describe('scaffy --version', () => {
  test('returns version number', () => {
    const { output } = runCli('--version');
    expect(output).toContain('0.1.0');
  });
});

// ─── --help ───────────────────────────────────────────
describe('scaffy --help', () => {
  test('returns help output', () => {
    const { output } = runCli('--help');
    expect(output).toContain('scaffy');
  });

  test('shows list command in help', () => {
    const { output } = runCli('--help');
    expect(output).toContain('list');
  });

  test('shows search command in help', () => {
    const { output } = runCli('--help');
    expect(output).toContain('search');
  });
});

// ─── list ─────────────────────────────────────────────
describe('scaffy list', () => {
  test('shows available frameworks', () => {
    const { output } = runCli('list');
    expect(output).toContain('Laravel');
  });

  test('shows php frameworks', () => {
    const { output } = runCli('list');
    expect(output).toContain('PHP');
  });

  test('shows javascript frameworks', () => {
    const { output } = runCli('list');
    expect(output).toContain('JAVASCRIPT');
  });
});

// ─── search ───────────────────────────────────────────
describe('scaffy search', () => {
  test('finds framework by language', () => {
    const { output } = runCli('search php');
    expect(output).toContain('Laravel');
  });

  test('finds framework by name', () => {
    const { output } = runCli('search nest');
    expect(output).toContain('NestJS');
  });

  test('shows no results message for unknown query', () => {
    const { output } = runCli('search xyzunknown');
    expect(output).toContain('No frameworks found');
  });
});

// ─── unknown framework ────────────────────────────────
describe('scaffy <unknown>', () => {
  test('shows not found message', () => {
    const { output } = runCli('unknownxyz');
    expect(output).toContain('not found');
  });
});
