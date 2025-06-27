"use server";

import { appContainer } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { BreathingSessionData } from "@/vue/types/breathingSession.types";

export const getAllCrises = async (userId = "user-id") => {
	const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
	const response = await crisisController.getAll(userId);

	if (typeof response === "string") {
		return {
			success: false,
			error: response
		};
	}

	const serializedResult = response.map(serializeCrisis);

	return { success: true, data: serializedResult };
};

const serializeCrisis = (crisis: CrisisViewModel): SerializableCrisis => {
	return {
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
};

export const saveBreathingSession = async (sessionData: BreathingSessionData, userId = "user-id") => {
	const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
	const response = await crisisController.saveBreathingSession(userId, sessionData);

	if (typeof response === "string") {
		return {
			success: false,
			error: response
		};
	}

	return { success: true };
};

export async function updateCrisis(userId: string, datetime: Date, note: string) {
	const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
	const response = await crisisController.update(userId, datetime, note);

	if (typeof response === "string") {
		return {
			success: false,
			error: response
		};
	}

	return { success: true };
}

export async function deleteCrisis(userId: string, datetime: Date) {
	const crisisController = appContainer.get<CrisisController>(DI_SYMBOLS.CrisisController);
	const response = await crisisController.delete(userId, datetime);

	if (typeof response === "string") {
		return {
			success: false,
			error: response
		};
	}

	return { success: true };
}

export interface SerializableCrisis {
	formatedDate: string;
	datetime: string;
	time: string;
	duration: string;
	note?: string;
	protocolId?: string;
	protocolName?: string;
	cycleCount?: number;
	efficiency?: number;
	averageCycleTime?: number;
	isBreathingSession: boolean;
	isSimpleCrisis: boolean;
}
