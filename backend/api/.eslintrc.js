module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'no-console': 0,
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs'],
        paths: ['node_modules/lib'],
      },
    },
  },
}
