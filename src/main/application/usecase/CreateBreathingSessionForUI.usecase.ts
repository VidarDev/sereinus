import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingSession, SessionSettings } from "@/main/domain/BreathingSession";
import { Clock } from "@/main/domain/services/clock.interface";
import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";
import {
	BreathingSessionSettingsViewModel,
	BreathingSessionViewModel
} from "@/main/presentation/dto/BreathingProtocol.viewmodel";

export interface CreateBreathingSessionForUIRequest {
	userId: string;
	protocolId: string;
	settings: BreathingSessionSettingsViewModel;
}

export class CreateBreathingSessionForUI<T> {
	private readonly protocolRepository: BreathingProtocolRepository;
	private readonly sessionRepository: BreathingSessionRepository;
	private readonly presenter: Presenter<BreathingSessionViewModel, T>;
	private readonly uuidGenerator: UUIDGenerator;
	private readonly clock: Clock;

	constructor(
		protocolRepository: BreathingProtocolRepository,
		sessionRepository: BreathingSessionRepository,
		presenter: Presenter<BreathingSessionViewModel, T>,
		uuidGenerator: UUIDGenerator,
		clock: Clock
	) {
		this.protocolRepository = protocolRepository;
		this.sessionRepository = sessionRepository;
		this.presenter = presenter;
		this.uuidGenerator = uuidGenerator;
		this.clock = clock;
	}

	async execute(request: CreateBreathingSessionForUIRequest): Promise<T> {
		try {
			const protocol = await this.protocolRepository.findById(request.protocolId);

			if (!protocol) {
				return this.presenter.error("Protocol not found");
			}

			const domainSettings: SessionSettings = {
				hapticEnabled: request.settings.hapticEnabled,
				soundEnabled: request.settings.soundEnabled,
				wakeLockEnabled: request.settings.wakeLockEnabled
			};

			const session = new BreathingSession(protocol, domainSettings, this.uuidGenerator, this.clock);

			session.start();

			await this.sessionRepository.save(request.userId, session);

			const viewModel = this.transformToViewModel(session);

			return this.presenter.ok(viewModel);
		} catch (error) {
			return this.presenter.error((error as Error).message);
		}
	}

	private transformToViewModel(session: BreathingSession): BreathingSessionViewModel {
		return {
			id: session.id,
			protocol: {
				id: session.protocol.id,
				name: session.protocol.name,
				description: session.protocol.description,
				phases: session.protocol.phases,
				totalCycleDuration: session.protocol.totalCycleDuration,
				isScientificallyValidated: session.protocol.isScientificallyValidated
			},
			settings: session.settings,
			currentPhase: session.currentPhase,
			isActive: session.isActive,
			isPaused: session.isPaused,
			cycleCount: session.cycleCount,
			totalTime: session.duration
		};
	}
}
