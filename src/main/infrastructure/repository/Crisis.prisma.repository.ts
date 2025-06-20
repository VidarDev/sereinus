import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisDTO } from "@/main/infrastructure/dto/CrisisDTO";
import { Prisma } from "@prisma/client";

export class CrisisPrismaRepository implements CrisisRepository {
	private readonly crisisPrismaDao: CrisisPrismaDao;

	constructor(crisisPrismaDao: CrisisPrismaDao) {
		this.crisisPrismaDao = crisisPrismaDao;
	}

	public async findAllByUserId(userId: string): Promise<Crisis[]> {
		try {
			const crisisDTOs = await this.crisisPrismaDao.findAllByUserId(userId);

			return this.mapAllToCrisis(crisisDTOs);
		} catch (error) {
			console.error("Failed to fetch crises:", error);

			throw new Error("Une erreur est survenue lors de la récupération des crises.");
		}
	}

	private mapAllToCrisis(crisisDTOs: CrisisDTO[]): Crisis[] {
		return crisisDTOs.map((crisisDTO: CrisisDTO) => {
			return new Crisis(crisisDTO.datetime, crisisDTO.duration, crisisDTO.note);
		});
	}

	public async save(userId: string, crisis: Crisis): Promise<void> {
		try {
			const crisisDTO = new CrisisDTO(userId, crisis.datetime, crisis.duration, crisis.note);

			await this.crisisPrismaDao.save(crisisDTO);
		} catch (error) {
			console.error("Failed to save crisis:", error);

			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new Error("Un enregistrement existe déjà pour cette date.");
				}
			} else {
				throw new Error("Une erreur est survenue lors de la sauvegarde.");
			}
		}
	}
}
