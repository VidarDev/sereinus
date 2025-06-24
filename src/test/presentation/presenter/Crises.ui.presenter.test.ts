import { describe, expect, test } from "@jest/globals";

import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ResponseViewModel } from "@/main/presentation/dto/Response.viewmodel";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

describe("Crises UI Presenter", () => {
	const crisesUiPresenter = new CrisesUiPresenter();

	test("Given a crisis, when presenting it, then it should return a successful view model", () => {
		// Given
		const crises = [
			new Crisis(new Date(2025, 0, 1, 12, 30), 3783, "Hello world"),
			new Crisis(new Date(2025, 0, 1, 12, 30), 3600, "Hello world"),
			new Crisis(new Date(2025, 0, 1, 12, 30), 3602, "Hello world"),
			new Crisis(new Date(2025, 0, 1, 12, 30), 0, "Hello world")
		];

		// When
		const actualResponseViewModel = crisesUiPresenter.ok(crises);

		// Then
		const expectedResponseViewModel = ResponseViewModel.success([
			new CrisisViewModel("01/01/2025", "12:30", "1h 03min 03s", "Hello world"),
			new CrisisViewModel("01/01/2025", "12:30", "1h", "Hello world"),
			new CrisisViewModel("01/01/2025", "12:30", "1h 00min 02s", "Hello world"),
			new CrisisViewModel("01/01/2025", "12:30", "00s", "Hello world")
		]);

		expect(actualResponseViewModel).toEqual(expectedResponseViewModel);
	});

	test("Given an error, when presenting it, then it should return an error view model", () => {
		// Given
		const errorMessage = "An error occurred";

		// When
		const actualResponseViewModel = crisesUiPresenter.error(errorMessage);

		// Then
		const expectedResponseViewModel = ResponseViewModel.error<CrisisViewModel>("An error occurred");

		expect(actualResponseViewModel).toEqual(expectedResponseViewModel);
	});
});
