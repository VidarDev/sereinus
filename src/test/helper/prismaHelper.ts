import { execSync } from "child_process";
import { getInjection } from "../../../di/container";
import { Client } from "pg";

const waitForPostgres = async (retries = 10, delay = 250) => {
	for (let i = 0; i < retries; i++) {
		try {
			const client = new Client({ connectionString: process.env.DATABASE_URL });
			await client.connect();
			await client.end();

			return;
		} catch (err) {
			await new Promise((res) => setTimeout(res, delay));
		}
	}

	throw new Error("❌ Could not connect to Postgres in time.");
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

	await getInjection("PrismaClient").crisis.createMany({
		data: [
			{
				userId: "1",
				datetime: new Date(2025, 0, 1, 0, 0, 0),
				note: "First crisis"
			},
			{
				userId: "1",
				datetime: new Date(2025, 0, 2, 0, 0, 0)
			}
		]
	});
};

export const teardownTestDatabase = async () => {
	await getInjection("PrismaClient").$disconnect();
};
