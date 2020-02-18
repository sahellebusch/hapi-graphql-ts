module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2018,
    tsconfigRootDir: './'
  },
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 100,
        arrowParens: 'avoid',
        bracketSpacing: false
      }
    ],

    // '@typescript-eslint/interface-name-prefix': 'error',
    //   '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    //   '@typescript-eslint/explicit-function-return-type': [
    //     'warn',
    //     {
    //       allowExpressions: true // lambdas are inferable plus it's annoying to type out ALL of them
    //     }
    //   ]
  }
};
