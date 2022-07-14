module.exports = {
  extends: ['@owner/eslint-config/es6', '@owner/eslint-config/typescript'],
  settings: {
    // I hate this, but this is what's required to match only the root level
    // packages folder (otherwise matches src/packages)
    'import/external-module-folders': ['node_modules', 'olympus/packages'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        ecmaVersion: 2020,
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        sourceType: 'module',
      },
    },
  ],
}
