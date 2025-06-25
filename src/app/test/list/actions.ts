"use server";

import { getInjection } from "@/di/container";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";

export const get = async (id: string) => {
	const response = await getInjection("CrisisController").getAll(id);

	if (typeof response !== "string") {
		return response.map((crisis: CrisisViewModel) => {
			return {
				...crisis
			};
		});
	}

	return response;
};

export const update = async (id: string, datetime: Date, note: string) => {
	return await getInjection("CrisisController").update(id, datetime, note);
};
