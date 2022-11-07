module.exports = {
  env: {
    browser: true,
    node: false
  },
  extends: [
    'sanity',
    'sanity/typescript',
    'sanity/react',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      files: ['*.{ts,tsx}']
    }
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
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
    'react/jsx-no-bind': 0
  },
  settings: {
    'import/ignore': ['.*node_modules.*', '.*:.*'],
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
}
