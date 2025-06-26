import { PrismaClient } from "@prisma/client";

import { CrisisDTO } from "@/main/infrastructure/dto/Crisis.dto";

export class CrisisPrismaDao {
	private readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async findAllByUserId(userId: string): Promise<CrisisDTO[]> {
		const data = await this.prisma.crisis.findMany({
			where: {
				userId: userId
			},
			orderBy: {
				datetime: "desc"
			}
		});

		return data.map((crisis) => {
			return new CrisisDTO(crisis.userId, crisis.datetime, crisis.duration, crisis.note ?? undefined, {
				id: crisis.id,
				protocolId: crisis.protocolId ?? undefined,
				protocolName: crisis.protocolName ?? undefined,
				cycleCount: crisis.cycleCount ?? undefined,
				efficiency: crisis.efficiency ?? undefined,
				averageCycleTime: crisis.averageCycleTime ?? undefined
			});
		});
	}

	async save(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.create({
			data: {
				id: crisis.id,
				userId: crisis.userId,
				datetime: crisis.datetime,
				duration: crisis.duration,
				note: crisis.note ?? null,
				protocolId: crisis.protocolId ?? null,
				protocolName: crisis.protocolName ?? null,
				cycleCount: crisis.cycleCount ?? null,
				efficiency: crisis.efficiency ?? null,
				averageCycleTime: crisis.averageCycleTime ?? null
			}
		});
	}

	async update(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.update({
			where: {
				id: crisis.id
			},
			data: {
				note: crisis.note ?? null,
				protocolId: crisis.protocolId ?? null,
				protocolName: crisis.protocolName ?? null,
				cycleCount: crisis.cycleCount ?? null,
				efficiency: crisis.efficiency ?? null,
				averageCycleTime: crisis.averageCycleTime ?? null
			}
		});
	}

	async delete(crisisId: string): Promise<void> {
		await this.prisma.crisis.delete({
			where: {
				id: crisisId
			}
		});
	}
}
