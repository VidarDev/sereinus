export interface BreathingPhases {
	readonly inhale: number;
	readonly hold1?: number;
	readonly exhale: number;
	readonly hold2?: number;
}

export class BreathingProtocol {
	private readonly _id: string;
	private readonly _name: string;
	private readonly _description: string;
	private readonly _phases: BreathingPhases;
	private readonly _totalCycleDuration: number;
	private readonly _isScientificallyValidated: boolean;

	constructor(
		id: string,
		name: string,
		description: string,
		phases: BreathingPhases,
		isScientificallyValidated = true
	) {
		this._id = id;
		this._name = name;
		this._description = description;
		this._phases = phases;
		this._totalCycleDuration = this.calculateTotalDuration(phases);
		this._isScientificallyValidated = isScientificallyValidated;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get phases(): BreathingPhases {
		return this._phases;
	}

	get totalCycleDuration(): number {
		return this._totalCycleDuration;
	}

	get isScientificallyValidated(): boolean {
		return this._isScientificallyValidated;
	}

	private calculateTotalDuration(phases: BreathingPhases): number {
		return phases.inhale + (phases.hold1 ?? 0) + phases.exhale + (phases.hold2 ?? 0);
	}
}
