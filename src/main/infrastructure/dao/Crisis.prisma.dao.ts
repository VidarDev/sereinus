import { PrismaClient } from "@/main/infrastructure/generated/prisma";

export class CrisisPrismaDao {
	private readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}
}
