module.exports = {
  env: {
    browser: true,
    node: false
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'sanity/react', // must come before sanity/typescript
    'sanity/typescript',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [
    {
      files: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'vitest.setup.ts',
        'vitest.config.ts',
        'src/__tests__/**/*.ts',
        'src/__tests__/**/*.tsx'
      ],
      env: {
        node: true
      },
      globals: {
        afterEach: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        globalThis: 'readonly',
        it: 'readonly',
        test: 'readonly',
        vi: 'readonly'
      }
    }
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-shadow': 'off',
    'react/display-name': 0,
    'react/jsx-no-bind': 0,
    'no-use-before-define': 0
  }
}
