module.exports = {
  env: {
    browser: true,
    node: false
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'import/no-unresolved': ['error', {ignore: ['^react$', '.*:.*']}],
    'react/display-name': 0,
    'no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true
      }
    ]
  },
  settings: {
    'import/ignore': ['.*node_modules.*', '.*:.*'],
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  plugins: []
}
