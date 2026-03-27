import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../../../../../core/detector.js', () => ({
  detectAvailableChoices: jest.fn().mockResolvedValue([
    { name: 'npm', value: 'npm', checkCommand: 'npm --version' },
    { name: 'yarn', value: 'yarn', checkCommand: 'yarn --version' },
  ]),
}));

describe('ExpressJS v4 questions', () => {
  let questions;

  beforeEach(async () => {
    const mod = await import('../questions.js');
    questions = await mod.default();
  });

  it('returns an array', () => {
    expect(Array.isArray(questions)).toBe(true);
  });

  it('has exactly 4 questions', () => {
    expect(questions).toHaveLength(4);
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

    it('defaults to false', () => {
      expect(question.default).toBe(false);
    });
  });

  // ─── database ──────────────────────────────────────────

  describe('database question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'database');
    });

    it('exists', () => {
      expect(question).toBeDefined();
    });

    it('is a list type', () => {
      expect(question.type).toBe('list');
    });

    it('has 4 choices', () => {
      expect(question.choices).toHaveLength(4);
    });

    it('includes none, mongodb, postgresql, mysql', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('none');
      expect(values).toContain('mongodb');
      expect(values).toContain('postgresql');
      expect(values).toContain('mysql');
    });
  });

  // ─── docker ────────────────────────────────────────────

  describe('docker question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'docker');
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
