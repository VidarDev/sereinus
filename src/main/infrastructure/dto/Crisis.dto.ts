export class CrisisDTO {
	public readonly id: string;
	public readonly userId: string;
	public readonly datetime: Date;
	public readonly duration: number;
	public readonly note: string | undefined;
	public readonly protocolId: string | undefined;
	public readonly protocolName: string | undefined;
	public readonly cycleCount: number | undefined;
	public readonly efficiency: number | undefined;
	public readonly averageCycleTime: number | undefined;

	constructor(
		userId: string,
		datetime: Date,
		duration: number,
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
		this.id = options?.id || `crisis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		this.userId = userId;
		this.datetime = datetime;
		this.duration = duration;
		this.note = note;
		this.protocolId = options?.protocolId;
		this.protocolName = options?.protocolName;
		this.cycleCount = options?.cycleCount;
		this.efficiency = options?.efficiency;
		this.averageCycleTime = options?.averageCycleTime;
	}
}
