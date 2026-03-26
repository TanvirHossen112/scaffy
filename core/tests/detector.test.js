import {
  getOS,
  runCommand,
  parseVersionFromOutput,
  satisfiesMinVersion,
  buildToolResult,
  checkTool,
  checkAll,
  formatToolStatus,
  formatInstallGuide,
  formatResult,
  detectAvailableChoices,
} from '../detector.js';

describe('getOS()', () => {
  test('returns mac, linux or windows', () => {
    const result = getOS();
    expect(['mac', 'linux', 'windows']).toContain(result);
  });
});

describe('runCommand()', () => {
  test('returns success true for valid command', () => {
    const result = runCommand('node --version');
    expect(result.success).toBe(true);
    expect(result.output).toBeTruthy();
  });

  test('returns success false for invalid command', () => {
    const result = runCommand('fake-tool-xyz --version');
    expect(result.success).toBe(false);
    expect(result.output).toBe('');
  });
});

describe('parseVersionFromOutput()', () => {
  test('parses version correctly', () => {
    const result = parseVersionFromOutput('v18.17.0', 'v([0-9.]+)');
    expect(result).toBe('18.17.0');
  });

  test('returns null when no match', () => {
    const result = parseVersionFromOutput('some random output', 'v([0-9.]+)');
    expect(result).toBeNull();
  });

  test('returns null when output is empty', () => {
    const result = parseVersionFromOutput('', 'v([0-9.]+)');
    expect(result).toBeNull();
  });

  test('returns null when parseVersion is null', () => {
    const result = parseVersionFromOutput('v18.0.0', null);
    expect(result).toBeNull();
  });
});

describe('satisfiesMinVersion()', () => {
  test('returns true when version is above minimum', () => {
    expect(satisfiesMinVersion('18.0.0', '14.0.0')).toBe(true);
  });

  test('returns true when version equals minimum', () => {
    expect(satisfiesMinVersion('18.0.0', '18.0.0')).toBe(true);
  });

  test('returns false when version is below minimum', () => {
    expect(satisfiesMinVersion('12.0.0', '14.0.0')).toBe(false);
  });

  test('returns true when no minVersion provided', () => {
    expect(satisfiesMinVersion('18.0.0', null)).toBe(true);
  });

  test('returns true when no installedVersion provided', () => {
    expect(satisfiesMinVersion(null, '14.0.0')).toBe(true);
  });
});

describe('buildToolResult()', () => {
  test('builds basic result correctly', () => {
    const result = buildToolResult('node', true, true);
    expect(result).toEqual({
      tool: 'node',
      installed: true,
      versionOk: true,
    });
  });

  test('builds result with extra fields', () => {
    const result = buildToolResult('node', true, false, {
      installedVersion: '12.0.0',
      requiredVersion: '14.0.0',
    });
    expect(result.installedVersion).toBe('12.0.0');
    expect(result.requiredVersion).toBe('14.0.0');
  });
});

describe('checkTool()', () => {
  test('detects node correctly', () => {
    const result = checkTool({
      tool: 'node',
      checkCommand: 'node --version',
      parseVersion: 'v([0-9.]+)',
      minVersion: '14.0.0',
    });
    expect(result.installed).toBe(true);
    expect(result.versionOk).toBe(true);
  });

  test('fails gracefully for missing tool', () => {
    const result = checkTool({
      tool: 'fake-tool-xyz',
      checkCommand: 'fake-tool-xyz --version',
    });
    expect(result.installed).toBe(false);
    expect(result.versionOk).toBe(false);
  });

  test('detects version too old', () => {
    const result = checkTool({
      tool: 'node',
      checkCommand: 'node --version',
      parseVersion: 'v([0-9.]+)',
      minVersion: '999.0.0',
    });
    expect(result.installed).toBe(true);
    expect(result.versionOk).toBe(false);
    expect(result.installedVersion).toBeTruthy();
    expect(result.requiredVersion).toBe('999.0.0');
  });
});

describe('checkAll()', () => {
  test('returns allPassed true when all tools found', () => {
    const { allPassed } = checkAll([
      {
        tool: 'node',
        checkCommand: 'node --version',
        parseVersion: 'v([0-9.]+)',
        minVersion: '14.0.0',
        installGuide: { docs: 'https://nodejs.org' },
      },
    ]);
    expect(allPassed).toBe(true);
  });

  test('returns allPassed false when tool missing', () => {
    const { allPassed } = checkAll([
      {
        tool: 'fake-tool-xyz',
        checkCommand: 'fake-tool-xyz --version',
        installGuide: { docs: 'https://example.com' },
      },
    ]);
    expect(allPassed).toBe(false);
  });

  test('returns allPassed false when one of many fails', () => {
    const { allPassed, results } = checkAll([
      {
        tool: 'node',
        checkCommand: 'node --version',
        installGuide: { docs: 'https://nodejs.org' },
      },
      {
        tool: 'fake-tool-xyz',
        checkCommand: 'fake-tool-xyz --version',
        installGuide: { docs: 'https://example.com' },
      },
    ]);
    expect(allPassed).toBe(false);
    expect(results).toHaveLength(2);
  });
});

