import { createContainer } from "@evyweb/ioctopus";
import { PrismaClient } from "@prisma/client";

import { createApplicationModule } from "./modules/application.module";
import { createBreathingProtocolsModule } from "./modules/breathing-protocols.module";
import { createInfrastructureModule } from "./modules/infrastructure.module";
import { DI_SYMBOLS, DiReturnTypes } from "./types";

const appContainer = createContainer();

appContainer.bind(DI_SYMBOLS.PrismaClient).toClass(PrismaClient);

appContainer.load(Symbol("infrastructureModule"), createInfrastructureModule());

appContainer.load(Symbol("breathingProtocolsModule"), createBreathingProtocolsModule());
appContainer.load(Symbol("applicationModule"), createApplicationModule());

export const getInjection = <K extends keyof DiReturnTypes>(symbol: K): DiReturnTypes[K] => {
	return appContainer.get<DiReturnTypes[K]>(DI_SYMBOLS[symbol]);
};

export function getInjectionBySymbol<T>(symbol: symbol): T {
	return appContainer.get<T>(symbol);
}

export { appContainer };
