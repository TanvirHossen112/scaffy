module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Where to find tests
  testMatch: ['**/tests/**/*.test.js', '**/*.test.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'core/**/*.js',
    'registry/**/*.js',
    '!core/executor.js',
    '!core/utils.js',
    '!core/plugin-validator.js',
    '!registry/**/questions.js',
    '!registry/**/scaffold.js',
    '!registry/**/tests/**',
    '!**/*.gitkeep',
    '!**/node_modules/**',
  ],

  // Minimum coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Coverage output
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],

  // Show verbose output
  verbose: true,
};
