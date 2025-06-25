import { PrismaClient } from "@prisma/client";

import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { ControlBreathingSession } from "@/main/application/usecase/ControlBreathingSession";
import { GetBreathingProtocols } from "@/main/application/usecase/GetBreathingProtocols";
import { StartBreathingSession } from "@/main/application/usecase/StartBreathingSession";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import {
	BreathingProtocolsResponse,
	BreathingProtocolsUIPresenter
} from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";
import {
	BreathingSessionResponse,
	BreathingSessionUIPresenter
} from "@/main/presentation/presenter/BreathingSession.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository"),
	CrisisController: Symbol.for("CrisisController"),
	ActionUiPresenter: Symbol.for("ActionUiPresenter"),
	CrisesUiPresenter: Symbol.for("CrisesUiPresenter"),
	// Breathing Protocols
	BreathingProtocolRepository: Symbol.for("BreathingProtocolRepository"),
	BreathingProtocolsUIPresenter: Symbol.for("BreathingProtocolsUIPresenter"),
	GetBreathingProtocols: Symbol.for("GetBreathingProtocols"),
	// Breathing Sessions
	BreathingSessionRepository: Symbol.for("BreathingSessionRepository"),
	BreathingSessionUIPresenter: Symbol.for("BreathingSessionUIPresenter"),
	StartBreathingSession: Symbol.for("StartBreathingSession"),
	ControlBreathingSession: Symbol.for("ControlBreathingSession"),
	BreathingSessionController: Symbol.for("BreathingSessionController")
};

export interface DiReturnTypes {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
	CrisisController: CrisisController;
	ActionUiPresenter: ActionUiPresenter;
	CrisesUiPresenter: CrisesUiPresenter;
	// Breathing Protocols
	BreathingProtocolRepository: BreathingProtocolRepository;
	BreathingProtocolsUIPresenter: BreathingProtocolsUIPresenter;
	GetBreathingProtocols: GetBreathingProtocols<BreathingProtocolsResponse>;
	// Breathing Sessions
	BreathingSessionRepository: BreathingSessionRepository;
	BreathingSessionUIPresenter: BreathingSessionUIPresenter;
	StartBreathingSession: StartBreathingSession<BreathingSessionResponse>;
	ControlBreathingSession: ControlBreathingSession<BreathingSessionResponse>;
	BreathingSessionController: BreathingSessionController;
}
