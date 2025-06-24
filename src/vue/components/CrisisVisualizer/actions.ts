"use server";

import { getInjection } from "@/di/container";
import { Crisis } from "@/main/domain/Crisis";

export const save = async (duration: number, id: string) => {
	const crisis = new Crisis(new Date(), duration);
	await getInjection("CrisisRepository").save(id, crisis);

	return true;
};
