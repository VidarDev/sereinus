import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingSession, SessionSettings } from "@/main/domain/BreathingSession";

export type SessionAction = "pause" | "resume" | "stop" | "updateSettings";

export interface ControlBreathingSessionRequest {
	sessionId: string;
	action: SessionAction;
	settings?: Partial<SessionSettings>;
}

export class ControlBreathingSession<T> {
	private readonly sessionRepository: BreathingSessionRepository;
	private readonly presenter: Presenter<BreathingSession, T>;

	constructor(sessionRepository: BreathingSessionRepository, presenter: Presenter<BreathingSession, T>) {
		this.sessionRepository = sessionRepository;
		this.presenter = presenter;
	}

	async execute(request: ControlBreathingSessionRequest): Promise<T> {
		try {
			const session = await this.sessionRepository.findById(request.sessionId);

			if (!session) {
				return this.presenter.error("Session not found");
			}

			switch (request.action) {
				case "pause":
					session.pause();
					break;
				case "resume":
					session.resume();
					break;
				case "stop":
					session.stop();
					break;
				case "updateSettings":
					if (request.settings) {
						session.updateSettings(request.settings);
					}
					break;
				default:
					return this.presenter.error("Invalid action");
			}

			await this.sessionRepository.update(session);

			return this.presenter.ok(session);
		} catch (error) {
			return this.presenter.error((error as Error).message);
		}
	}
}
