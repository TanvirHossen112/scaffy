import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Django v5 questions', () => {
  let questions;

  beforeEach(async () => {
    const mod = await import('../questions.js');
    questions = mod.default;
  });

  it('exports an array', () => {
    expect(Array.isArray(questions)).toBe(true);
  });

  it('has exactly 3 questions', () => {
    expect(questions).toHaveLength(3);
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

    it('has 3 choices', () => {
      expect(question.choices).toHaveLength(3);
    });

    it('includes sqlite, postgresql, mysql', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('sqlite');
      expect(values).toContain('postgresql');
      expect(values).toContain('mysql');
    });
  });

  // ─── restFramework ─────────────────────────────────────

  describe('restFramework question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'restFramework');
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
