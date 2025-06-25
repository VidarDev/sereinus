export interface BreathingProtocolViewModel {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly phases: {
		readonly inhale: number;
		readonly hold1?: number;
		readonly exhale: number;
		readonly hold2?: number;
	};
	readonly totalCycleDuration: number;
	readonly isScientificallyValidated: boolean;
}

export interface BreathingSessionSettingsViewModel {
	readonly hapticEnabled: boolean;
	readonly soundEnabled: boolean;
	readonly wakeLockEnabled: boolean;
}

export interface BreathingSessionViewModel {
	readonly id: string;
	readonly protocol: BreathingProtocolViewModel;
	readonly settings: BreathingSessionSettingsViewModel;
	readonly currentPhase: "inhale" | "hold1" | "exhale" | "hold2" | "idle";
	readonly isActive: boolean;
	readonly isPaused: boolean;
	readonly cycleCount: number;
	readonly totalTime: number;
}
