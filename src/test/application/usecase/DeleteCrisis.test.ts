import { beforeEach, describe, expect, jest, test } from "@jest/globals";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { DeleteCrisis } from "@/main/application/usecase/DeleteCrisis";
import { Crisis } from "@/main/domain/Crisis";

describe("Delete Crisis Use Case", () => {
	let deleteCrisis: DeleteCrisis<unknown>;
	let crisisRepository: CrisisRepository;
	let crisisPresenter: Presenter<null, unknown>;

	beforeEach(() => {
		crisisPresenter = {
			ok: jest.fn<() => unknown>(),
			error: jest.fn<(errorMessage: string) => unknown>()
		};

		crisisRepository = {
			findAllByUserId: jest.fn<(userId: string) => Promise<Crisis[]>>(),
			save: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>(),
			update: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>(),
			delete: jest.fn<(userId: string, crisis: Crisis) => Promise<void>>()
		};

		deleteCrisis = new DeleteCrisis(crisisRepository, crisisPresenter);
	});

	test("Given a userId and a crisis, when deleting the crisis, then it is presented", async () => {
		// Given
		const userId = "1";
		const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "Test crisis");

		// When
		await deleteCrisis.execute(userId, crisis);

		// Then
		expect(crisisRepository.delete).toHaveBeenCalledWith(userId, crisis);
		expect(crisisPresenter.ok).toHaveBeenCalledWith();
	});

	test("Given a userId and a crisis, when deleting fails, then an error is presented", async () => {
		// Given
		const userId = "1";
		const crisis = new Crisis(new Date(2025, 0, 1, 0, 0, 0), 45, "Test crisis");
		crisisRepository.delete = jest.fn<(userId: string) => Promise<void>>().mockRejectedValue(new Error("error"));

		// When
		await deleteCrisis.execute(userId, crisis);

		// Then
		expect(crisisRepository.delete).toHaveBeenCalledWith(userId, crisis);
		expect(crisisPresenter.error).toHaveBeenCalledWith("error");
	});
});
