import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { Crisis } from "@/main/domain/Crisis";

describe("Get All Crisis", () => {
	let getAllCrisis: GetAllCrises<unknown>;
	let crisisRepository: CrisisRepository;
	let crisesPresenter: Presenter<Crisis[], unknown>;

	beforeEach(() => {
		crisesPresenter = {
			ok: jest.fn<(crises: Crisis[]) => unknown>(),
			error: jest.fn<(errorMessage: string) => unknown>()
		};

		crisisRepository = {
			findAllByUserId: jest
				.fn<(userId: string) => Promise<Crisis[]>>()
				.mockResolvedValue([
					new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis"),
					new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45)
				]),
			save: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>(),
			update: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>(),
			delete: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>()
		};

		getAllCrisis = new GetAllCrises<unknown>(crisisRepository, crisesPresenter);
	});

	test("Given a userId, when getting its crisis, then they are presented", async () => {
		// Given
		const userId = "1";

		// When
		await getAllCrisis.execute(userId);

		// Then
		expect(crisisRepository.findAllByUserId).toHaveBeenCalledWith(userId);
		expect(crisesPresenter.ok).toHaveBeenCalledWith([
			new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "First crisis"),
			new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45)
		]);
	});

	test("Given a userId, when getting the crisis fails, then an error is presented", async () => {
		// Given
		crisisRepository.findAllByUserId = jest
			.fn<(userId: string) => Promise<Crisis[]>>()
			.mockRejectedValue(new Error("error"));
		const userId = "1";

		// When
		await getAllCrisis.execute(userId);

		// Then
		expect(crisisRepository.findAllByUserId).toHaveBeenCalledWith(userId);
		expect(crisesPresenter.error).toHaveBeenCalledWith("error");
	});
});
