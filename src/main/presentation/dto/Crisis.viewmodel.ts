export class CrisisViewModel {
	private readonly _date: string;
	private readonly _time: string;
	private readonly _duration: string;
	private readonly _note?: string;

	constructor(date: string, time: string, duration: string, note?: string) {
		this._date = date;
		this._time = time;
		this._duration = duration;
		this._note = note;
	}

	get date(): string {
		return this._date;
	}

	get time(): string {
		return this._time;
	}

	get duration(): string {
		return this._duration;
	}

	get note(): string | undefined {
		return this._note;
	}
}
