import { jest } from '@jest/globals';

// Import the questions module
const questions = (await import('../questions.js')).default;

describe('NestJS v11 Questions', () => {
  // ─── Main Function ────────────────────────────────────
  describe('default export', () => {
    test('should be an async function', async () => {
      expect(typeof questions).toBe('function');
      expect(questions.constructor.name).toBe('AsyncFunction');
    });

    test('should return an array of questions', async () => {
      const result = await questions();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return 5 questions', async () => {
      const result = await questions();
      expect(result).toHaveLength(5);
    });

    test('should have all required question names', async () => {
      const result = await questions();
      const names = result.map(q => q.name);
      expect(names).toContain('projectName');
      expect(names).toContain('packageManager');
      expect(names).toContain('database');
      expect(names).toContain('auth');
      expect(names).toContain('docker');
    });
  });

  // ─── Project Name Question ────────────────────────────
  describe('projectName question', () => {
    let projectNameQuestion;

    beforeEach(async () => {
      const result = await questions();
      projectNameQuestion = result.find(q => q.name === 'projectName');
    });

    test('should exist', () => {
      expect(projectNameQuestion).toBeDefined();
    });

    test('should have correct type', () => {
      expect(projectNameQuestion.type).toBe('input');
    });

    test('should have correct message', () => {
      expect(projectNameQuestion.message).toBe('Project name:');
    });

    test('should have correct default', () => {
      expect(projectNameQuestion.default).toBe('my-nest-app');
    });

    test('should have a validate function', () => {
      expect(typeof projectNameQuestion.validate).toBe('function');
    });

    // ─── Validation Tests
    describe('validation', () => {
      test('should reject empty input', () => {
        const result = projectNameQuestion.validate('');
        expect(result).toBe('Project name is required');
      });

      test('should reject whitespace-only input', () => {
        const result = projectNameQuestion.validate('   ');
        expect(result).toBe('Project name is required');
      });

      test('should reject uppercase letters', () => {
        const result = projectNameQuestion.validate('MyProject');
        expect(result).toContain('lowercase');
      });

      test('should reject spaces', () => {
        const result = projectNameQuestion.validate('my project');
        expect(typeof result).toBe('string');
        expect(result).not.toBe(true);
      });

      test('should reject special characters', () => {
        const result = projectNameQuestion.validate('my@project');
        expect(typeof result).toBe('string');
        expect(result).not.toBe(true);
      });

      test('should accept valid lowercase names', () => {
        expect(projectNameQuestion.validate('my-nest-app')).toBe(true);
        expect(projectNameQuestion.validate('mynestapp')).toBe(true);
      });

      test('should accept names with hyphens', () => {
        expect(projectNameQuestion.validate('my-project-name')).toBe(true);
      });

      test('should accept names with underscores', () => {
        expect(projectNameQuestion.validate('my_project_name')).toBe(true);
      });

      test('should accept names with numbers', () => {
        expect(projectNameQuestion.validate('my-project-123')).toBe(true);
      });

      test('should accept mixed valid characters', () => {
        expect(projectNameQuestion.validate('my_project-123')).toBe(true);
      });
    });
  });

  // ─── Package Manager Question ──────────────────────────
  describe('packageManager question', () => {
    let packageManagerQuestion;

    beforeEach(async () => {
      const result = await questions();
      packageManagerQuestion = result.find(q => q.name === 'packageManager');
    });

    test('should exist', () => {
      expect(packageManagerQuestion).toBeDefined();
    });

    test('should have correct type', () => {
      expect(packageManagerQuestion.type).toBe('list');
    });

    test('should have correct message from plugin metadata', () => {
      expect(packageManagerQuestion.message).toBe('Package manager:');
    });

    test('should have available managers as choices', () => {
      expect(packageManagerQuestion.choices).toBeDefined();
      expect(Array.isArray(packageManagerQuestion.choices)).toBe(true);
      expect(packageManagerQuestion.choices.length).toBeGreaterThan(0);
    });

    test('should have each choice with name and value properties', () => {
      packageManagerQuestion.choices.forEach(choice => {
        expect(choice).toHaveProperty('name');
        expect(choice).toHaveProperty('value');
        expect(typeof choice.name).toBe('string');
        expect(typeof choice.value).toBe('string');
      });
    });

    test('should have a valid default value', () => {
      expect(packageManagerQuestion.default).toBeDefined();
      expect(typeof packageManagerQuestion.default).toBe('string');
    });

    test('default should be one of the available choices', () => {
      const defaultValue = packageManagerQuestion.default;
      const choiceValues = packageManagerQuestion.choices.map(c => c.value);
      expect(choiceValues).toContain(defaultValue);
    });
  });

  // ─── Database Question ────────────────────────────────
  describe('database question', () => {
    let databaseQuestion;

    beforeEach(async () => {
      const result = await questions();
      databaseQuestion = result.find(q => q.name === 'database');
    });

    test('should exist', () => {
      expect(databaseQuestion).toBeDefined();
    });

    test('should have correct type', () => {
      expect(databaseQuestion.type).toBe('list');
    });

    test('should have correct message', () => {
      expect(databaseQuestion.message).toBe('Database:');
    });

    test('should have correct default', () => {
      expect(databaseQuestion.default).toBe('none');
    });

    test('should have 5 choices', () => {
      expect(databaseQuestion.choices).toHaveLength(5);
    });

    test('should include None option', () => {
      const noneOption = databaseQuestion.choices.find(c => c.value === 'none');
      expect(noneOption).toEqual({ name: 'None', value: 'none' });
    });

    test('should include PostgreSQL option', () => {
      const pgOption = databaseQuestion.choices.find(
        c => c.value === 'postgres'
      );
      expect(pgOption).toEqual({
        name: 'PostgreSQL (TypeORM)',
        value: 'postgres',
      });
    });

    test('should include MySQL option', () => {
      const mysqlOption = databaseQuestion.choices.find(
        c => c.value === 'mysql'
      );
      expect(mysqlOption).toEqual({ name: 'MySQL (TypeORM)', value: 'mysql' });
    });

    test('should include MongoDB option', () => {
      const mongoOption = databaseQuestion.choices.find(
        c => c.value === 'mongodb'
      );
      expect(mongoOption).toEqual({
        name: 'MongoDB (Mongoose)',
        value: 'mongodb',
      });
    });

    test('should include SQLite option', () => {
      const sqliteOption = databaseQuestion.choices.find(
        c => c.value === 'sqlite'
      );
      expect(sqliteOption).toEqual({
        name: 'SQLite (TypeORM)',
        value: 'sqlite',
      });
    });

    test('should have all unique values', () => {
      const values = databaseQuestion.choices.map(c => c.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  // ─── Authentication Question ──────────────────────────
  describe('auth question', () => {
    let authQuestion;

    beforeEach(async () => {
      const result = await questions();
      authQuestion = result.find(q => q.name === 'auth');
    });

    test('should exist', () => {
      expect(authQuestion).toBeDefined();
    });

    test('should have correct type', () => {
      expect(authQuestion.type).toBe('confirm');
    });

    test('should have correct message', () => {
      expect(authQuestion.message).toBe('Add JWT authentication (Passport)?');
    });

    test('should have false as default', () => {
      expect(authQuestion.default).toBe(false);
    });
  });

  // ─── Docker Question ──────────────────────────────────
  describe('docker question', () => {
    let dockerQuestion;

    beforeEach(async () => {
      const result = await questions();
      dockerQuestion = result.find(q => q.name === 'docker');
    });

    test('should exist', () => {
      expect(dockerQuestion).toBeDefined();
    });

    test('should have correct type', () => {
      expect(dockerQuestion.type).toBe('confirm');
    });

    test('should have correct message', () => {
      expect(dockerQuestion.message).toBe('Add Dockerfile?');
    });

    test('should have false as default', () => {
      expect(dockerQuestion.default).toBe(false);
    });
  });

  // ─── Question Order ───────────────────────────────────
  describe('question order', () => {
    test('should have projectName first', async () => {
      const result = await questions();
      expect(result[0].name).toBe('projectName');
    });

    test('should have packageManager second', async () => {
      const result = await questions();
      expect(result[1].name).toBe('packageManager');
    });

    test('should have database third', async () => {
      const result = await questions();
      expect(result[2].name).toBe('database');
    });

    test('should have auth fourth', async () => {
      const result = await questions();
      expect(result[3].name).toBe('auth');
    });

    test('should have docker fifth', async () => {
      const result = await questions();
      expect(result[4].name).toBe('docker');
    });
  });

  // ─── Edge Cases ────────────────────────────────────────
  describe('edge cases', () => {
    test('should return consistent results on multiple calls', async () => {
      const result1 = await questions();
      const result2 = await questions();

      // Check structure is the same
      expect(result1.length).toBe(result2.length);
      expect(result1.map(q => q.name)).toEqual(result2.map(q => q.name));
    });

    test('should return fresh array each call (not cached)', async () => {
      const result1 = await questions();
      const result2 = await questions();

      // Arrays should be different objects
      expect(result1).not.toBe(result2);
    });

    test('all questions should have required properties', async () => {
      const result = await questions();
      result.forEach(question => {
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('name');
        expect(question).toHaveProperty('message');
      });
    });

    test('list questions should have choices', async () => {
      const result = await questions();
      const listQuestions = result.filter(q => q.type === 'list');
      listQuestions.forEach(q => {
        expect(q).toHaveProperty('choices');
        expect(Array.isArray(q.choices)).toBe(true);
      });
    });

    test('confirm questions should have default of false or true', async () => {
      const result = await questions();
      const confirmQuestions = result.filter(q => q.type === 'confirm');
      confirmQuestions.forEach(q => {
        expect(typeof q.default).toBe('boolean');
      });
    });
  });
});