describe('formatToolStatus()', () => {
  test('formats installed tool correctly', () => {
    const result = formatToolStatus({
      tool: 'node',
      installed: true,
      versionOk: true,
    });
    expect(result).toContain('node');
    expect(result).toContain('found');
  });

  test('formats missing tool correctly', () => {
    const result = formatToolStatus({
      tool: 'composer',
      installed: false,
      versionOk: false,
    });
    expect(result).toContain('composer');
    expect(result).toContain('not found');
  });

  test('formats outdated tool correctly', () => {
    const result = formatToolStatus({
      tool: 'node',
      installed: true,
      versionOk: false,
      installedVersion: '12.0.0',
      requiredVersion: '14.0.0',
    });
    expect(result).toContain('12.0.0');
    expect(result).toContain('14.0.0');
  });
});

describe('detectAvailableChoices()', () => {
  const npmChoice = {
    name: 'npm',
    value: 'npm',
    checkCommand: 'npm --version',
  };
  const yarnChoice = {
    name: 'yarn',
    value: 'yarn',
    checkCommand: 'yarn --version',
  };
  const pnpmChoice = {
    name: 'pnpm',
    value: 'pnpm',
    checkCommand: 'pnpm --version',
  };

  test('returns only installed tools', async () => {
    const result = await detectAvailableChoices([
      npmChoice,
      yarnChoice,
      pnpmChoice,
    ]);
    const values = result.map(c => c.value);
    expect(values).toContain('npm');
    result.forEach(c => expect(c.installed).toBe(true));
  });

  test('always returns at least one choice', async () => {
    const result = await detectAvailableChoices([npmChoice, yarnChoice]);
    expect(result.length).toBeGreaterThan(0);
  });

  test('returns first choice as fallback when nothing installed', async () => {
    const allFakeChoices = [
      {
        name: 'fake-a',
        value: 'fake-a',
        checkCommand: 'node -e "process.exit(1)"',
      },
      {
        name: 'fake-b',
        value: 'fake-b',
        checkCommand: 'node -e "process.exit(1)"',
      },
    ];
    const result = await detectAvailableChoices(allFakeChoices);
    expect(result.length).toBe(1);
    expect(result[0].value).toBe('fake-a');
  });

  test('returns correct shape with name and value fields', async () => {
    const result = await detectAvailableChoices([npmChoice]);
    result.forEach(choice => {
      expect(choice).toHaveProperty('name');
      expect(choice).toHaveProperty('value');
      expect(choice).toHaveProperty('checkCommand');
    });
  });

  test('handles single choice array', async () => {
    const result = await detectAvailableChoices([npmChoice]);
    expect(result.length).toBe(1);
    expect(result[0].value).toBe('npm');
  });

  test('handles empty choices array', async () => {
    const result = await detectAvailableChoices([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('npm is always detected as installed', async () => {
    const result = await detectAvailableChoices([npmChoice]);
    expect(result[0].value).toBe('npm');
    expect(result[0].installed).toBe(true);
  });

  test('runs all checks in parallel', async () => {
    const start = Date.now();
    await detectAvailableChoices([npmChoice, yarnChoice, pnpmChoice]);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});

describe('formatInstallGuide()', () => {
  test('returns empty array when no guide', () => {
    const result = formatInstallGuide();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  test('includes docs when provided', () => {
    const result = formatInstallGuide({ docs: 'https://example.com' }, 'linux');
    expect(result.join('')).toContain('Docs');
  });

  test('includes os-specific guide when present', () => {
    const result = formatInstallGuide(
      { linux: 'apt install', docs: 'https://example.com' },
      'linux'
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.find(line => line.includes('Install'))).toBeDefined();
  });
});

describe('formatResult()', () => {
  test('returns found line for installed and versionOk', () => {
    const result = formatResult('linux')({
      tool: 'node',
      installed: true,
      versionOk: true,
    });
    expect(result).toContain('found');
  });

  test('returns help lines for missing tool', () => {
    const result = formatResult('linux')({
      tool: 'fake-tool-xyz',
      installed: false,
      versionOk: false,
      installGuide: { docs: 'https://example.com' },
    });
    expect(result).toContain('not found');
    expect(result).toContain('Docs');
  });
});
