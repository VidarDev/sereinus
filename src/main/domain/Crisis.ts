export class Crisis {
	private readonly _datetime: Date;
	private readonly _duration: number;
	private readonly _note?: string;

	constructor(datetime: Date, duration: number, note?: string) {
		this._datetime = datetime;
		this._duration = duration;
		this._note = note;
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
}
