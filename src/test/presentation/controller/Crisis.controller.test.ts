import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { execSync } from "child_process";

import { getInjection } from "@/di/container";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ResponseViewModel } from "@/main/presentation/dto/Response.viewmodel";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";

describe("Crisis Controller", () => {
	const crisisController = getInjection("CrisisController");

	beforeAll(() => {
		execSync("docker compose up -d");
	});

	beforeEach(async () => {
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
		execSync("docker compose down");
	});

	test("Given a user id with a date and a duration, when saving a crisis, then it should return a successful response", async () => {
		// Given
		const userId = "1";
		const date = new Date(2025, 0, 1, 12, 30);
		const duration = 3;

		// When
		const actualResponseViewModel = await crisisController.save(userId, date, duration);

		// Then
		const expectedResponseViewModel = ResponseViewModel.success<CrisisViewModel>(
			new CrisisViewModel("01/01/2025", "12:30", "03s")
		);

		expect(actualResponseViewModel).toEqual(expectedResponseViewModel);
	});
});
