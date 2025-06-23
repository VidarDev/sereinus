import { PrismaClient } from "@prisma/client";

import { CrisisDTO } from "@/main/infrastructure/dto/CrisisDTO";

export class CrisisPrismaDao {
	private readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async findAllByUserId(userId: string): Promise<CrisisDTO[]> {
		const data = await this.prisma.crisis.findMany({
			where: {
				userId: userId
			}
		});

		return data.map((crisis) => {
			return new CrisisDTO(crisis.userId, crisis.datetime, crisis.duration, crisis.note ?? undefined);
		});
	}

	async save(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.create({
			data: {
				userId: crisis.userId,
				datetime: crisis.datetime,
				duration: crisis.duration,
				note: crisis.note
			}
		});
	}

	async update(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.update({
			where: {
				userId_datetime: {
					userId: crisis.userId,
					datetime: crisis.datetime
				}
			},
			data: {
				note: crisis.note
			}
		});
	}
}
