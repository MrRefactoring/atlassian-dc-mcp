// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    // Generated OpenAPI clients are committed output, not hand-written code —
    // see CLAUDE.md: "Treat files here as generated output". Worktrees created
    // by parallel background agents live under the repo root too; never lint
    // another branch's checkout.
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/*-client/**',
      '.worktrees/**',
      '.claude/worktrees/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Plain Node scripts (bin/ launchers, root-level debug/sync scripts) —
    // typescript-eslint's config only recognizes Node globals for .ts files
    // (it defers to tsc for those), so .js files need them declared explicitly.
    files: ['**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    rules: {
      // Generated-style repetitive registration code (one server.tool(...) call
      // per capability) and test fixtures intentionally reuse similar shapes;
      // an unused-vars false positive on a destructured-but-unused error is
      // common in catch blocks across the api-error-handler tests.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
