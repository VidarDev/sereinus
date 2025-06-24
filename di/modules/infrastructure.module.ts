import { createModule } from "@evyweb/ioctopus";
import { PrismaClient } from "@prisma/client";

import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { DI_SYMBOLS } from "../types";

export const createInfrastructureModule = () => {
	const infrastructureModule = createModule();

	infrastructureModule.bind(DI_SYMBOLS.PrismaClient).toClass(PrismaClient);
	infrastructureModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);
	infrastructureModule
		.bind(DI_SYMBOLS.CrisisRepository)
		.toClass(CrisisPrismaRepository, [DI_SYMBOLS.CrisisPrismaDao]);

	return infrastructureModule;
};
