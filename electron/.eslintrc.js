const environment = { browser: true, es6: true, node: true };

const extenders = [
  "eslint:recommended",
  "plugin:react/recommended",
  "plugin:eslint-comments/recommended",
  "plugin:promise/recommended",
  "plugin:unicorn/recommended",
  "prettier",
  "prettier",
  "prettier/react",
];

const rules = {
  "eslint-comments/no-unlimited-disable": "off",
  "import/no-default-export": "off",
  "import/prefer-default-export": "off",
  "jsx-a11y/alt-text": "off",
  "jsx-a11y/anchor-is-valid": "off",
  "jsx-a11y/click-events-have-key-events": "off",
  "jsx-a11y/control-has-associated-label": "off",
  "jsx-a11y/media-has-caption": "off",
  "jsx-a11y/mouse-events-have-key-events": "off",
  "jsx-a11y/no-static-element-interactions": "off",
  "max-len": "off",
  "no-nested-ternary": "off",
  "no-prototype-builtins": "off",
  "object-curly-newline": "off",
  "react/button-has-type": "off",
  "react/destructuring-assignment": "off",
  "react/jsx-filename-extension": "off",
  "unicorn/no-abusive-eslint-disable": "off",
  "unicorn/prefer-query-selector": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/prefer-add-event-listener": "off",
  "unicorn/no-nested-ternary": "off",
  "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
};

module.exports = {
  env: environment,
  extends: [...extenders],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "eslint-comments", "promise", "unicorn"],
  rules: { ...rules },
  // TYPESCRIPT OVERRIDES
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      env: environment,
      extends: [
        ...extenders,
        "plugin:@typescript-eslint/eslint-recommended",
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      plugins: ["react", "@typescript-eslint"],
      rules: {
        ...rules,
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false, classes: true, variables: true, typedefs: true },
        ],
      },
      settings: { react: { version: "detect" } },
    },
  ],
};
