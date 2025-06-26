import { PrismaClient } from "@prisma/client";

import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { Clock } from "@/main/domain/services/clock.interface";
import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";

export const DI_SYMBOLS = {
	// Controllers
	BreathingSessionController: Symbol.for("BreathingSessionController"),
	CrisisController: Symbol.for("CrisisController"),

	// Presenters
	ActionUIPresenter: Symbol.for("ActionUIPresenter"),
	BreathingProtocolsUIPresenter: Symbol.for("BreathingProtocolsUIPresenter"),
	BreathingSessionUIPresenter: Symbol.for("BreathingSessionUIPresenter"),
	CrisesUIPresenter: Symbol.for("CrisesUIPresenter"),

	// Services
	UuidGenerator: Symbol.for("UuidGenerator"),
	Clock: Symbol.for("Clock"),

	// Repositories
	BreathingProtocolRepository: Symbol.for("BreathingProtocolRepository"),
	BreathingSessionRepository: Symbol.for("BreathingSessionRepository"),
	CrisisRepository: Symbol.for("CrisisRepository"),

	// DAOs
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao")
};

export interface DiReturnTypes {
	// Controllers
	BreathingSessionController: BreathingSessionController;
	CrisisController: CrisisController;

	// Presenters
	BreathingProtocolsUIPresenter: Presenter<unknown, unknown>;
	BreathingSessionUIPresenter: Presenter<unknown, unknown>;
	ActionUIPresenter: Presenter<unknown, unknown>;
	CrisesUIPresenter: Presenter<unknown, unknown>;

	// Repositories
	BreathingProtocolRepository: BreathingProtocolRepository;
	BreathingSessionRepository: BreathingSessionRepository;
	CrisisRepository: CrisisRepository;

	// Services
	UuidGenerator: UUIDGenerator;
	Clock: Clock;

	// DAOs
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
}
