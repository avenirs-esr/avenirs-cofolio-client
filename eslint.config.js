import antfu from '@antfu/eslint-config'
import autoImportConfig from "./auto-import-config.json" with { type: 'json' };

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    '**/README.md',
    '.vscode/',
    'eslint.config.js'
  ],
}, {
  rules: {
    'no-duplicate-imports': 'error',
    'no-irregular-whitespace': 'warn',
    'vue/no-irregular-whitespace': 'warn',
    'style/space-before-function-paren': ['error', 'always'],
    'curly': ['error', 'all'],
    'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'style/spaced-comment': [
      'error',
      'always',
      {
        markers: [
          '#region',
          '#endregion',
          '/',
        ],
      },
    ],
    'style/comma-dangle': 'off',
    'no-restricted-imports': ['error', {
      paths: [],
      patterns: [{
        group: ['vue'],
        importNames: autoImportConfig.vue,
        message: 'This Vue API is auto-imported by unplugin-auto-import. Remove the explicit import.'
      }]
    }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'function', next: 'function' },
      { blankLine: 'always', prev: 'class', next: 'class' },
      { blankLine: 'always', prev: 'return', next: 'return' },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

  },
})
