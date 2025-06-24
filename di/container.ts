import { createContainer } from "@evyweb/ioctopus";

import { createApplicationModule } from "@/di/modules/application.module";
import { createInfrastructureModule } from "./modules/infrastructure.module";
import { DI_SYMBOLS, DiReturnTypes } from "./types";

const applicationContainer = createContainer();

applicationContainer.load(Symbol("infrastructureModule"), createInfrastructureModule());
applicationContainer.load(Symbol("applicationModule"), createApplicationModule());

export const getInjection = <K extends keyof typeof DI_SYMBOLS, I = unknown, O = unknown>(
	symbol: K
): DiReturnTypes<I, O>[K] => {
	return applicationContainer.get<DiReturnTypes<I, O>[K]>(DI_SYMBOLS[symbol]);
};
