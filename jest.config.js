export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {},
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'cli.js',
    'core/**/*.js',
    'registry/**/*.js',
    '!**/*.test.js',
    '!test-utils/**',
  ],
  coverageThreshold: {
    global: {
      branches: 68,
      functions: 70,
      lines: 67,
      statements: 66,
    },
  },
};
