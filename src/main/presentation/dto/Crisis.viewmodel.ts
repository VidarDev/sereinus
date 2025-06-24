export class CrisisViewModel {
	readonly formatedDate: string;
	readonly datetime: Date;
	readonly time: string;
	readonly duration: string;
	readonly note?: string;

	constructor(formatedDate: string, date: Date, time: string, duration: string, note?: string) {
		this.formatedDate = formatedDate;
		this.datetime = date;
		this.time = time;
		this.duration = duration;
		this.note = note;
	}
}
