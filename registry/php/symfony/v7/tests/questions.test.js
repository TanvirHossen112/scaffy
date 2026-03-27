import { describe, it, expect } from '@jest/globals';

describe('Symfony v7 questions', () => {
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

  // ─── projectType ───────────────────────────────────────

  describe('projectType question', () => {
    let question;

    beforeEach(() => {
      question = questions.find(q => q.name === 'projectType');
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

    it('has webapp choice', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('webapp');
    });

    it('has api choice', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('api');
    });

    it('has microservice choice', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('microservice');
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

    it('includes mysql, postgresql, sqlite, none', () => {
      const values = question.choices.map(c => c.value);
      expect(values).toContain('mysql');
      expect(values).toContain('postgresql');
      expect(values).toContain('sqlite');
      expect(values).toContain('none');
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
