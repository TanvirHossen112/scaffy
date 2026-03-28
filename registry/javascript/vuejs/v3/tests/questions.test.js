import questions from '../questions.js';

describe('VueJS v3 questions plugin', () => {
  test('returns expected question set', async () => {
    const result = await questions();
    expect(Array.isArray(result)).toBe(true);

    const projectNameQuestion = result.find(q => q.name === 'projectName');
    expect(projectNameQuestion).toBeDefined();
    expect(projectNameQuestion.default).toBe('my-vue-app');

    const packageManagerQuestion = result.find(
      q => q.name === 'packageManager'
    );
    expect(packageManagerQuestion).toBeDefined();
    expect(Array.isArray(packageManagerQuestion.choices)).toBe(true);
    expect(packageManagerQuestion.choices.length).toBeGreaterThan(0);
  });
});
