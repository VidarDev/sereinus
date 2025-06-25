export class CrisisDTO {
	private readonly _userId: string;
	private readonly _datetime: Date;
	private readonly _duration: number;
	private readonly _note: string | undefined;

	constructor(userId: string, datetime: Date, duration: number, note?: string) {
		this._userId = userId;
		this._datetime = datetime;
		this._duration = duration;
		this._note = note;
	}

	get userId(): string {
		return this._userId;
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
