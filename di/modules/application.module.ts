import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

export const createApplicationModule = () => {
	const applicationModule = createModule();

	applicationModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [
			DI_SYMBOLS.CrisisRepository,
			DI_SYMBOLS.CrisisUiPresenter,
			DI_SYMBOLS.CrisesUiPresenter
		]);

	applicationModule.bind(DI_SYMBOLS.CrisisUiPresenter).toClass(CrisisUiPresenter);
	applicationModule.bind(DI_SYMBOLS.CrisesUiPresenter).toClass(CrisesUiPresenter);

	return applicationModule;
};
