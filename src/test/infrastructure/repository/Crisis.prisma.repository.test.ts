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
				new Crisis(new Date(2025, 0, 1, 0, 0, 0), "First crisis"),
				new Crisis(new Date(2025, 0, 2, 0, 0, 0))
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
		test("when it does not exist, then it is saved", async () => {
			// Given
			const userId = "3";
			const crisis = new Crisis(new Date(2025, 0, 3, 0, 0, 0));

			// When & Then
			await expect(crisisPrismaRepository.save(userId, crisis)).resolves.not.toThrow();
		});

		test("when it already exists, then an error is thrown", async () => {
			// Given
			const userId = "1";
			const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), "First crisis");

			// When & Then
			await expect(crisisPrismaRepository.save(userId, crisis)).rejects.toThrow(
				"Un enregistrement existe déjà pour cette date."
			);
		});

		test("when saving fails, then an error is thrown", async () => {
			// Given
			let prismaClientMock: jest.Mocked<PrismaClient> = {
				crisis: {
					// @ts-ignore
					save: jest.fn().mockRejectedValue(new Error("Database error"))
				}
			};

			const mockedDao = new CrisisPrismaDao(prismaClientMock);

			crisisPrismaRepository = new CrisisPrismaRepository(mockedDao);
			const userId = "1";
			const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), "First crisis");

			// When & Then
			await expect(crisisPrismaRepository.save(userId, crisis)).rejects.toThrow(
				"Une erreur est survenue lors de la sauvegarde."
			);
		});
	});
});
