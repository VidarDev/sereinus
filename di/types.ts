import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PrismaClient } from "@prisma/client";
import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository")
};

export interface DiReturnTypes {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
}
