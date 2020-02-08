module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  reporters: ['default', 'jest-junit'],
  forceExit: true,
  testMatch: ['**/test/**/!(lib)/*.[jt]s?(x)'],
  coveragePathIgnorePatterns: [
    'node_modules'
  ],
};
