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
