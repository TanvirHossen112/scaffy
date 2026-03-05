export default {
  // Test environment
  testEnvironment: 'node',

  // Where to find tests
  testMatch: ['**/tests/**/*.test.js', '**/*.test.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'core/**/*.js',
    'registry/**/*.js',
    '!registry/**/tests/**',
    '!**/*.gitkeep',
    '!**/node_modules/**',
  ],

  // Minimum coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
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
