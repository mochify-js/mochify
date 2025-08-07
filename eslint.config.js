'use strict';

const studio_eslint_config = require('@studio/eslint-config').default;

module.exports = [
  ...studio_eslint_config,
  {
    files: ['test/**/*.js', '**/*.test.js', '**/*.integration.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    }
  }
];
