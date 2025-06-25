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
	// Repositories
	BreathingProtocolRepository: Symbol.for("BreathingProtocolRepository"),
	BreathingSessionRepository: Symbol.for("BreathingSessionRepository"),
	CrisisRepository: Symbol.for("CrisisRepository"),

	// Use Cases
	GetBreathingProtocols: Symbol.for("GetBreathingProtocols"),
	GetBreathingProtocolsForUI: Symbol.for("GetBreathingProtocolsForUI"),
	StartBreathingSession: Symbol.for("StartBreathingSession"),
	CreateBreathingSessionForUI: Symbol.for("CreateBreathingSessionForUI"),
	ControlBreathingSession: Symbol.for("ControlBreathingSession"),
	GetAllCrises: Symbol.for("GetAllCrises"),
	SaveCrisis: Symbol.for("SaveCrisis"),
	UpdateCrisis: Symbol.for("UpdateCrisis"),

	// Presenters
	BreathingProtocolsUIPresenter: Symbol.for("BreathingProtocolsUIPresenter"),
	BreathingSessionUIPresenter: Symbol.for("BreathingSessionUIPresenter"),
	ActionsUIPresenter: Symbol.for("ActionsUIPresenter"),
	CrisesUIPresenter: Symbol.for("CrisesUIPresenter"),

	// Controllers
	BreathingSessionController: Symbol.for("BreathingSessionController"),
	CrisisController: Symbol.for("CrisisController"),

	// Infrastructure Services
	UUIDGenerator: Symbol.for("UUIDGenerator"),
	Clock: Symbol.for("Clock"),
	EncryptionService: Symbol.for("EncryptionService"),

	// Services - Application
	SecureCrisisService: Symbol.for("SecureCrisisService"),

	// Services - Domain
	BreathingSessionOrchestrator: Symbol.for("BreathingSessionOrchestrator"),

	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao")
} as const;

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
	ActionsUIPresenter: Presenter<unknown, unknown>;
	CrisesUIPresenter: Presenter<unknown, unknown>;

	BreathingSessionController: BreathingSessionController;
	CrisisController: CrisisController;

	UUIDGenerator: UUIDGenerator;
	Clock: Clock;

	PrismaClient: unknown;
	CrisisPrismaDao: CrisisPrismaDao;
}
