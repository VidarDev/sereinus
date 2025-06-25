"use client";

import { useCallback, useEffect, useState } from "react";

import type { SavedSessionData, SessionCompletionData } from "@/vue/features/breathing-session/types/session.types";
import { SiteConfig } from "@/vue/site-config";

const STORAGE_KEY = `${SiteConfig.appId}-session-history`;

export interface SessionHistoryStats {
	totalSessions: number;
	totalDuration: number;
	averageEfficiency: number;
	longestStreak: number;
	currentStreak: number;
	monthlyData: {
		date: string;
		sessions: number;
		avgEfficiency: number;
		totalDuration: number;
	}[];
}

export const useSessionHistory = () => {
	const [sessions, setSessions] = useState<SavedSessionData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				const validSessions = parsed
					.map((session: SavedSessionData) => ({
						...session,
						completedAt: new Date(session.completedAt)
					}))
					.filter((session: SavedSessionData) => session.id && session.protocolId && session.duration > 0);
				setSessions(validSessions);
			}
		} catch (error) {
			console.error("Erreur lors du chargement de l'historique:", error);
			setSessions([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const saveToStorage = useCallback((newSessions: SavedSessionData[]) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
		} catch (error) {
			console.error("Erreur lors de la sauvegarde de l'historique:", error);
		}
	}, []);

	const saveSession = useCallback(
		async (completionData: SessionCompletionData, note?: string) => {
			const newSession: SavedSessionData = {
				id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
				protocolId: completionData.protocolId,
				protocolName: completionData.protocolName,
				duration: completionData.sessionData.duration,
				cycleCount: completionData.sessionData.cycleCount,
				completedAt: completionData.sessionData.completedAt,
				note: note?.trim(),
				efficiency: completionData.metrics.efficiency,
				averageCycleTime: completionData.metrics.averageCycleTime
			};

			const updatedSessions = [newSession, ...sessions].sort(
				(a, b) => b.completedAt.getTime() - a.completedAt.getTime()
			);

			setSessions(updatedSessions);
			saveToStorage(updatedSessions);
		},
		[sessions, saveToStorage]
	);

	const updateSessionNote = useCallback(
		(sessionId: string, note: string) => {
			const updatedSessions = sessions.map((session) =>
				session.id === sessionId ? { ...session, note: note.trim() || undefined } : session
			);

			setSessions(updatedSessions);
			saveToStorage(updatedSessions);
		},
		[sessions, saveToStorage]
	);

	const deleteSession = useCallback(
		(sessionId: string) => {
			const updatedSessions = sessions.filter((session) => session.id !== sessionId);
			setSessions(updatedSessions);
			saveToStorage(updatedSessions);
		},
		[sessions, saveToStorage]
	);

	const getStats = useCallback((): SessionHistoryStats => {
		if (sessions.length === 0) {
			return {
				totalSessions: 0,
				totalDuration: 0,
				averageEfficiency: 0,
				longestStreak: 0,
				currentStreak: 0,
				monthlyData: []
			};
		}

		const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
		const averageEfficiency = sessions.reduce((sum, session) => sum + session.efficiency, 0) / sessions.length;

		const sessionsByDate = new Map<string, number>();
		sessions.forEach((session) => {
			const dateKey = session.completedAt.toISOString().split("T")[0];
			sessionsByDate.set(dateKey, (sessionsByDate.get(dateKey) || 0) + 1);
		});

		const sortedDates = Array.from(sessionsByDate.keys()).sort();
		let currentStreak = 0;
		let longestStreak = 0;
		let tempStreak = 0;

		const today = new Date().toISOString().split("T")[0];
		const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

		if (sessionsByDate.has(today)) {
			currentStreak = 1;
			const checkDate = new Date(today);
			checkDate.setDate(checkDate.getDate() - 1);

			while (sessionsByDate.has(checkDate.toISOString().split("T")[0])) {
				currentStreak++;
				checkDate.setDate(checkDate.getDate() - 1);
			}
		} else if (sessionsByDate.has(yesterday)) {
			currentStreak = 0;
		}

		for (let i = 0; i < sortedDates.length; i++) {
			const currentDate = new Date(sortedDates[i]);
			const expectedDate = i === 0 ? currentDate : new Date(sortedDates[i - 1]);
			expectedDate.setDate(expectedDate.getDate() + 1);

			if (i === 0 || currentDate.getTime() === expectedDate.getTime()) {
				tempStreak++;
				longestStreak = Math.max(longestStreak, tempStreak);
			} else {
				tempStreak = 1;
			}
		}

		const monthlyData: SessionHistoryStats["monthlyData"] = [];
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentSessions = sessions.filter((session) => session.completedAt >= thirtyDaysAgo);
		const dayGroups = new Map<string, SavedSessionData[]>();

		recentSessions.forEach((session) => {
			const dateKey = session.completedAt.toISOString().split("T")[0];
			if (!dayGroups.has(dateKey)) {
				dayGroups.set(dateKey, []);
			}
			const existingGroup = dayGroups.get(dateKey);
			if (existingGroup) {
				existingGroup.push(session);
			}
		});

		dayGroups.forEach((daySessions, date) => {
			const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
			const avgEfficiency = daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length;

			monthlyData.push({
				date,
				sessions: daySessions.length,
				avgEfficiency,
				totalDuration
			});
		});

		monthlyData.sort((a, b) => a.date.localeCompare(b.date));

		return {
			totalSessions: sessions.length,
			totalDuration,
			averageEfficiency,
			longestStreak,
			currentStreak,
			monthlyData
		};
	}, [sessions]);

	const getThisMonthSessions = useCallback(() => {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		return sessions.filter((session) => session.completedAt >= startOfMonth);
	}, [sessions]);

	const getRecentSessions = useCallback(
		(days = 7) => {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - days);

			return sessions.filter((session) => session.completedAt >= cutoffDate);
		},
		[sessions]
	);

	return {
		// Data
		sessions,
		isLoading,

		// Actions
		saveSession,
		updateSessionNote,
		deleteSession,

		// Utilities
		getStats,
		getThisMonthSessions,
		getRecentSessions
	};
};
