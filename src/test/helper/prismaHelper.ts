import type { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { Client } from "pg";

import { getInjection } from "@/di/container";

const waitForPostgres = async (retries = 10, delay = 250) => {
	for (let i = 0; i < retries; i++) {
		try {
			const client = new Client({ connectionString: process.env.DATABASE_URL });
			await client.connect();
			await client.end();

			return;
		} catch {
			console.error("Retrying...");
			await new Promise((res) => setTimeout(res, delay));
		}
	}

	throw new Error("[ERROR] Could not connect to Postgres in time.");
};

export const setupTestDatabase = async () => {
	await waitForPostgres();

	execSync("npx prisma db push --force-reset --skip-generate", {
		env: {
			...process.env,
			DATABASE_URL: process.env.DATABASE_URL
		},
		stdio: "inherit"
	});

	const prisma = getInjection("PrismaClient") as PrismaClient;
	await prisma.crisis.createMany({
		data: [
			{
				userId: "1",
				datetime: new Date(2025, 0, 1, 0, 0, 0),
				duration: 45,
				note: "First crisis"
			},
			{
				userId: "1",
				duration: 45,
				datetime: new Date(2025, 0, 2, 0, 0, 0)
			}
		]
	});
};

export const teardownTestDatabase = async () => {
	const prisma = getInjection("PrismaClient") as PrismaClient;
	await prisma.$disconnect();
};
