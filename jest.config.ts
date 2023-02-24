export default async () => ({
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
});
