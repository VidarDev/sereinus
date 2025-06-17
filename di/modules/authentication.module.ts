import { createModule } from "@evyweb/ioctopus";

import { LogIn } from "@/main/application/usecase/LogIn.usecase";
import { AuthenticationController } from "@/main/presentation/controller/Authentication.controller";

import { DI_SYMBOLS } from "../types";

export const createAuthenticationModule = () => {
	const authenticationModule = createModule();

	authenticationModule
		.bind(DI_SYMBOLS.AuthenticationController)
		.toClass(AuthenticationController, [DI_SYMBOLS.LogIn]);

	authenticationModule.bind(DI_SYMBOLS.LogIn).toClass(LogIn);

	return authenticationModule;
};
