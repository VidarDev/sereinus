import { createModule } from "@evyweb/ioctopus";

import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PrismaClient } from "@/main/infrastructure/generated/prisma";

import { DI_SYMBOLS } from "../types";

export const createDatabaseModule = () => {
	const databaseModule = createModule();

	databaseModule.bind(DI_SYMBOLS.PrismaClient).toClass(PrismaClient);
	databaseModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);

	return databaseModule;
};
