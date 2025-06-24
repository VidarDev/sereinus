export class CrisisViewModel {
	private readonly date: string;
	private readonly time: string;
	private readonly duration: string;
	private readonly note?: string;

	constructor(date: string, time: string, duration: string, note?: string) {
		this.date = date;
		this.time = time;
		this.duration = duration;
		this.note = note;
	}
}
