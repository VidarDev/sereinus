export class CrisisDTO {
	public readonly userId: string;
	public readonly datetime: Date;
	public readonly duration: number;
	public readonly note?: string;
	public readonly protocolId?: string;
	public readonly protocolName?: string;
	public readonly cycleCount?: number;
	public readonly efficiency?: number;
	public readonly averageCycleTime?: number;

	constructor(
		userId: string,
		datetime: Date,
		duration: number,
		note?: string,
		protocolId?: string,
		protocolName?: string,
		cycleCount?: number,
		efficiency?: number,
		averageCycleTime?: number
	) {
		this.userId = userId;
		this.datetime = datetime;
		this.duration = duration;
		this.note = note;
		this.protocolId = protocolId;
		this.protocolName = protocolName;
		this.cycleCount = cycleCount;
		this.efficiency = efficiency;
		this.averageCycleTime = averageCycleTime;
	}
}
