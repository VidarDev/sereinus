"use client";

import { useEffect, useState } from "react";

import {
	type BreathingSessionData,
	deleteCrisis,
	getAllCrises,
	saveBreathingSession,
	type SerializableCrisis
} from "@/app/actions";
import { generateUID, getFromLocalStorage, saveToLocalStorage } from "@/vue/lib/utils";
import { SiteConfig } from "../site-config";

export interface SessionHistoryEntry {
	id: string;
	uid: string;
	datetime: Date;
	duration: number;
	protocolId?: string;
	protocolName?: string;
	cycleCount?: number;
	efficiency?: number;
	averageCycleTime?: number;
	note?: string;
}

const SESSIONS_STORAGE_KEY = `${SiteConfig.appId}-session-history`;
const USER_ID_KEY = `${SiteConfig.appId}-user-id`;

function getUserId(): string {
	try {
		const existingUserId = localStorage.getItem(USER_ID_KEY);
		if (existingUserId) {
			return existingUserId;
		}

		const newUserId = generateUID();
		localStorage.setItem(USER_ID_KEY, newUserId);
		return newUserId;
	} catch (error) {
		console.error("Erreur lors de la gestion de l'ID utilisateur:", error);
		return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}
}

export const useSessionHistoryClean = () => {
	const [sessions, setSessions] = useState<SessionHistoryEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadSessions = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const localSessions = (getFromLocalStorage<SessionHistoryEntry[]>(SESSIONS_STORAGE_KEY) || []).map(
				(session) => ({
					...session,
					datetime: new Date(session.datetime)
				})
			);
			const userId = getUserId();

			const result = await getAllCrises(userId);

			if (!result.success || !result.data) {
				setSessions(localSessions);
				setError(result.error || "Erreur lors du chargement depuis le serveur");
				return;
			}

			const serverSessions = result.data
				.filter((crisis: SerializableCrisis) => crisis.isBreathingSession)
				.map((crisis: SerializableCrisis) => {
					const datetime = new Date(crisis.datetime);
					// Validate the date
					if (isNaN(datetime.getTime())) {
						console.warn("Invalid date for crisis:", crisis.datetime);
						return null;
					}
					return {
						id: crisis.id || `${datetime.getTime()}`,
						uid: crisis.id || generateUID(),
						datetime,
						duration: parseInt(crisis.duration.replace(/[^\d]/g, "")) || 0,
						protocolId: crisis.protocolId || "",
						protocolName: crisis.protocolName || "Protocole inconnu",
						cycleCount: crisis.cycleCount || 0,
						efficiency: crisis.efficiency || 0,
						averageCycleTime: crisis.averageCycleTime || 0,
						note: crisis.note
					};
				})
				.filter(Boolean); // Remove null entries

			const allSessions = [...localSessions];
			serverSessions.forEach((serverSession) => {
				if (serverSession && !allSessions.find((local) => local.uid === serverSession.uid)) {
					allSessions.push(serverSession);
				}
			});

			allSessions.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

			setSessions(allSessions);
			saveToLocalStorage(SESSIONS_STORAGE_KEY, allSessions);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors du chargement des sessions");
		} finally {
			setIsLoading(false);
		}
	};

	const saveSession = async (sessionData: {
		duration: number;
		protocolId: string;
		protocolName: string;
		cycleCount: number;
		efficiency: number;
		averageCycleTime: number;
		note?: string;
	}) => {
		try {
			const uid = generateUID();
			const userId = getUserId();
			const sessionEntry: SessionHistoryEntry = {
				id: "",
				uid,
				datetime: new Date(),
				duration: sessionData.duration,
				protocolId: sessionData.protocolId,
				protocolName: sessionData.protocolName,
				cycleCount: sessionData.cycleCount,
				efficiency: sessionData.efficiency,
				averageCycleTime: sessionData.averageCycleTime,
				note: sessionData.note
			};

			const currentSessions = getFromLocalStorage<SessionHistoryEntry[]>(SESSIONS_STORAGE_KEY) || [];
			currentSessions.unshift(sessionEntry);
			saveToLocalStorage(SESSIONS_STORAGE_KEY, currentSessions);

			setSessions(currentSessions);

			const breathingSessionData: BreathingSessionData = {
				date: sessionEntry.datetime,
				duration: sessionData.duration,
				protocolId: sessionData.protocolId,
				protocolName: sessionData.protocolName,
				cycleCount: sessionData.cycleCount,
				efficiency: sessionData.efficiency,
				averageCycleTime: sessionData.averageCycleTime,
				note: sessionData.note
			};

			const result = await saveBreathingSession(breathingSessionData, userId);

			if (result.success) {
				await loadSessions();
			} else {
				console.warn("Sauvegarde serveur échouée, session conservée en local:", result.error);
			}

			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
			return false;
		}
	};

	const deleteSession = async (sessionId: string) => {
		try {
			const userId = getUserId();
			const currentSessions = getFromLocalStorage<SessionHistoryEntry[]>(SESSIONS_STORAGE_KEY) || [];
			const updatedSessions = currentSessions.filter(
				(session) => session.uid !== sessionId && session.id !== sessionId
			);
			saveToLocalStorage(SESSIONS_STORAGE_KEY, updatedSessions);

			setSessions(updatedSessions);

			const sessionToDelete = currentSessions.find(
				(session) => session.uid === sessionId || session.id === sessionId
			);

			if (sessionToDelete?.id) {
				const result = await deleteCrisis(userId, sessionToDelete.id);

				if (!result.success) {
					console.warn("Suppression serveur échouée:", result.error);
				}
			}

			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
			return false;
		}
	};

	const updateSessionNote = async (sessionId: string, note: string) => {
		try {
			const currentSessions = getFromLocalStorage<SessionHistoryEntry[]>(SESSIONS_STORAGE_KEY) || [];
			const updatedSessions = currentSessions.map((session) => {
				if (session.uid === sessionId || session.id === sessionId) {
					return { ...session, note };
				}
				return session;
			});

			saveToLocalStorage(SESSIONS_STORAGE_KEY, updatedSessions);
			setSessions(updatedSessions);

			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
			return false;
		}
	};

	const getStats = () => {
		const totalSessions = sessions.length;
		const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
		const averageEfficiency =
			sessions.length > 0
				? sessions.reduce((sum, session) => sum + (session.efficiency || 0), 0) / sessions.length
				: 0;

		return {
			totalSessions,
			totalDuration,
			averageEfficiency,
			currentStreak: 0,
			longestStreak: 0,
			averageDuration: totalSessions > 0 ? totalDuration / totalSessions : 0
		};
	};

	useEffect(() => {
		loadSessions();
	}, []);

	return {
		sessions,
		isLoading,
		error,
		saveSession,
		deleteSession,
		updateSessionNote,
		getStats,
		reloadSessions: loadSessions
	};
};
