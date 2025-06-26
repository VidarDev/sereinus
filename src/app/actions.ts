"use server";

import { appContainer } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";

export interface BreathingSessionData {
	date: Date;
	duration: number;
	protocolId: string;
	protocolName: string;
	cycleCount: number;
	efficiency: number;
	averageCycleTime: number;
	note?: string;
}

export interface SerializableCrisis {
	id: string | undefined;
	formatedDate: string;
	datetime: string;
	time: string;
	duration: string;
	note: string | undefined;
	protocolId: string | undefined;
	protocolName: string | undefined;
	cycleCount: number | undefined;
	efficiency: number | undefined;
	averageCycleTime: number | undefined;
	isBreathingSession: boolean;
	isSimpleCrisis: boolean;
}

function serializeCrisis(crisis: CrisisViewModel): SerializableCrisis {
	return {
		id: crisis.id,
		formatedDate: crisis.formatedDate,
		datetime: crisis.datetime.toISOString(),
		time: crisis.time,
		duration: crisis.duration,
		note: crisis.note,
		protocolId: crisis.protocolId,
		protocolName: crisis.protocolName,
		cycleCount: crisis.cycleCount,
		efficiency: crisis.efficiency,
		averageCycleTime: crisis.averageCycleTime,
		isBreathingSession: crisis.isBreathingSession,
		isSimpleCrisis: crisis.isSimpleCrisis
	};
}

export async function getAllCrises(userId = "user-id") {
	try {
		const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
		const result = await crisisController.getAll(userId);

		if (typeof result === "string") {
			throw new Error(result);
		}

		const serializedResult = Array.isArray(result) ? result.map(serializeCrisis) : [];

		return { success: true, data: serializedResult };
	} catch (error) {
		console.error("Error in getAllCrises:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erreur lors du chargement des crises"
		};
	}
}

export async function saveBreathingSession(sessionData: BreathingSessionData, userId = "user-id") {
	try {
		const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
		const result = await crisisController.saveBreathingSession(userId, sessionData);

		if (typeof result === "string") {
			throw new Error(result);
		}

		return { success: true, data: result };
	} catch (error) {
		console.error("Error in saveBreathingSession:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erreur lors de la sauvegarde"
		};
	}
}

export async function updateCrisis(userId: string, crisisId: string, note: string) {
	try {
		const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
		const result = await crisisController.update(userId, crisisId, note);

		if (typeof result === "string") {
			throw new Error(result);
		}

		return { success: true, data: result };
	} catch (error) {
		console.error("Error in updateCrisis:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erreur lors de la mise à jour"
		};
	}
}

export async function deleteCrisis(userId: string, crisisId: string) {
	try {
		const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
		const result = await crisisController.delete(userId, crisisId);

		if (typeof result === "string") {
			throw new Error(result);
		}

		return { success: true, data: result };
	} catch (error) {
		console.error("Error in deleteCrisis:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Erreur lors de la suppression"
		};
	}
}
