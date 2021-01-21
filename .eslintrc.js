module.exports = {
  env: {
    browser: true,
    node: false
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-unresolved': ['error', {ignore: ['^react$', '.*:.*']}],
    'react/display-name': 0,
    'no-unused-vars': 'off'
  },
  settings: {
    'import/ignore': ['.*node_modules.*', '.*:.*'],
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
}
