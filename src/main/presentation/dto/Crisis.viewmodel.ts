export class CrisisViewModel {
	public readonly formatedDate: string;
	public readonly datetime: Date;
	public readonly time: string;
	public readonly duration: string;
	public readonly note?: string;
	public readonly protocolId?: string;
	public readonly protocolName?: string;
	public readonly cycleCount?: number;
	public readonly efficiency?: number;
	public readonly averageCycleTime?: number;
	public readonly isBreathingSession: boolean;
	public readonly isSimpleCrisis: boolean;

	constructor(
		formatedDate: string,
		date: Date,
		time: string,
		duration: string,
		note?: string,
		protocolId?: string,
		protocolName?: string,
		cycleCount?: number,
		efficiency?: number,
		averageCycleTime?: number
	) {
		this.formatedDate = formatedDate;
		this.datetime = date;
		this.time = time;
		this.duration = duration;
		this.note = note;
		this.protocolId = protocolId;
		this.protocolName = protocolName;
		this.cycleCount = cycleCount;
		this.efficiency = efficiency;
		this.averageCycleTime = averageCycleTime;
		this.isBreathingSession = protocolId !== undefined;
		this.isSimpleCrisis = protocolId === undefined;
	}
}
