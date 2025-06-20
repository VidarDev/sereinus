import { createModule } from "@evyweb/ioctopus";

import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PrismaClient } from "@prisma/client";

import { DI_SYMBOLS } from "../types";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";

export const createDatabaseModule = () => {
	const databaseModule = createModule();

	databaseModule.bind(DI_SYMBOLS.PrismaClient).toClass(PrismaClient);
	databaseModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);
	databaseModule.bind(DI_SYMBOLS.CrisisRepository).toClass(CrisisPrismaRepository, [DI_SYMBOLS.CrisisPrismaDao]);

	return databaseModule;
};
