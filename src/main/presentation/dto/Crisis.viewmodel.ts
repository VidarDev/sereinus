export class CrisisViewModel {
	public readonly formatedDate: string;
	public readonly datetime: Date;
	public readonly time: string;
	public readonly duration: string;
	public readonly note: string | undefined;

	constructor(formatedDate: string, date: Date, time: string, duration: string, note?: string) {
		this.formatedDate = formatedDate;
		this.datetime = date;
		this.time = time;
		this.duration = duration;
		this.note = note;
	}
}
