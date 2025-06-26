export type { SavedSessionData } from "@/vue/features/breathing-session/types/session.types";

export interface SessionStats {
	totalSessions: number;
	totalDuration: number;
	averageEfficiency: number;
	currentStreak: number;
	longestStreak: number;
	averageDuration: number;
}

export interface MonthlyData {
	month: string;
	sessions: number;
	totalDuration: number;
	averageEfficiency: number;
}

export interface HistoryFilters {
	protocolId?: string;
	dateFrom?: Date;
	dateTo?: Date;
	minEfficiency?: number;
}
