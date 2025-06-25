import { Clock } from "./services/clock.interface";
import { UUIDGenerator } from "./services/uuid-generator.interface";
import { BreathingProtocol } from "./BreathingProtocol";

export type BreathingPhaseType = "inhale" | "hold1" | "exhale" | "hold2" | "idle";

export interface SessionSettings {
	readonly hapticEnabled: boolean;
	readonly soundEnabled: boolean;
	readonly wakeLockEnabled: boolean;
}

export class BreathingSession {
	private readonly _id: string;
	private readonly _protocol: BreathingProtocol;
	private readonly _settings: SessionSettings;
	private readonly _startTime: Date;
	private _endTime?: Date;
	private _currentPhase: BreathingPhaseType;
	private _cycleCount: number;
	private _isActive: boolean;
	private _isPaused: boolean;
	private readonly _clock: Clock;

	constructor(protocol: BreathingProtocol, settings: SessionSettings, uuidGenerator: UUIDGenerator, clock: Clock) {
		this._id = uuidGenerator.generate();
		this._protocol = protocol;
		this._settings = settings;
		this._startTime = clock.now();
		this._currentPhase = "idle";
		this._cycleCount = 0;
		this._isActive = false;
		this._isPaused = false;
		this._clock = clock;
	}

	get id(): string {
		return this._id;
	}

	get protocol(): BreathingProtocol {
		return this._protocol;
	}

	get settings(): SessionSettings {
		return this._settings;
	}

	get startTime(): Date {
		return this._startTime;
	}

	get endTime(): Date | undefined {
		return this._endTime;
	}

	get currentPhase(): BreathingPhaseType {
		return this._currentPhase;
	}

	get cycleCount(): number {
		return this._cycleCount;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	get isPaused(): boolean {
		return this._isPaused;
	}

	get duration(): number {
		const endTime = this._endTime ?? this._clock.now();
		return endTime.getTime() - this._startTime.getTime();
	}

	public start(): void {
		if (this._isActive) {
			throw new Error("Session is already active");
		}
		this._isActive = true;
		this._isPaused = false;
		this._currentPhase = "inhale";
	}

	public pause(): void {
		if (!this._isActive || this._isPaused) {
			throw new Error("Cannot pause: session not active or already paused");
		}
		this._isPaused = true;
	}

	public resume(): void {
		if (!this._isActive || !this._isPaused) {
			throw new Error("Cannot resume: session not active or not paused");
		}
		this._isPaused = false;
	}

	public stop(): void {
		this._isActive = false;
		this._isPaused = false;
		this._endTime = this._clock.now();
		this._currentPhase = "idle";
	}

	public nextPhase(): void {
		if (!this._isActive || this._isPaused) {
			return;
		}

		const phases = this.getActivePhases();
		const currentIndex = phases.indexOf(this._currentPhase);
		const nextIndex = (currentIndex + 1) % phases.length;

		if (nextIndex === 0) {
			this._cycleCount++;
		}

		const nextPhase = phases[nextIndex];
		if (nextPhase) {
			this._currentPhase = nextPhase;
		}
	}

	public updateSettings(newSettings: Partial<SessionSettings>): SessionSettings {
		return { ...this._settings, ...newSettings };
	}

	private getActivePhases(): BreathingPhaseType[] {
		const allPhases: BreathingPhaseType[] = ["inhale", "hold1", "exhale", "hold2"];
		return allPhases.filter((phase) => {
			if (phase === "inhale" || phase === "exhale") return true;
			if (phase === "hold1") return (this._protocol.phases.hold1 ?? 0) > 0;
			if (phase === "hold2") return (this._protocol.phases.hold2 ?? 0) > 0;
			return false;
		});
	}
}
