import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { Crisis } from "@/main/domain/Crisis";

describe("Save Crisis Use Case", () => {
	let saveCrisis: SaveCrisis<unknown>;
	let crisisRepository: CrisisRepository;
	let crisisPresenter: Presenter<Crisis, unknown>;

	beforeEach(() => {
		crisisPresenter = {
			ok: jest.fn<(crisis: Crisis) => unknown>(),
			error: jest.fn<(errorMessage: string) => unknown>()
		};

		crisisRepository = {
			findAllByUserId: jest.fn<(userId: string) => Promise<Crisis[]>>(),
			save: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>()
		};

		saveCrisis = new SaveCrisis(crisisRepository, crisisPresenter);
	});

	test("Given a userId and a crisis, when saving the crisis, then it is presented", async () => {
		// Given
		const userId = "1";
		const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "Test crisis");

		// When
		await saveCrisis.execute(userId, crisis);

		// Then
		expect(crisisRepository.save).toHaveBeenCalledWith(userId, crisis);
		expect(crisisPresenter.ok).toHaveBeenCalledWith(crisis);
	});

	test("Given a userId and a crisis, when saving fails, then an error is presented", async () => {
		// Given
		const userId = "1";
		const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "Test crisis");
		crisisRepository.save = jest.fn<(userId: string) => Promise<void>>().mockRejectedValue(new Error("error"));

		// When
		await saveCrisis.execute(userId, crisis);

		// Then
		expect(crisisRepository.save).toHaveBeenCalledWith(userId, crisis);
		expect(crisisPresenter.error).toHaveBeenCalledWith("error");
	});
});
