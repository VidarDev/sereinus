import { createModule } from "@evyweb/ioctopus";
import { PrismaClient } from "@prisma/client";

import { BreathingSessionOrchestrator } from "@/main/domain/services/breathing-session-orchestrator.service";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { BreathingProtocolMemoryRepository } from "@/main/infrastructure/repository/BreathingProtocol.memory.repository";
import { BreathingSessionMemoryRepository } from "@/main/infrastructure/repository/BreathingSession.memory.repository";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { CryptoUUIDGeneratorService } from "@/main/infrastructure/services/crypto-uuid-generator.service";
import { SystemClockService } from "@/main/infrastructure/services/system-clock.service";
import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { BreathingProtocolsUIPresenter } from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";
import { BreathingSessionUIPresenter } from "@/main/presentation/presenter/BreathingSession.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";
import { DI_SYMBOLS } from "../types";

export const createInfrastructureModule = () => {
	const infrastructureModule = createModule();

	// External Dependencies
	infrastructureModule.bind(DI_SYMBOLS.PrismaClient).toValue(new PrismaClient());

	// Services
	infrastructureModule.bind(DI_SYMBOLS.UuidGenerator).toClass(CryptoUUIDGeneratorService);
	infrastructureModule.bind(DI_SYMBOLS.Clock).toClass(SystemClockService);
	infrastructureModule
		.bind(DI_SYMBOLS.BreathingSessionOrchestrator)
		.toClass(BreathingSessionOrchestrator, [DI_SYMBOLS.UuidGenerator, DI_SYMBOLS.Clock]);

	// DAOs
	infrastructureModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);

	// Repositories
	infrastructureModule.bind(DI_SYMBOLS.BreathingProtocolRepository).toClass(BreathingProtocolMemoryRepository);

	infrastructureModule.bind(DI_SYMBOLS.BreathingSessionRepository).toClass(BreathingSessionMemoryRepository);

	infrastructureModule
		.bind(DI_SYMBOLS.CrisisRepository)
		.toClass(CrisisPrismaRepository, [DI_SYMBOLS.CrisisPrismaDao]);

	// Presenters
	infrastructureModule.bind(DI_SYMBOLS.ActionUIPresenter).toClass(ActionUiPresenter);
	infrastructureModule.bind(DI_SYMBOLS.BreathingProtocolsUIPresenter).toClass(BreathingProtocolsUIPresenter);
	infrastructureModule.bind(DI_SYMBOLS.BreathingSessionUIPresenter).toClass(BreathingSessionUIPresenter);
	infrastructureModule.bind(DI_SYMBOLS.CrisesUIPresenter).toClass(CrisesUiPresenter);

	// Controllers
	infrastructureModule
		.bind(DI_SYMBOLS.BreathingSessionController)
		.toClass(BreathingSessionController, [
			DI_SYMBOLS.StartBreathingSession,
			DI_SYMBOLS.ControlBreathingSession,
			DI_SYMBOLS.CreateBreathingSessionForUI
		]);

	infrastructureModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [DI_SYMBOLS.GetAllCrises, DI_SYMBOLS.SaveCrisis, DI_SYMBOLS.UpdateCrisis]);

	return infrastructureModule;
};
