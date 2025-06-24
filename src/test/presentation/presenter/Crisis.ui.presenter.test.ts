import { describe, expect, test } from "@jest/globals";

import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ResponseViewModel } from "@/main/presentation/dto/Response.viewmodel";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

describe("Crisis UI Presenter", () => {
	const crisisUiPresenter = new CrisisUiPresenter();

	test.each([
		[3783, "1h 03min 03s"],
		[3600, "1h"],
		[3602, "1h 00min 02s"],
		[0, "00s"]
	])(
		"Given a crisis, when presenting it, then it should return a successful view model",
		(duration: number, expectedDuration: string) => {
			// Given
			const crisis = new Crisis(new Date(2025, 0, 1, 12, 30), duration, "Hello world");

			// When
			const actualResponseViewModel = crisisUiPresenter.ok(crisis);

			// Then
			const expectedResponseViewModel = ResponseViewModel.success(
				new CrisisViewModel("01/01/2025", "12:30", expectedDuration, "Hello world")
			);

			expect(actualResponseViewModel).toEqual(expectedResponseViewModel);
		}
	);

	test("Given an error, when presenting it, then it should return an error view model", () => {
		// Given
		const errorMessage = "An error occurred";

		// When
		const actualResponseViewModel = crisisUiPresenter.error(errorMessage);

		// Then
		const expectedResponseViewModel = ResponseViewModel.error<CrisisViewModel>("An error occurred");

		expect(actualResponseViewModel).toEqual(expectedResponseViewModel);
	});
});
