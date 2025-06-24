import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

export const createApplicationModule = () => {
	const applicationModule = createModule();

	applicationModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [DI_SYMBOLS.CrisisRepository, DI_SYMBOLS.Presenter]);

	applicationModule.bind(DI_SYMBOLS.Presenter).toClass(CrisisUiPresenter);

	return applicationModule;
};
