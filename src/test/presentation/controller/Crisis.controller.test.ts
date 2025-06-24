import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { execSync } from "child_process";

import { getInjection } from "@/di/container";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";

describe("Crisis Controller", () => {
	const crisisController = getInjection("CrisisController");

	beforeAll(() => {
		execSync("docker compose -f docker-compose.test.yaml up -d");
	});

	beforeEach(async () => {
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
		execSync("docker compose -f docker-compose.test.yaml down");
	});

	test("Given a user id with a date and a duration, when saving a crisis, then it should return a successful response", async () => {
		// Given
		const userId = "1";
		const date = new Date(2025, 0, 1, 12, 30);
		const duration = 3;

		// When
		const actualViewModel = await crisisController.save(userId, date, duration);

		// Then
		const expectedViewModel = true;

		expect(actualViewModel).toEqual(expectedViewModel);
	});

	test("Given a user id, when getting crises, then it should return a successful response", async () => {
		// Given
		const userId = "1";

		// When
		const actualViewModels = await crisisController.getAll(userId);

		// Then
		const expectedViewModels = [
			new CrisisViewModel("01/01/2025", "00:00", "45s", "First crisis"),
			new CrisisViewModel("02/01/2025", "00:00", "45s")
		];

		expect(actualViewModels).toEqual(expectedViewModels);
	});
});
