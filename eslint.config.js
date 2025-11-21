import js from '@eslint/js'
import ts from 'typescript-eslint'
import next from 'eslint-config-next'

export default [
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'build/', 'out/']
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    rules: {
      'react-hooks/rules-of-hooks': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@next/next/no-html-link-for-pages': 'off'
    }
  }
]
