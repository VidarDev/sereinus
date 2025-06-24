import type { Config } from "jest";

const config: Config = {
	projects: [
		{
			displayName: "integration",
			testMatch: [
				"<rootDir>/src/test/presentation/controller/**/*.test.ts",
				"<rootDir>/src/test/infrastructure/**/*.test.ts"
			],
			maxWorkers: 1,
			preset: "ts-jest",
			moduleNameMapper: {
				"^@/di/(.*)$": "<rootDir>/di/$1",
				"^@/(.*)$": "<rootDir>/src/$1"
			},
			setupFiles: ["<rootDir>/src/test/helper/setupEnv.ts"],
			clearMocks: true
		},
		{
			displayName: "unit",
			testPathIgnorePatterns: [
				"<rootDir>/src/test/presentation/controller/.*\\.test\\.ts$",
				"<rootDir>/src/test/infrastructure/.*\\.test\\.ts$"
			],
			preset: "ts-jest",
			moduleNameMapper: {
				"^@/di/(.*)$": "<rootDir>/di/$1",
				"^@/(.*)$": "<rootDir>/src/$1"
			},
			clearMocks: true
		}
	],

	// Ignore patterns
	testPathIgnorePatterns: ["/node_modules/", "/.next/", "/coverage/", "/dist/", "/build/"],

	// Verbose output for CI
	verbose: process.env.CI === "true",

	detectOpenHandles: true,
	forceExit: true
};

export default config;
