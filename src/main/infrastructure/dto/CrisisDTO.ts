export class CrisisDTO {
	private readonly _userId: string;
	private readonly _datetime: Date;
	private readonly _note?: string;

	constructor(userId: string, datetime: Date, note?: string) {
		this._userId = userId;
		this._datetime = datetime;
		this._note = note;
	}

	get userId(): string {
		return this._userId;
	}

	get datetime(): Date {
		return this._datetime;
	}

	get note(): string | undefined {
		return this._note ?? undefined;
	}
}
