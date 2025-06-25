import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingSession, SessionSettings } from "@/main/domain/BreathingSession";

export interface StartBreathingSessionRequest {
	userId: string;
	protocolId: string;
	settings: SessionSettings;
}

export class StartBreathingSession<T> {
	private readonly protocolRepository: BreathingProtocolRepository;
	private readonly sessionRepository: BreathingSessionRepository;
	private readonly presenter: Presenter<BreathingSession, T>;

	constructor(
		protocolRepository: BreathingProtocolRepository,
		sessionRepository: BreathingSessionRepository,
		presenter: Presenter<BreathingSession, T>
	) {
		this.protocolRepository = protocolRepository;
		this.sessionRepository = sessionRepository;
		this.presenter = presenter;
	}

	async execute(request: StartBreathingSessionRequest): Promise<T> {
		try {
			const protocol = await this.protocolRepository.findById(request.protocolId);

			if (!protocol) {
				return this.presenter.error("Protocol not found");
			}

			const session = new BreathingSession(protocol, request.settings);
			session.start();

			await this.sessionRepository.save(request.userId, session);

			return this.presenter.ok(session);
		} catch (error) {
			return this.presenter.error((error as Error).message);
		}
	}
}
