import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import stylistic from "@stylistic/eslint-plugin";



/** @type {import("eslint").Linter.FlatConfig} */
const importConfig = {
  rules: {
    // Import Rules
    "import/consistent-type-specifier-style": [ "error", "prefer-top-level" ],
    "import/first": [ "error" ],
    "import/newline-after-import": [ "warn", { count: 3 } ],
    "import/no-absolute-path": [ "error" ],
    "import/no-mutable-exports": [ "error" ],
    "import/no-useless-path-segments": [ "error" ],
    "import/order": [
      "error", {
        "groups": [
          "builtin",
          "external",
        ],
        "newlines-between": "always",
        "alphabetize": {
          order: "asc",
          orderImportKind: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

/** @type {import("eslint").Linter.FlatConfig} */
const vueConfig = {
  rules: {
    "vue/html-indent": [ "error", 2 ],
  },
};

/** @type {import("eslint").Linter.FlatConfig} */
const tsConfig = {
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
};



export default createConfigForNuxt(
)
  .append(
    [
    // Stylistic Rules.
      stylistic.configs.customize(
        {
          flat: true,
          arrowParens: true,
          indent: 2,
          quotes: "double",
          semi: true,
          quoteProps: "consistent-as-needed",
          braceStyle: "1tbs",
          blockSpacing: true,
          jsx: true,
        },
      ),
      {
        rules: {
          "@stylistic/array-bracket-spacing": [ "error", "always" ],
          "@stylistic/jsx-one-expression-per-line": "off",
          "@stylistic/keyword-spacing": [
            "error", {
              overrides: {
                catch: { after: false },
                for: { after: false },
                if: { after: false },
                while: { after: false },
              },
            },
          ],
          "@stylistic/key-spacing": [
            "warn", {
              mode: "minimum",
            },
          ],
          "@stylistic/no-multiple-empty-lines": [
            "warn", {
              max: 5,
              maxEOF: 1,
            },
          ],
          "@stylistic/no-multi-spaces": [ "off" ],
          "@stylistic/array-element-newline": [
            "warn",
            { ArrayExpression: "consistent" },
          ],
          "@stylistic/newline-per-chained-call": [ "warn" ],
          "@stylistic/padding-line-between-statements": [
            "error",
            {
              blankLine: "always",
              prev: [ "var", "const", "let" ],
              next: "return",
            },
          ],
          "@stylistic/object-curly-newline": [
            "warn",
            { multiline: true, consistent: true },
          ],
          "@stylistic/object-property-newline": [
            "warn",
            { allowAllPropertiesOnSameLine: true },
          ],
          "@stylistic/array-bracket-newline": [ "warn", { multiline: true } ],
          "@stylistic/jsx-first-prop-new-line": [ "warn", "multiline-multiprop" ],
          "@stylistic/jsx-closing-bracket-location": [ "warn", "tag-aligned" ],
          "@stylistic/function-paren-newline": [ "warn", "consistent" ],
        },
      },
      {
        ignores: [ "generated/graphql" ],
      },
    ],
  )
  .override(
    "nuxt/typescript/rules", tsConfig,
  )
  .override(
    "nuxt/vue/rules", vueConfig,
  )
  .override(
    "nuxt/import/rules", importConfig,
  );
