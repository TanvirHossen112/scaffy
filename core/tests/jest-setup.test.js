describe('Jest Setup', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('Basic math works', () => {
    expect(2 + 3).toBe(5);
  });

  test('String operations work', () => {
    expect('scaffy').toContain('scaff');
  });

  test('Array operations work', () => {
    const frameworks = ['laravel', 'nestjs', 'vuejs'];
    expect(frameworks).toHaveLength(3);
    expect(frameworks).toContain('laravel');
  });

  test('Object operations work', () => {
    const plugin = {
      name: 'Laravel',
      language: 'php',
      version: 'v11',
    };
    expect(plugin).toHaveProperty('name', 'Laravel');
    expect(plugin).toHaveProperty('language', 'php');
  });
});
