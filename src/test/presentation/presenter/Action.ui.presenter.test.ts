import { describe, expect, test } from "@jest/globals";

import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";

describe("Action UI Presenter", () => {
	const actionUiPresenter = new ActionUiPresenter();

	test("should return a successful view model", () => {
		// Given & When
		const actualViewModels = actionUiPresenter.ok();

		// Then
		expect(actualViewModels).toBe(true);
	});

	test("Given an error, when presenting it, then it should return an error view model", () => {
		// Given
		const errorMessage = "An error occurred";

		// When
		const actualViewModel = actionUiPresenter.error(errorMessage);

		// Then
		const expectedViewModel = "An error occurred";

		expect(actualViewModel).toEqual(expectedViewModel);
	});
});
