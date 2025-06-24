"use server";

import { getInjection } from "@/di/container";

export const save = async (duration: number, id: string) => {
	await getInjection("CrisisController").save(id, new Date(Date.now()), duration);

	return true;
};
