import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Ported from https://github.com/MrRefactoring/jira.js/blob/master/eslint.config.ts
// and adapted to this pnpm monorepo: the @stylistic + typescript-eslint rule set
// is kept verbatim, while the project wiring (ignores, per-package tsconfigs,
// generated-client carve-outs) is repo-specific.
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
    // Type-aware rules need type information, so scope them to .ts files that
    // belong to a TS project. src + tests come from each package's
    // tsconfig.test.json; the root/vitest config files come from
    // tsconfig.eslint.json.
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json', './packages/*/tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      // Downgraded from jira.js's 'error': this codebase deliberately guards
      // against nullish runtime values the type system can't see — generated
      // OpenAPI clients type response bodies optimistically, and with
      // `noUncheckedIndexedAccess` off, `arr[0]` reads as non-undefined even
      // when it isn't. Treating every such guard as a build error would force
      // removing real safety checks; 'warn' keeps genuinely-dead code visible
      // without breaking CI. (Same spirit as `no-explicit-any: 'off'` below.)
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterOverload: true,
          exceptAfterSingleLine: true,
        },
      ],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/padding-line-between-statements': [
        'error',
        // Return statements
        { blankLine: 'always', prev: '*', next: 'return' },
        // Import statements
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
    },
  },
  {
    // Repo-specific overrides. Generated-style repetitive registration code (one
    // server.tool(...) call per capability) and the generated clients lean on
    // `any`; catch blocks routinely destructure an unused error.
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
