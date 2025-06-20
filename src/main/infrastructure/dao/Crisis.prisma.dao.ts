import { PrismaClient } from "@prisma/client";
import { CrisisDTO } from "@/main/infrastructure/dto/CrisisDTO";

export class CrisisPrismaDao {
	private readonly prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	public async findAllByUserId(userId: string): Promise<CrisisDTO[]> {
		const data = await this.prisma.crisis.findMany({
			where: {
				userId: userId
			}
		});

		return data.map((crisis) => {
			return new CrisisDTO(crisis.userId, crisis.datetime, crisis.note ?? undefined);
		});
	}

	public async save(crisis: CrisisDTO): Promise<void> {
		await this.prisma.crisis.create({
			data: {
				userId: crisis.userId,
				datetime: crisis.datetime,
				note: crisis.note
			}
		});
	}
}
