import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const eslintConfig = [
	pluginJs.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: {
				...globals
			},
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaFeatures: { jsx: true },
				project: "tsconfig.json",
				sourceType: "module"
			}
		}
	},
	// Typescript
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	// Next
	...compat.extends("next/core-web-vitals"),
	// Simple Import Sort
	{
		plugins: {
			"simple-import-sort": simpleImportSort
		},
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error"
		}
	},
	// Prettier
	{
		rules: {
			...prettier.rules,
			"import/no-anonymous-default-export": "off"
		}
	},
	// Ignore files
	{
		ignores: [
			"zod",
			"next-env.d.ts",
			".next",
			".vercel",
			".vscode",
			"**/worker.js",
			"node_modules",
			"dist",
			"build",
			"coverage",
			"src/generated"
		]
	}
];

export default eslintConfig;
