import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingSession } from "@/main/domain/BreathingSession";
import { Clock } from "@/main/domain/services/clock.interface";
import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";
import { BreathingSessionRepository } from "../port/BreathingSession.repository.interface";

export interface StartBreathingSessionRequest {
	userId: string;
	protocolId: string;
	settings: {
		hapticEnabled: boolean;
		soundEnabled: boolean;
		wakeLockEnabled: boolean;
	};
}

export interface StartBreathingSessionResponse {
	sessionId: string;
}

export class StartBreathingSession {
	constructor(
		private readonly protocolRepository: BreathingProtocolRepository,
		private readonly sessionRepository: BreathingSessionRepository,
		private readonly uuidGenerator: UUIDGenerator,
		private readonly clock: Clock
	) {}

	public async execute(request: StartBreathingSessionRequest): Promise<StartBreathingSessionResponse> {
		const protocol = await this.protocolRepository.findById(request.protocolId);
		if (!protocol) {
			throw new Error(`Protocol not found: ${request.protocolId}`);
		}

		const session = new BreathingSession(protocol, request.settings, this.uuidGenerator, this.clock);
		session.start();

		await this.sessionRepository.save(request.userId, session);

		return {
			sessionId: session.id
		};
	}
}
