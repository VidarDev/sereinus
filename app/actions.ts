"use server";

import { getInjection } from "../di/container";

export const login = async (username: string, password: string) => {
	const authenticationController = getInjection("AuthenticationController");

	return await authenticationController.login(username, password);
};
