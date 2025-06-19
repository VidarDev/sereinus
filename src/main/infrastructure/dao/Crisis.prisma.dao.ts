import { PrismaClient } from "@/main/infrastructure/generated/prisma";

export class CrisisPrismaDao {
	private readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	public async findAllByUserId(userId: string) {
		const test = await this.prisma.crisis.findMany({
			where: {
				userId: userId
			}
		});

		return test;
	}
}
