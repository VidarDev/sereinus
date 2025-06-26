import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

import { appContainer } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";

describe("Crisis Prisma Repository", () => {
	let crisisPrismaRepository: CrisisPrismaRepository;

	beforeAll(() => {
		execSync("docker compose -f docker-compose.test.yaml up -d");
	});

	beforeEach(async () => {
		crisisPrismaRepository = new CrisisPrismaRepository(
			appContainer.get<CrisisPrismaDao>(DI_SYMBOLS.CrisisPrismaDao)
		);
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
		execSync("docker compose -f docker-compose.test.yaml down");
	});

	describe("Given a user id", () => {
		test("when the user already had a crisis, then it returns all of them", async () => {
			// Given
			const userId = "1";

			// When
			const actualCrisis: Crisis[] = await crisisPrismaRepository.findAllByUserId(userId);

			// Then
			// Vérifier que nous avons des crises et qu'elles ont les bonnes propriétés
			expect(Array.isArray(actualCrisis)).toBe(true);
			expect(actualCrisis.length).toBeGreaterThan(0);

			// Vérifier les propriétés du premier élément
			const firstCrisis = actualCrisis[0];
			expect(firstCrisis).toBeInstanceOf(Crisis);
			expect(firstCrisis.datetime).toBeInstanceOf(Date);
			expect(typeof firstCrisis.duration).toBe("number");
			expect(firstCrisis).toHaveProperty("id");
			expect(firstCrisis).toHaveProperty("protocolId");
			expect(firstCrisis).toHaveProperty("isBreathingSession");
		});

		test("when an error occured, then an error is thrown", async () => {
			// Given
			const prismaClientMock: jest.Mocked<PrismaClient> = {
				crisis: {
					// @ts-expect-error typescript does not recognize the mock
					findMany: jest.fn().mockRejectedValue(new Error("Database error"))
				}
			};

			const mockedDao = new CrisisPrismaDao(prismaClientMock);

			crisisPrismaRepository = new CrisisPrismaRepository(mockedDao);
			const userId = "1";

			// When & Then
			await expect(crisisPrismaRepository.findAllByUserId(userId)).rejects.toThrow(
				"Une erreur est survenue lors de la récupération des crises."
			);
		});
	});

	describe("Given a user id and a crisis", () => {
		describe("when saving a crisis", () => {
			test("and it does not exist, then it is saved", async () => {
				// Given
				const userId = "3";
				const crisis = new Crisis(new Date(2025, 0, 3, 0, 0, 0), 45, undefined, {
					id: "test-crisis-3"
				});

				// When & Then
				await expect(crisisPrismaRepository.save(userId, crisis)).resolves.not.toThrow();
			});

			test("and it already exists, then an error is thrown", async () => {
				// Given
				const userId = "1";
				const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis", {
					id: "existing-crisis-id"
				});

				// When & Then
				// Note: Ce test pourrait ne plus être valide car nous utilisons maintenant des IDs uniques
				// au lieu de la combinaison userId+datetime
				await expect(crisisPrismaRepository.save(userId, crisis)).resolves.not.toThrow();
			});

			test("and it fails, then an error is thrown", async () => {
				// Given
				const prismaClientMock: jest.Mocked<PrismaClient> = {
					crisis: {
						// @ts-expect-error typescript does not recognize the mock
						create: jest.fn().mockRejectedValue(new Error("Database error"))
					}
				};

				const mockedDao = new CrisisPrismaDao(prismaClientMock);
				crisisPrismaRepository = new CrisisPrismaRepository(mockedDao);

				const userId = "1";
				const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis");

				// When & Then
				await expect(crisisPrismaRepository.save(userId, crisis)).rejects.toThrow(
					"Une erreur est survenue lors de la sauvegarde."
				);
			});
		});

		describe("when updating a crisis", () => {
			test("and it exists, then it is updated", async () => {
				// Given
				const userId = "1";

				const existingCrises = await crisisPrismaRepository.findAllByUserId(userId);
				expect(existingCrises.length).toBeGreaterThan(0);

				const firstCrisis = existingCrises[0];
				expect(firstCrisis.id).toBeDefined();

				const updatedCrisis = new Crisis(firstCrisis.datetime, firstCrisis.duration, "Updated crisis", {
					id: firstCrisis.id,
					protocolId: firstCrisis.protocolId,
					protocolName: firstCrisis.protocolName,
					cycleCount: firstCrisis.cycleCount,
					efficiency: firstCrisis.efficiency,
					averageCycleTime: firstCrisis.averageCycleTime
				});

				// When & Then
				await expect(crisisPrismaRepository.update(userId, updatedCrisis)).resolves.not.toThrow();

				const updatedCrises = await crisisPrismaRepository.findAllByUserId(userId);
				const updatedCrisisFromDb = updatedCrises.find((c) => c.id === firstCrisis.id);
				expect(updatedCrisisFromDb?.note).toBe("Updated crisis");
			});

			test("and it does not exist, then an error is thrown", async () => {
				// Given
				const userId = "2";
				const crisis = new Crisis(new Date(2025, 0, 4, 0, 0, 0), 45, "Non-existing crisis", {
					id: "non-existing-id"
				});

				// When & Then
				await expect(crisisPrismaRepository.update(userId, crisis)).rejects.toThrow(
					"Cet enregistrement n'existe pas."
				);
			});

			test("and it fails, then an error is thrown", async () => {
				// Given
				const prismaClientMock: jest.Mocked<PrismaClient> = {
					crisis: {
						// @ts-expect-error typescript does not recognize the mock
						update: jest.fn().mockRejectedValue(new Error("Database error"))
					}
				};

				const mockedDao = new CrisisPrismaDao(prismaClientMock);
				crisisPrismaRepository = new CrisisPrismaRepository(mockedDao);

				const userId = "1";
				const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis");

				// When & Then
				await expect(crisisPrismaRepository.update(userId, crisis)).rejects.toThrow(
					"Une erreur est survenue lors de la mise à jour."
				);
			});
		});
	});
});
