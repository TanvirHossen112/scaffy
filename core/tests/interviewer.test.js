import { jest } from '@jest/globals';
import inquirer from 'inquirer';
import {
  baseQuestions,
  buildQuestions,
  buildFrameworkChoices,
  buildVersionChoices,
  askVersion,
  askFrameworkQuestions,
  askDirectFramework,
  handlePromptError,
} from '../interviewer.js';

const mockFramework = {
  name: 'Laravel',
  language: 'php',
  latest: 'v11',
  versions: ['v11', 'v10'],
  alias: ['laravel'],
  path: 'php/laravel',
};

const mockFrameworkSingleVersion = {
  name: 'NestJS',
  language: 'javascript',
  latest: 'v10',
  versions: ['v10'],
  alias: ['nestjs', 'nest'],
  path: 'javascript/nestjs',
};

// ─── baseQuestions ─────────────────────────────────────
describe('baseQuestions()', () => {
  test('returns array with project name question', () => {
    const result = baseQuestions(mockFramework);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('project name question has correct default', () => {
    const result = baseQuestions(mockFramework);
    const projectNameQ = result.find(q => q.name === 'projectName');
    expect(projectNameQ).toBeDefined();
    expect(projectNameQ.default).toBe('my-laravel-app');
  });

  test('default is lowercased framework name', () => {
    const result = baseQuestions(mockFrameworkSingleVersion);
    const projectNameQ = result.find(q => q.name === 'projectName');
    expect(projectNameQ.default).toBe('my-nestjs-app');
  });

  test('validator rejects empty project name', () => {
    const result = baseQuestions(mockFramework);
    const projectNameQ = result.find(q => q.name === 'projectName');
    const validation = projectNameQ.validate('   ');
    expect(validation).toBe('Project name is required');
  });

  test('validator rejects uppercase letters', () => {
    const result = baseQuestions(mockFramework);
    const projectNameQ = result.find(q => q.name === 'projectName');
    const validation = projectNameQ.validate('MyProject');
    expect(validation).toContain('lowercase');
  });

  test('validator rejects spaces', () => {
    const result = baseQuestions(mockFramework);
    const projectNameQ = result.find(q => q.name === 'projectName');
    const validation = projectNameQ.validate('my project');
    expect(typeof validation).toBe('string');
  });

  test('validator accepts valid project name', () => {
    const result = baseQuestions(mockFramework);
    const projectNameQ = result.find(q => q.name === 'projectName');
    expect(projectNameQ.validate('my-project')).toBe(true);
    expect(projectNameQ.validate('my_project')).toBe(true);
    expect(projectNameQ.validate('myproject123')).toBe(true);
  });
});

// ─── buildQuestions ────────────────────────────────────
describe('buildQuestions()', () => {
  test('combines base and plugin questions', () => {
    const pluginQuestions = [
      { type: 'select', name: 'database', message: 'DB?', choices: [] },
    ];
    const result = buildQuestions(mockFramework, pluginQuestions);
    expect(result.length).toBe(2); // 1 base + 1 plugin
  });

  test('base questions come first', () => {
    const pluginQuestions = [
      { type: 'select', name: 'database', message: 'DB?', choices: [] },
    ];
    const result = buildQuestions(mockFramework, pluginQuestions);
    expect(result[0].name).toBe('projectName');
  });

  test('returns only base questions when no plugin questions', () => {
    const result = buildQuestions(mockFramework, []);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('projectName');
  });
});

// ─── buildFrameworkChoices ─────────────────────────────
describe('buildFrameworkChoices()', () => {
  test('returns array of choices', () => {
    const result = buildFrameworkChoices();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('each choice has name and value', () => {
    const result = buildFrameworkChoices();
    result.forEach(choice => {
      expect(choice).toHaveProperty('name');
      expect(choice).toHaveProperty('value');
    });
  });

  test('choice name contains framework name', () => {
    const result = buildFrameworkChoices();
    const laravelChoice = result.find(c => c.value.name === 'Laravel');
    expect(laravelChoice).toBeDefined();
    expect(laravelChoice.name).toContain('Laravel');
  });
});

// ─── buildVersionChoices ───────────────────────────────
describe('buildVersionChoices()', () => {
  test('returns choices for all versions', () => {
    const result = buildVersionChoices(mockFramework);
    expect(result.length).toBe(2);
  });

  test('marks latest version with star', () => {
    const result = buildVersionChoices(mockFramework);
    const latestChoice = result.find(c => c.value === mockFramework.latest);
    expect(latestChoice.name).toContain('⭐');
  });

  test('non latest version has no star', () => {
    const result = buildVersionChoices(mockFramework);
    const oldChoice = result.find(c => c.value === 'v10');
    expect(oldChoice.name).not.toContain('⭐');
  });

  test('single version returns one choice', () => {
    const result = buildVersionChoices(mockFrameworkSingleVersion);
    expect(result.length).toBe(1);
  });
});

describe('askVersion()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns latest version when there is only one version', async () => {
    const result = await askVersion(mockFrameworkSingleVersion);
    expect(result).toBe('v10');
  });

  test('prompts user when there are multiple versions', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValue({ version: 'v10' });
    const result = await askVersion(mockFramework);
    expect(result).toBe('v10');
  });
});

// ─── askFrameworkQuestions ─────────────────────────────
describe('askFrameworkQuestions()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('uses plugin.questions() when function', async () => {
    const promptMock = jest.spyOn(inquirer, 'prompt').mockResolvedValue({
      projectName: 'my-laravel-app',
      extra: 'yes',
    });

    const plugin = {
      questions: async () => [
        { type: 'input', name: 'extra', message: 'Extra? ' },
      ],
    };

    const result = await askFrameworkQuestions(mockFramework, plugin);
    expect(result).toEqual({ projectName: 'my-laravel-app', extra: 'yes' });
    expect(promptMock).toHaveBeenCalled();
  });

  test('uses plugin.questions array when non-function', async () => {
    const promptMock = jest.spyOn(inquirer, 'prompt').mockResolvedValue({
      projectName: 'my-laravel-app',
      solid: 'true',
    });

    const plugin = {
      questions: [{ type: 'input', name: 'solid', message: 'Solid? ' }],
    };

    const result = await askFrameworkQuestions(mockFramework, plugin);
    expect(result).toEqual({ projectName: 'my-laravel-app', solid: 'true' });
    expect(promptMock).toHaveBeenCalled();
  });
});

// ─── askDirectFramework ────────────────────────────────
describe('askDirectFramework()', () => {
  test('returns null for unknown framework', async () => {
    const result = await askDirectFramework('unknownxyz');
    expect(result).toBeNull();
  });

  test('returns framework for known name', async () => {
    const result = await askDirectFramework('laravel');
    expect(result).not.toBeNull();
    expect(result.name).toBe('Laravel');
  });

  test('returns framework for alias', async () => {
    const result = await askDirectFramework('nest');
    expect(result).not.toBeNull();
    expect(result.name).toBe('NestJS');
  });
});

// ─── handlePromptError ─────────────────────────────────
describe('handlePromptError()', () => {
  test('exits process on error', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    handlePromptError(new Error('cancelled'));

    expect(mockExit).toHaveBeenCalledWith(0);
    mockExit.mockRestore();
  });
});
