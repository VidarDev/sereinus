import { getInjection } from "@/di/container";

export const get = (id: string) => {
	return getInjection("CrisisController").getAll(id);
};
