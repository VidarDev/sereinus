import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { GetBreathingProtocols } from "@/main/application/usecase/GetBreathingProtocols";
import { GetBreathingProtocolsForUI } from "@/main/application/usecase/GetBreathingProtocolsForUI.usecase";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { StartBreathingSession } from "@/main/application/usecase/StartBreathingSession";
import { UpdateCrisis } from "@/main/application/usecase/UpdateCrisis";
import { Clock } from "@/main/domain/services/clock.interface";
import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { BreathingSessionController } from "@/main/presentation/controller/BreathingSession.controller";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";

export const DI_SYMBOLS = {
	// Application Layer
	GetBreathingProtocols: Symbol.for("GetBreathingProtocols"),
	GetBreathingProtocolsForUI: Symbol.for("GetBreathingProtocolsForUI"),
	CreateBreathingSessionForUI: Symbol.for("CreateBreathingSessionForUI"),
	ControlBreathingSession: Symbol.for("ControlBreathingSession"),
	StartBreathingSession: Symbol.for("StartBreathingSession"),

	// Crisis Use Cases
	GetAllCrises: Symbol.for("GetAllCrises"),
	SaveCrisis: Symbol.for("SaveCrisis"),
	UpdateCrisis: Symbol.for("UpdateCrisis"),
	DeleteCrisis: Symbol.for("DeleteCrisis"),

	// Controllers
	BreathingSessionController: Symbol.for("BreathingSessionController"),
	CrisisController: Symbol.for("CrisisController"),

	// Repositories
	BreathingProtocolRepository: Symbol.for("BreathingProtocolRepository"),
	BreathingSessionRepository: Symbol.for("BreathingSessionRepository"),
	CrisisRepository: Symbol.for("CrisisRepository"),

	// Services
	UuidGenerator: Symbol.for("UuidGenerator"),
	Clock: Symbol.for("Clock"),
	BreathingSessionOrchestrator: Symbol.for("BreathingSessionOrchestrator"),

	// Infrastructure
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),

	// Presenters
	ActionUIPresenter: Symbol.for("ActionUIPresenter"),
	BreathingProtocolsUIPresenter: Symbol.for("BreathingProtocolsUIPresenter"),
	BreathingSessionUIPresenter: Symbol.for("BreathingSessionUIPresenter"),
	CrisesUIPresenter: Symbol.for("CrisesUIPresenter")
};

export interface DiReturnTypes {
	BreathingProtocolRepository: BreathingProtocolRepository;
	BreathingSessionRepository: BreathingSessionRepository;
	CrisisRepository: CrisisRepository;

	GetBreathingProtocols: GetBreathingProtocols<unknown>;
	GetBreathingProtocolsForUI: GetBreathingProtocolsForUI<unknown>;
	StartBreathingSession: StartBreathingSession;
	GetAllCrises: GetAllCrises<unknown>;
	SaveCrisis: SaveCrisis<unknown>;
	UpdateCrisis: UpdateCrisis<unknown>;

	BreathingProtocolsUIPresenter: Presenter<unknown, unknown>;
	BreathingSessionUIPresenter: Presenter<unknown, unknown>;
	ActionUIPresenter: Presenter<unknown, unknown>;
	CrisesUIPresenter: Presenter<unknown, unknown>;

	BreathingSessionController: BreathingSessionController;
	CrisisController: CrisisController;

	UuidGenerator: UUIDGenerator;
	Clock: Clock;

	PrismaClient: unknown;
	CrisisPrismaDao: CrisisPrismaDao;
}
