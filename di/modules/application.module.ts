import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

export const createApplicationModule = () => {
	const applicationModule = createModule();

	applicationModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [
			DI_SYMBOLS.CrisisRepository,
			DI_SYMBOLS.ActionsUIPresenter,
			DI_SYMBOLS.CrisesUIPresenter
		]);

	applicationModule.bind(DI_SYMBOLS.CrisesUIPresenter).toClass(CrisesUiPresenter);
	applicationModule.bind(DI_SYMBOLS.ActionsUIPresenter).toClass(ActionUiPresenter);

	return applicationModule;
};
