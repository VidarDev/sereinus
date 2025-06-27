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
				datetime: "asc"
			}
		});

		return data.map((crisis) => {
			return new CrisisDTO(
				crisis.userId,
				crisis.datetime,
				crisis.duration,
				crisis.note ?? undefined,
				crisis.protocolId ?? undefined,
				crisis.protocolName ?? undefined,
				crisis.cycleCount ?? undefined,
				crisis.efficiency ?? undefined,
				crisis.averageCycleTime ?? undefined
			);
		});
	}

	async save(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.create({
			data: {
				userId: crisis.userId,
				datetime: crisis.datetime,
				duration: crisis.duration,
				note: crisis.note,
				protocolId: crisis.protocolId,
				protocolName: crisis.protocolName,
				cycleCount: crisis.cycleCount,
				efficiency: crisis.efficiency,
				averageCycleTime: crisis.averageCycleTime
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
				note: crisis.note,
				protocolId: crisis.protocolId,
				protocolName: crisis.protocolName,
				cycleCount: crisis.cycleCount,
				efficiency: crisis.efficiency,
				averageCycleTime: crisis.averageCycleTime
			}
		});
	}

	async delete(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.delete({
			where: {
				userId_datetime: {
					userId: crisis.userId,
					datetime: crisis.datetime
				}
			}
		});
	}
}
