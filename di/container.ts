import { createContainer } from "@evyweb/ioctopus";

import { createDatabaseModule } from "./modules/database.module";
import { DI_SYMBOLS, DiReturnTypes } from "./types";

const applicationContainer = createContainer();

applicationContainer.load(Symbol("databaseModule"), createDatabaseModule());

export const getInjection = <K extends keyof typeof DI_SYMBOLS>(symbol: K): DiReturnTypes[K] => {
	return applicationContainer.get<DiReturnTypes[K]>(DI_SYMBOLS[symbol]);
};
