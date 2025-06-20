import { afterAll, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { getInjection } from "../../../../di/container";
import { execSync } from "child_process";
import { setupTestDatabase, teardownTestDatabase } from "@/test/helper/prismaHelper";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PrismaClient } from "@prisma/client";

describe("Crisis Prisma Repository", () => {
	let crisisPrismaRepository: CrisisPrismaRepository;

	beforeAll(() => {
		execSync("docker compose up -d");
	});

	beforeEach(async () => {
		crisisPrismaRepository = new CrisisPrismaRepository(getInjection("CrisisPrismaDao"));
		await setupTestDatabase();
	});

	afterAll(async () => {
		await teardownTestDatabase();
		execSync("docker compose down");
	});

	describe("Given a user id", () => {
		test("when the user already had a crisis, then it returns all of them", async () => {
			// Given
			const userId = "1";

			// When
			const actualCrisis: Crisis[] = await crisisPrismaRepository.findAllByUserId(userId);

			// Then
			const expectedCrisis: Crisis[] = [
				new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis"),
				new Crisis(new Date(2025, 0, 2, 0, 0, 0), 45)
			];

			expect(actualCrisis).toEqual(expectedCrisis);
		});

		test("when an error occured, then an error is thrown", async () => {
			// Given
			let prismaClientMock: jest.Mocked<PrismaClient> = {
				crisis: {
					// @ts-ignore
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
				const crisis = new Crisis(new Date(2025, 0, 3, 0, 0, 0), 45);

				// When & Then
				await expect(crisisPrismaRepository.save(userId, crisis)).resolves.not.toThrow();
			});

			test("and it already exists, then an error is thrown", async () => {
				// Given
				const userId = "1";
				const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis");

				// When & Then
				await expect(crisisPrismaRepository.save(userId, crisis)).rejects.toThrow(
					"Un enregistrement existe déjà pour cette date."
				);
			});

			test("and it fails, then an error is thrown", async () => {
				// Given
				const prismaClientMock: jest.Mocked<PrismaClient> = {
					crisis: {
						// @ts-ignore
						save: jest.fn().mockRejectedValue(new Error("Database error"))
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
				const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "Updated crisis");

				// When & Then
				await expect(crisisPrismaRepository.update(userId, crisis)).resolves.not.toThrow();
			});

			test("and it does not exist, then an error is thrown", async () => {
				// Given
				const userId = "2";
				const crisis = new Crisis(new Date(2025, 0, 4, 0, 0, 0), 45, "Non-existing crisis");

				// When & Then
				await expect(crisisPrismaRepository.update(userId, crisis)).rejects.toThrow(
					"Cet enregistrement n'existe pas."
				);
			});

			test("and it fails, then an error is thrown", async () => {
				// Given
				const prismaClientMock: jest.Mocked<PrismaClient> = {
					crisis: {
						// @ts-ignore
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
