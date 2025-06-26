export class Crisis {
	private readonly _datetime: Date;
	private readonly _duration: number;
	private readonly _note: string | undefined;
	private readonly _protocolId?: string;
	private readonly _protocolName?: string;
	private readonly _cycleCount?: number;
	private readonly _efficiency?: number;
	private readonly _averageCycleTime?: number;

	constructor(
		datetime: Date,
		duration: number,
		note?: string,
		protocolId?: string,
		protocolName?: string,
		cycleCount?: number,
		efficiency?: number,
		averageCycleTime?: number
	) {
		this._datetime = datetime;
		this._duration = duration;
		this._note = note;
		this._protocolId = protocolId;
		this._protocolName = protocolName;
		this._cycleCount = cycleCount;
		this._efficiency = efficiency;
		this._averageCycleTime = averageCycleTime;
	}

	get datetime(): Date {
		return this._datetime;
	}

	get duration(): number {
		return this._duration;
	}

	get note(): string | undefined {
		return this._note;
	}

	get protocolId(): string | undefined {
		return this._protocolId;
	}

	get protocolName(): string | undefined {
		return this._protocolName;
	}

	get cycleCount(): number | undefined {
		return this._cycleCount;
	}

	get efficiency(): number | undefined {
		return this._efficiency;
	}

	get averageCycleTime(): number | undefined {
		return this._averageCycleTime;
	}

	get isBreathingSession(): boolean {
		return this._protocolId !== undefined;
	}

	get isSimpleCrisis(): boolean {
		return this._protocolId === undefined;
	}
}
