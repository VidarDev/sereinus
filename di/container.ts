import { createContainer } from "@evyweb/ioctopus";

import { createApplicationModule } from "@/di/modules/application.module";
import { createBreathingProtocolsModule } from "./modules/breathing-protocols.module";
import { createInfrastructureModule } from "./modules/infrastructure.module";
import { DI_SYMBOLS, DiReturnTypes } from "./types";

const applicationContainer = createContainer();

applicationContainer.load(Symbol("infrastructureModule"), createInfrastructureModule());
applicationContainer.load(Symbol("applicationModule"), createApplicationModule());
applicationContainer.load(Symbol("breathingProtocolsModule"), createBreathingProtocolsModule());

export const getInjection = <K extends keyof typeof DI_SYMBOLS>(symbol: K): DiReturnTypes[K] => {
	return applicationContainer.get<DiReturnTypes[K]>(DI_SYMBOLS[symbol]);
};
