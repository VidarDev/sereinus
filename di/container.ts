import { createContainer } from "@evyweb/ioctopus";
import { PrismaClient } from "@prisma/client";

import { createApplicationModule } from "@/di/modules/application.module";
import { createInfrastructureModule } from "./modules/infrastructure.module";
import { createPresentationModule } from "./modules/presentation.module";
import { DI_SYMBOLS, DiReturnTypes } from "./types";

const appContainer = createContainer();

appContainer.bind(DI_SYMBOLS.PrismaClient).toClass(PrismaClient);

appContainer.load(Symbol("presentationModule"), createPresentationModule());
appContainer.load(Symbol("applicationModule"), createApplicationModule());
appContainer.load(Symbol("infrastructureModule"), createInfrastructureModule());

export const getInjection = <K extends keyof DiReturnTypes>(symbol: K): DiReturnTypes[K] => {
	return appContainer.get<DiReturnTypes[K]>(DI_SYMBOLS[symbol]);
};

export { appContainer };
