import {
	ControlBreathingSession,
	ControlBreathingSessionRequest
} from "@/main/application/usecase/ControlBreathingSession";
import { GetBreathingProtocols, GetBreathingProtocolsRequest } from "@/main/application/usecase/GetBreathingProtocols";
import {
	StartBreathingSession,
	StartBreathingSessionRequest,
	StartBreathingSessionResponse
} from "@/main/application/usecase/StartBreathingSession";

export class BreathingSessionController {
	private readonly startBreathingSession: StartBreathingSession;
	private readonly controlBreathingSession: ControlBreathingSession<unknown>;
	private readonly getBreathingProtocols: GetBreathingProtocols<unknown>;

	constructor(
		startBreathingSession: StartBreathingSession,
		controlBreathingSession: ControlBreathingSession<unknown>,
		getBreathingProtocols: GetBreathingProtocols<unknown>
	) {
		this.startBreathingSession = startBreathingSession;
		this.controlBreathingSession = controlBreathingSession;
		this.getBreathingProtocols = getBreathingProtocols;
	}

	public async startSession(request: StartBreathingSessionRequest): Promise<StartBreathingSessionResponse> {
		return this.startBreathingSession.execute(request);
	}

	public async controlSession(request: ControlBreathingSessionRequest): Promise<unknown> {
		return this.controlBreathingSession.execute(request);
	}

	public async getProtocols(request: GetBreathingProtocolsRequest = {}): Promise<unknown> {
		return this.getBreathingProtocols.execute(request);
	}

	// Méthodes de convenance pour l'interface
	public async pauseSession(sessionId: string): Promise<unknown> {
		return this.controlSession({ sessionId, action: "pause" });
	}

	public async resumeSession(sessionId: string): Promise<unknown> {
		return this.controlSession({ sessionId, action: "resume" });
	}

	public async stopSession(sessionId: string): Promise<unknown> {
		return this.controlSession({ sessionId, action: "stop" });
	}

	public async updateSessionSettings(
		sessionId: string,
		settings: Partial<import("@/main/domain/BreathingSession").SessionSettings>
	): Promise<unknown> {
		return this.controlSession({ sessionId, action: "updateSettings", settings });
	}
}
