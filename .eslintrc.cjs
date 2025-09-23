module.exports = {
  extends: [
    'mantine',
    'plugin:@next/next/recommended',
    'plugin:jest/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'react/jsx-boolean-value': 'off',
    'no-continue': 'off',
    'react/jsx-closing-tag-location': 'off',
    'linebreak-style': 'off',
    'no-plusplus': 'off',
  },
};
