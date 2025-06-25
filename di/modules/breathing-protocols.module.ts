import { createModule } from "@evyweb/ioctopus";

import { ControlBreathingSession } from "@/main/application/usecase/ControlBreathingSession";
import { GetBreathingProtocols } from "@/main/application/usecase/GetBreathingProtocols";
import { StartBreathingSession } from "@/main/application/usecase/StartBreathingSession";
import { BreathingProtocolMemoryRepository } from "@/main/infrastructure/repository/BreathingProtocol.memory.repository";
import { BreathingSessionMemoryRepository } from "@/main/infrastructure/repository/BreathingSession.memory.repository";
import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { BreathingProtocolsUIPresenter } from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";
import { BreathingSessionUIPresenter } from "@/main/presentation/presenter/BreathingSession.ui.presenter";
import { DI_SYMBOLS } from "../types";

export const createBreathingProtocolsModule = () => {
	const breathingProtocolsModule = createModule();

	// Repositories
	breathingProtocolsModule.bind(DI_SYMBOLS.BreathingProtocolRepository).toClass(BreathingProtocolMemoryRepository);

	breathingProtocolsModule.bind(DI_SYMBOLS.BreathingSessionRepository).toClass(BreathingSessionMemoryRepository);

	// Presenters
	breathingProtocolsModule.bind(DI_SYMBOLS.BreathingProtocolsUIPresenter).toClass(BreathingProtocolsUIPresenter);

	breathingProtocolsModule.bind(DI_SYMBOLS.BreathingSessionUIPresenter).toClass(BreathingSessionUIPresenter);

	// Use Cases
	breathingProtocolsModule
		.bind(DI_SYMBOLS.GetBreathingProtocols)
		.toClass(GetBreathingProtocols, [
			DI_SYMBOLS.BreathingProtocolRepository,
			DI_SYMBOLS.BreathingProtocolsUIPresenter
		]);

	breathingProtocolsModule
		.bind(DI_SYMBOLS.StartBreathingSession)
		.toClass(StartBreathingSession, [
			DI_SYMBOLS.BreathingProtocolRepository,
			DI_SYMBOLS.BreathingSessionRepository,
			DI_SYMBOLS.BreathingSessionUIPresenter
		]);

	breathingProtocolsModule
		.bind(DI_SYMBOLS.ControlBreathingSession)
		.toClass(ControlBreathingSession, [
			DI_SYMBOLS.BreathingSessionRepository,
			DI_SYMBOLS.BreathingSessionUIPresenter
		]);

	// Controller
	breathingProtocolsModule
		.bind(DI_SYMBOLS.BreathingSessionController)
		.toClass(BreathingSessionController, [
			DI_SYMBOLS.StartBreathingSession,
			DI_SYMBOLS.ControlBreathingSession,
			DI_SYMBOLS.GetBreathingProtocols
		]);

	return breathingProtocolsModule;
};
