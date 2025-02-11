process.env.MONGO_MEMORY_SERVER_FILE = './jest-backend/jest-mongodb-config.js';

module.exports = {
  preset: '@shelf/jest-mongodb',
  roots: ['<rootDir>'],
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|ts)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testRegex: '/backend/.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'jsx', 'json', 'node'],
  // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  setupFilesAfterEnv: ['<rootDir>/jest-backend/jest.setup.ts'],
  globalSetup: '<rootDir>/jest-backend/jest.global.setup.ts',
  globalTeardown: '<rootDir>/jest-backend/jest.global.teardown.ts',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/enums',
    'src/graphql',
    'src/types',
    'src/constants',
  ],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/src/$1',
  },
};
