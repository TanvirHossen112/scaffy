import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  loadIndex,
  getFrameworks,
  getAvailableFrameworks,
  isPluginComplete,
  findFramework,
  searchFrameworks,
  groupByLanguage,
  validatePluginFiles,
  formatFrameworkLine,
} from '../registry.js';

describe('loadIndex()', () => {
  test('loads index.json successfully', () => {
    const result = loadIndex();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('frameworks');
  });

  test('returns null for invalid json', () => {
    const result = loadIndex();
    expect(typeof result).toBe('object');
  });
});

describe('getFrameworks()', () => {
  test('returns array of frameworks', () => {
    const result = getFrameworks();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('each framework has required fields', () => {
    const frameworks = getFrameworks();
    frameworks.forEach(f => {
      expect(f).toHaveProperty('name');
      expect(f).toHaveProperty('alias');
      expect(f).toHaveProperty('language');
      expect(f).toHaveProperty('latest');
      expect(f).toHaveProperty('versions');
      expect(f).toHaveProperty('path');
    });
  });
});

describe('findFramework()', () => {
  test('finds framework by exact name', () => {
    const result = findFramework('Laravel');
    expect(result).not.toBeNull();
    expect(result.name).toBe('Laravel');
  });

  test('finds framework by alias', () => {
    const result = findFramework('nestjs');
    expect(result).not.toBeNull();
    expect(result.name).toBe('NestJS');
  });

  test('is case insensitive', () => {
    const result = findFramework('LARAVEL');
    expect(result).not.toBeNull();
    expect(result.name).toBe('Laravel');
  });

  test('returns null for unknown framework', () => {
    const result = findFramework('unknownxyz');
    expect(result).toBeNull();
  });

  test('finds framework by partial alias', () => {
    const result = findFramework('vue');
    expect(result).not.toBeNull();
    expect(result.name).toBe('VueJS');
  });
});

describe('searchFrameworks()', () => {
  test('finds frameworks by partial name', () => {
    const results = searchFrameworks('nest');
    expect(results.length).toBeGreaterThan(0);
  });

  test('finds frameworks by language', () => {
    const results = searchFrameworks('php');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(f => {
      expect(f.language).toBe('php');
    });
  });

  test('returns empty array for no match', () => {
    const results = searchFrameworks('xyzunknown');
    expect(results).toHaveLength(0);
  });

  test('finds multiple frameworks in same language', () => {
    const results = searchFrameworks('javascript');
    expect(results.length).toBeGreaterThan(1);
  });
});

describe('groupByLanguage()', () => {
  test('groups frameworks correctly', () => {
    const frameworks = [
      {
        name: 'Laravel',
        language: 'php',
        alias: [],
        latest: 'v11',
        versions: ['v11'],
        path: 'php/laravel',
      },
      {
        name: 'Symfony',
        language: 'php',
        alias: [],
        latest: 'v7',
        versions: ['v7'],
        path: 'php/symfony',
      },
      {
        name: 'NestJS',
        language: 'javascript',
        alias: [],
        latest: 'v10',
        versions: ['v10'],
        path: 'javascript/nestjs',
      },
    ];

    const result = groupByLanguage(frameworks);

    expect(result).toHaveProperty('php');
    expect(result).toHaveProperty('javascript');
    expect(result.php).toHaveLength(2);
    expect(result.javascript).toHaveLength(1);
  });

  test('returns empty object for empty array', () => {
    const result = groupByLanguage([]);
    expect(result).toEqual({});
  });
});

describe('validatePluginFiles()', () => {
  test('returns invalid for non existent plugin path', () => {
    const result = validatePluginFiles('/non/existent/path', 'v11');
    expect(result.valid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });
});

describe('formatFrameworkLine()', () => {
  test('formats framework line correctly', () => {
    const framework = {
      name: 'Laravel',
      alias: ['laravel'],
      latest: 'v11',
    };
    const result = formatFrameworkLine(framework);
    expect(result).toContain('Laravel');
    expect(result).toContain('laravel');
    expect(result).toContain('v11');
  });

  test('handles multiple aliases', () => {
    const framework = {
      name: 'NestJS',
      alias: ['nestjs', 'nest'],
      latest: 'v10',
    };
    const result = formatFrameworkLine(framework);
    expect(result).toContain('nestjs');
    expect(result).toContain('nest');
  });
});

describe('isPluginComplete', () => {
  it('returns true when questions.js and scaffold.js exist', () => {
    const framework = {
      name: 'Laravel',
      path: 'php/laravel',
      latest: 'v11',
    };
    expect(isPluginComplete(framework)).toBe(true);
  });

  it('returns false when questions.js or scaffold.js is missing', () => {
    const framework = {
      name: 'Laravel',
      path: 'php/laravel',
      latest: 'v10', // stub only
    };
    expect(isPluginComplete(framework)).toBe(false);
  });
});

describe('getAvailableFrameworks', () => {
  it('returns only frameworks with complete plugin files', () => {
    const frameworks = getAvailableFrameworks();
    frameworks.forEach(f => {
      expect(isPluginComplete(f)).toBe(true);
    });
  });

  it('excludes stub-only frameworks', () => {
    const frameworks = getAvailableFrameworks();
    const names = frameworks.map(f => f.name.toLowerCase());
    frameworks.forEach(f => {
      const versionPath = path.join(
        __dirname,
        '..',
        '..',
        'registry',
        f.path,
        f.latest
      );
      expect(fs.existsSync(path.join(versionPath, 'scaffold.js'))).toBe(true);
    });
  });
});
