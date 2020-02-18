module.exports = {
  collectCoverageFrom: [
    'test/*.ts',
  ],
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  moduleNameMapper: {
    '@plugnet/plug-api-types': '<rootDir>/types/index.ts',
  },
  testRegex: [
    '.*.e2e.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
      tsConfig: 'tsconfig.json',
    },
  },
  preset: 'ts-jest',
  testMatch: null,
}
