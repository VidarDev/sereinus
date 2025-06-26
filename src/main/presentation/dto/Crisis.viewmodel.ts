export class CrisisViewModel {
	public readonly id: string | undefined;
	public readonly formatedDate: string;
	public readonly datetime: Date;
	public readonly time: string;
	public readonly duration: string;
	public readonly note: string | undefined;
	public readonly protocolId: string | undefined;
	public readonly protocolName: string | undefined;
	public readonly cycleCount: number | undefined;
	public readonly efficiency: number | undefined;
	public readonly averageCycleTime: number | undefined;

	constructor(
		formatedDate: string,
		date: Date,
		time: string,
		duration: string,
		note?: string,
		options?: {
			id?: string;
			protocolId?: string;
			protocolName?: string;
			cycleCount?: number;
			efficiency?: number;
			averageCycleTime?: number;
		}
	) {
		this.id = options?.id;
		this.formatedDate = formatedDate;
		this.datetime = date;
		this.time = time;
		this.duration = duration;
		this.note = note;
		this.protocolId = options?.protocolId;
		this.protocolName = options?.protocolName;
		this.cycleCount = options?.cycleCount;
		this.efficiency = options?.efficiency;
		this.averageCycleTime = options?.averageCycleTime;
	}

	get isBreathingSession(): boolean {
		return this.protocolId !== undefined;
	}

	get isSimpleCrisis(): boolean {
		return this.protocolId === undefined;
	}
}
