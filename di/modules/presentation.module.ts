import { createModule } from "@evyweb/ioctopus";

import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { BreathingProtocolsUIPresenter } from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";
import { BreathingSessionUIPresenter } from "@/main/presentation/presenter/BreathingSession.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";
import { DI_SYMBOLS } from "../types";

export const createPresentationModule = () => {
	const presentationModule = createModule();

	// Controllers
	presentationModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [
			DI_SYMBOLS.CrisisRepository,
			DI_SYMBOLS.CrisesUIPresenter,
			DI_SYMBOLS.ActionUIPresenter
		]);

	presentationModule.bind(DI_SYMBOLS.BreathingSessionController).toClass(BreathingSessionController, []);

	// Presenters
	presentationModule.bind(DI_SYMBOLS.ActionUIPresenter).toClass(ActionUiPresenter);
	presentationModule.bind(DI_SYMBOLS.BreathingProtocolsUIPresenter).toClass(BreathingProtocolsUIPresenter);
	presentationModule.bind(DI_SYMBOLS.BreathingSessionUIPresenter).toClass(BreathingSessionUIPresenter);
	presentationModule.bind(DI_SYMBOLS.CrisesUIPresenter).toClass(CrisesUiPresenter);

	return presentationModule;
};
