import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from '@eslint-react/eslint-plugin'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      ...reactPlugin.configs.recommended.plugins,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
]
