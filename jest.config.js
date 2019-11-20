module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information
  // should be collected
  collectCoverageFrom: [
    '!**/src/tests/**',
    '!**/src/utils/validateEnvironmentVars.js',
    '**/src/**/*.{js,jsx}',
    '!**/http/start.js',
    '!**.test.js',
    '!**/node_modules/**',
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // The test environment that will be used for testing
  testEnvironment: 'node',
  globalSetup: './src/tests/setup.js',
  globalTeardown: './src/tests/teardown.js',
};
