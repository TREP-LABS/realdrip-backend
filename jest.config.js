module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
<<<<<<< HEAD
  // An array of glob patterns indicating a set of files for which coverage information
  // should be collected
=======
  // An array of glob patterns indicating a set of files for which coverage information should be collected
>>>>>>> FIX jest configuration
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
  ],
  // The directory where Jest should output its coverage files
<<<<<<< HEAD
  coverageDirectory: 'coverage',
=======
  coverageDirectory: "coverage",
>>>>>>> FIX jest configuration
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],
  // The test environment that will be used for testing
<<<<<<< HEAD
  testEnvironment: 'node',
=======
  testEnvironment: "node",
>>>>>>> FIX jest configuration
};
