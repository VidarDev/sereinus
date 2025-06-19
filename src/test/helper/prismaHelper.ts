import { execSync } from "child_process";
import dotenv from "dotenv";
import { getInjection } from "../../../di/container";

dotenv.config({ path: ".env.test" });

export const setupTestDatabase = async () => {
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
				datetime: new Date(2025, 0, 1, 0, 0, 0)
			},
			{
				userId: "1",
				datetime: new Date(2025, 0, 2, 0, 0, 0)
			}
		]
	});
};

export const teardownTestDatabase = () => {
	getInjection("PrismaClient").$disconnect();
};
