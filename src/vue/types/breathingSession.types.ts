export interface BreathingSessionData {
	date: Date;
	duration: number;
	note?: string;
	protocolId: string;
	protocolName: string;
	cycleCount: number;
	efficiency: number;
	averageCycleTime: number;
}
