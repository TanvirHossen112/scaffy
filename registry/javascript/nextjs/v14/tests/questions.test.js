import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../../../../core/detector.js', () => ({
  detectAvailableChoices: jest.fn().mockResolvedValue([
    { name: 'npm', value: 'npm', checkCommand: 'npm --version' },
    { name: 'yarn', value: 'yarn', checkCommand: 'yarn --version' },
  ]),
}));

describe('NextJS v14 questions', () => {
  let questions;

  beforeEach(async () => {
    const mod = await import('../questions.js');
    questions = await mod.default();
  });

  it('returns an array', () => {
    expect(Array.isArray(questions)).toBe(true);
  });

  it('has exactly 5 questions', () => {
    expect(questions).toHaveLength(5);
  });

  // ─── packageManager ────────────────────────────────────

  describe('packageManager question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'packageManager');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a list type', () => {
      expect(question.type).toBe('list');
    });

    it('uses available managers from detectAvailableChoices', () => {
      expect(question.choices).toHaveLength(2);
      expect(question.choices[0].value).toBe('npm');
    });
  });

  // ─── typescript ────────────────────────────────────────

  describe('typescript question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'typescript');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a confirm type', () => {
      expect(question.type).toBe('confirm');
    });

    it('defaults to true', () => {
      expect(question.default).toBe(true);
    });
  });

  // ─── tailwind ──────────────────────────────────────────

  describe('tailwind question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'tailwind');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a confirm type', () => {
      expect(question.type).toBe('confirm');
    });

    it('defaults to true', () => {
      expect(question.default).toBe(true);
    });
  });

  // ─── appRouter ─────────────────────────────────────────

  describe('appRouter question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'appRouter');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a confirm type', () => {
      expect(question.type).toBe('confirm');
    });

    it('defaults to true', () => {
      expect(question.default).toBe(true);
    });
  });

  // ─── srcDir ────────────────────────────────────────────

  describe('srcDir question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'srcDir');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a confirm type', () => {
      expect(question.type).toBe('confirm');
    });

    it('defaults to false', () => {
      expect(question.default).toBe(false);
    });
  });
});
