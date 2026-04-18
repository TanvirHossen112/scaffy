import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../../../../core/detector.js', () => ({
  detectAvailableChoices: jest.fn().mockResolvedValue([
    { name: 'npm', value: 'npm' },
    { name: 'yarn', value: 'yarn' },
  ]),
}));

describe('React questions', () => {
  let getQuestions;

  beforeEach(async () => {
    jest.resetModules();
    const mod = await import('../questions.js');
    getQuestions = mod.default;
  });

  it('returns an array of questions', async () => {
    const questions = await getQuestions();
    expect(Array.isArray(questions)).toBe(true);
  });

  it('has projectName, variant, packageManager questions', async () => {
    const questions = await getQuestions();
    const names = questions.map(q => q.name);
    expect(names).toContain('projectName');
    expect(names).toContain('variant');
    expect(names).toContain('packageManager');
  });

  it('projectName default is my-react-app', async () => {
    const questions = await getQuestions();
    const q = questions.find(q => q.name === 'projectName');
    expect(q.default).toBe('my-react-app');
  });

  it('variant has all 4 choices', async () => {
    const questions = await getQuestions();
    const q = questions.find(q => q.name === 'variant');
    const values = q.choices.map(c => c.value);
    expect(values).toContain('react-ts');
    expect(values).toContain('react');
    expect(values).toContain('react-swc-ts');
    expect(values).toContain('react-swc');
  });

  it('packageManager choices come from detectAvailableChoices', async () => {
    const questions = await getQuestions();
    const q = questions.find(q => q.name === 'packageManager');
    expect(q.choices).toEqual([
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
    ]);
  });

  it('projectName validates empty string', async () => {
    const questions = await getQuestions();
    const q = questions.find(q => q.name === 'projectName');
    expect(q.validate('  ')).toBe('Project name cannot be empty.');
    expect(q.validate('my-app')).toBe(true);
  });
});
