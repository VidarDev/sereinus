import { createModule } from "@evyweb/ioctopus";

import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { CryptoUUIDGeneratorService } from "@/main/infrastructure/services/crypto-uuid-generator.service";
import { SystemClockService } from "@/main/infrastructure/services/system-clock.service";
import { DI_SYMBOLS } from "../types";

export const createInfrastructureModule = () => {
	const infrastructureModule = createModule();

	// Services Infrastructure
	infrastructureModule.bind(DI_SYMBOLS.UUIDGenerator).toClass(CryptoUUIDGeneratorService);
	infrastructureModule.bind(DI_SYMBOLS.Clock).toClass(SystemClockService);

	// DAOs
	infrastructureModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);

	// Repositories
	infrastructureModule
		.bind(DI_SYMBOLS.CrisisRepository)
		.toClass(CrisisPrismaRepository, [DI_SYMBOLS.CrisisPrismaDao]);

	return infrastructureModule;
};
