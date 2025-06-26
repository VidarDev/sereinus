import { createModule } from "@evyweb/ioctopus";
import { PrismaClient } from "@prisma/client";

import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { BreathingProtocolMemoryRepository } from "@/main/infrastructure/repository/BreathingProtocol.memory.repository";
import { BreathingSessionMemoryRepository } from "@/main/infrastructure/repository/BreathingSession.memory.repository";
import { CrisisPrismaRepository } from "@/main/infrastructure/repository/Crisis.prisma.repository";
import { DI_SYMBOLS } from "../types";

export const createInfrastructureModule = () => {
	const infrastructureModule = createModule();

	// Repositories
	infrastructureModule
		.bind(DI_SYMBOLS.CrisisRepository)
		.toClass(CrisisPrismaRepository, [DI_SYMBOLS.CrisisPrismaDao]);

	infrastructureModule.bind(DI_SYMBOLS.BreathingProtocolRepository).toClass(BreathingProtocolMemoryRepository);
	infrastructureModule.bind(DI_SYMBOLS.BreathingSessionRepository).toClass(BreathingSessionMemoryRepository);

	// DAOs
	infrastructureModule.bind(DI_SYMBOLS.CrisisPrismaDao).toClass(CrisisPrismaDao, [DI_SYMBOLS.PrismaClient]);
	infrastructureModule.bind(DI_SYMBOLS.PrismaClient).toValue(new PrismaClient());

	return infrastructureModule;
};
