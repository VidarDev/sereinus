import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingSession } from "@/main/domain/BreathingSession";

export interface BreathingSessionViewModel {
	id: string;
	protocolId: string;
	protocolName: string;
	startTime: Date;
	endTime?: Date;
	duration: number;
	currentPhase: "inhale" | "hold1" | "exhale" | "hold2" | "idle";
	cycleCount: number;
	isActive: boolean;
	isPaused: boolean;
	settings: {
		hapticEnabled: boolean;
		soundEnabled: boolean;
		wakeLockEnabled: boolean;
	};
}

export interface BreathingSessionResponse {
	success: boolean;
	data?: BreathingSessionViewModel;
	error?: string;
}

export class BreathingSessionUIPresenter implements Presenter<BreathingSession, BreathingSessionResponse> {
	ok(session: BreathingSession): BreathingSessionResponse {
		return {
			success: true,
			data: this.toViewModel(session)
		};
	}

	error(message: string): BreathingSessionResponse {
		return {
			success: false,
			error: message
		};
	}

	private toViewModel(session: BreathingSession): BreathingSessionViewModel {
		return {
			id: session.id,
			protocolId: session.protocol.id,
			protocolName: session.protocol.name,
			startTime: session.startTime,
			endTime: session.endTime,
			duration: session.duration,
			currentPhase: session.currentPhase,
			cycleCount: session.cycleCount,
			isActive: session.isActive,
			isPaused: session.isPaused,
			settings: {
				hapticEnabled: session.settings.hapticEnabled,
				soundEnabled: session.settings.soundEnabled,
				wakeLockEnabled: session.settings.wakeLockEnabled
			}
		};
	}
}
