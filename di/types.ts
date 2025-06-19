import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PrismaClient } from "@/main/infrastructure/generated/prisma";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao")
};

export interface DiReturnTypes {
	CrisisPrismaDao: CrisisPrismaDao;
	PrismaClient: PrismaClient;
}
