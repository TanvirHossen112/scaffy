import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Gin v1 questions', () => {
  let questions;

  beforeEach(async () => {
    const mod = await import('../questions.js');
    questions = mod.default;
  });

  it('exports an array', () => {
    expect(Array.isArray(questions)).toBe(true);
  });

  it('has exactly 2 questions', () => {
    expect(questions).toHaveLength(2);
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

    it('includes none, postgresql, mysql, sqlite', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('none');
      expect(values).toContain('postgresql');
      expect(values).toContain('mysql');
      expect(values).toContain('sqlite');
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
