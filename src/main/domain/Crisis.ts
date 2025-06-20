export class Crisis {
	private readonly _datetime: Date;
	private readonly _note?: string;

	constructor(datetime: Date, note?: string) {
		this._datetime = datetime;
		this._note = note;
	}

	public get datetime(): Date {
		return this._datetime;
	}

	public get note(): string | undefined {
		return this._note;
	}
}
