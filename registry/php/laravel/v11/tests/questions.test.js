import questions from '../questions.js';

describe('Laravel v11 questions plugin', () => {
  test('returns expected question set', () => {
    expect(Array.isArray(questions)).toBe(true);

    const projectNameQuestion = questions.find(q => q.name === 'projectName');
    expect(projectNameQuestion).toBeDefined();
    expect(projectNameQuestion.default).toBe('my-laravel-app');

    const starterKitQuestion = questions.find(q => q.name === 'starterKit');
    expect(starterKitQuestion).toBeDefined();
    expect(Array.isArray(starterKitQuestion.choices)).toBe(true);
    expect(starterKitQuestion.choices.length).toBe(3);
    expect(starterKitQuestion.default).toBe('none');

    const databaseQuestion = questions.find(q => q.name === 'database');
    expect(databaseQuestion).toBeDefined();
    expect(Array.isArray(databaseQuestion.choices)).toBe(true);
    expect(databaseQuestion.default).toBe('sqlite');

    const dockerQuestion = questions.find(q => q.name === 'docker');
    expect(dockerQuestion).toBeDefined();
    expect(dockerQuestion.type).toBe('confirm');
    expect(dockerQuestion.default).toBe(false);
  });

  test('project name validator rejects empty input', () => {
    const projectNameQuestion = questions.find(q => q.name === 'projectName');
    expect(projectNameQuestion.validate('   ')).toBe(
      'Project name is required'
    );
  });

  test('project name validator rejects invalid characters', () => {
    const projectNameQuestion = questions.find(q => q.name === 'projectName');
    const result = projectNameQuestion.validate('MyProject');
    expect(typeof result).toBe('string');
    expect(result).toContain('lowercase');
  });

  test('project name validator accepts valid names', () => {
    const projectNameQuestion = questions.find(q => q.name === 'projectName');
    expect(projectNameQuestion.validate('my-laravel-app')).toBe(true);
    expect(projectNameQuestion.validate('my_laravel_app')).toBe(true);
    expect(projectNameQuestion.validate('mylaravelapp123')).toBe(true);
  });
});
