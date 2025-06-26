import type { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { Client } from "pg";

import { appContainer } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

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

	const prisma = appContainer.get<PrismaClient>(DI_SYMBOLS.PrismaClient);
	await prisma.crisis.createMany({
		data: [
			{
				id: "crisis-1",
				userId: "1",
				datetime: new Date(2025, 0, 1, 0, 0, 0),
				duration: 45,
				note: "First crisis",
				protocolId: null,
				protocolName: null,
				cycleCount: null,
				efficiency: null,
				averageCycleTime: null
			},
			{
				id: "crisis-2",
				userId: "1",
				duration: 45,
				datetime: new Date(2025, 0, 2, 0, 0, 0),
				note: null,
				protocolId: null,
				protocolName: null,
				cycleCount: null,
				efficiency: null,
				averageCycleTime: null
			},
			{
				id: "breathing-session-1",
				userId: "1",
				datetime: new Date(2025, 0, 3, 0, 0, 0),
				duration: 300,
				note: "Session de respiration test",
				protocolId: "box-breathing",
				protocolName: "Box Breathing",
				cycleCount: 10,
				efficiency: 85.5,
				averageCycleTime: 30000
			}
		]
	});
};

export const teardownTestDatabase = async () => {
	const prisma = appContainer.get<PrismaClient>(DI_SYMBOLS.PrismaClient);
	await prisma.$disconnect();
};
