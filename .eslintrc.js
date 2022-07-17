module.exports = {
  extends: ['bkpk/es6', 'bkpk/typescript'],
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
