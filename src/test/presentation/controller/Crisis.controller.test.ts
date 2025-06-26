import { afterAll, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { execSync } from "child_process";

import { appContainer } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";

describe("Crisis Controller", () => {
	let crisisController: CrisisController;

	beforeAll(() => {
		execSync("docker compose -f docker-compose.test.yaml up -d");
		crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
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
		// Vérifier que c'est un tableau de CrisisViewModel
		expect(Array.isArray(actualViewModels)).toBe(true);

		if (Array.isArray(actualViewModels)) {
			expect(actualViewModels.length).toBeGreaterThan(0);

			// Vérifier les propriétés du premier élément
			const firstCrisis = actualViewModels[0];
			expect(firstCrisis).toHaveProperty("formatedDate");
			expect(firstCrisis).toHaveProperty("datetime");
			expect(firstCrisis).toHaveProperty("time");
			expect(firstCrisis).toHaveProperty("duration");
			expect(firstCrisis).toHaveProperty("note");
			expect(firstCrisis).toHaveProperty("id");
			expect(firstCrisis).toHaveProperty("protocolId");
			expect(firstCrisis).toHaveProperty("isBreathingSession");
			expect(firstCrisis).toHaveProperty("isSimpleCrisis");
		}
	});

	test("Given a user id with a crisis, when updating, then it should return a successful response", async () => {
		// Given
		const userId = "1";

		const existingCrises = await crisisController.getAll(userId);
		expect(Array.isArray(existingCrises)).toBe(true);
		expect((existingCrises as CrisisViewModel[]).length).toBeGreaterThan(0);

		const firstCrisis = (existingCrises as CrisisViewModel[])[0];
		expect(firstCrisis.id).toBeDefined();

		if (!firstCrisis.id) {
			throw new Error("First crisis should have an ID");
		}

		const crisisId = firstCrisis.id;
		const note = "updated crisis";

		// When
		const actualViewModel = await crisisController.update(userId, crisisId, note);

		// Then
		const expectedViewModel = true;

		expect(actualViewModel).toEqual(expectedViewModel);
	});
});
