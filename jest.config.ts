import type { Config } from "jest";

const config: Config = {
	// Basic configuration
	clearMocks: true,
	preset: "ts-jest",

	// Coverage configuration
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/coverage/",
		"/.next/",
		"/dist/",
		"/build/",
		"/prisma/",
		"/public/",
		"generated",
		" (.*).d.ts",
		"jest.config.ts",
		"next.config.ts",
		"postcss.config.mjs",
		"tailwind.config.ts",
		"/src/test/helper/"
	],

	// Minimum coverage (100%)
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},

	// Module resolution
	moduleNameMapper: {
		"^@/di/(.*)$": "<rootDir>/di/$1",
		"^@/(.*)$": "<rootDir>/src/$1"
	},

	// Test setup
	setupFiles: ["<rootDir>/src/test/helper/setupEnv.ts"],

	// Test patterns
	testMatch: [
		"<rootDir>/src/**/*.test.ts",
		"<rootDir>/src/**/*.spec.ts",
		"<rootDir>/src/**/*.test.tsx",
		"<rootDir>/src/**/*.spec.tsx"
	],

	// Ignore patterns
	testPathIgnorePatterns: ["/node_modules/", "/.next/", "/coverage/", "/dist/", "/build/"],

	// Verbose output for CI
	verbose: process.env.CI === "true",

	detectOpenHandles: true,
	forceExit: true
};

export default config;
