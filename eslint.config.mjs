import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "no-console": 1,
            "no-extra-boolean-cast": 0,
            "no-lonely-if": 1,
            "no-trailing-spaces": 1,
            "no-multi-spaces": 1,
            "no-multiple-empty-lines": 1,
            "space-before-blocks": ["error", "always"],
            "object-curly-spacing": [1, "always"],
            indent: ["warn", 4],
            semi: [1, "always"],
            quotes: ["error", "double"],
            "array-bracket-spacing": 1,
            "linebreak-style": 0,
            "no-unexpected-multiline": "warn",
            "keyword-spacing": 1,
            "comma-dangle": ["error", "always-multiline"],
            "comma-spacing": 1,
            "arrow-spacing": 1,
        },
        ignores: ["**/node_modules/**/*", "**/dist/**/*", "build/**/*"],
    },
];
