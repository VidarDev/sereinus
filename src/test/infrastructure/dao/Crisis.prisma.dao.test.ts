import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { getInjection } from "../../../../di/container";
import { execSync } from "child_process";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";

describe("Crisis Prisma DAO", () => {
	const crisisPrismaDao: CrisisPrismaDao = new CrisisPrismaDao(getInjection("PrismaClient"));

	beforeAll(() => {
		execSync("docker compose up -d");
	});

	beforeEach(async () => {
		await setupTestDatabase();
	});

	afterAll(() => {
		teardownTestDatabase();
		execSync("docker compose down");
	});

	describe("Given a user id", () => {
		test("when the user already had a crisis, then it should return all of them", async () => {
			// Given
			const userId = "1";

			// When
			const actualCrisis = await crisisPrismaDao.findAllByUserId(userId);

			// Then
			const expectedCrisis = [
				{
					userId: "1",
					datetime: new Date(2025, 0, 1, 0, 0, 0),
					note: null
				},
				{
					userId: "1",
					datetime: new Date(2025, 0, 2, 0, 0, 0),
					note: null
				}
			];

			expect(actualCrisis).toEqual(expectedCrisis);
		});
	});
});
