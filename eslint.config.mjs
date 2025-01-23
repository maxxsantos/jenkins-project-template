import globals from 'globals';
import pluginJs from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierRules from 'eslint-config-prettier'; // Importa as regras do Prettier diretamente
import tseslint from '@typescript-eslint/eslint-plugin'; // Pacote com as regras recomendadas do TypeScript

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: typescriptParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierRules.rules, // Aplicando as regras do Prettier diretamente
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Regras recomendadas para JS
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      ...tseslint.configs.recommended.rules, // Regras recomendadas para TypeScript
    },
  },
];
