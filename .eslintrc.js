module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint"
  ],
  extends:  [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    project: "./tsconfig.json"
  },
  env: { node: true, es6: true },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": false,
    "no-unused-vars": false,
    "noUnusedLocals": false
  },
};