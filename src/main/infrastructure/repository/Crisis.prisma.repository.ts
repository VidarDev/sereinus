import { Prisma } from "@prisma/client";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisDTO } from "@/main/infrastructure/dto/Crisis.dto";

export class CrisisPrismaRepository implements CrisisRepository {
	private readonly crisisPrismaDao: CrisisPrismaDao;

	constructor(crisisPrismaDao: CrisisPrismaDao) {
		this.crisisPrismaDao = crisisPrismaDao;
	}

	async findAllByUserId(userId: string): Promise<Crisis[]> {
		try {
			return await this.findAllInDatabase(userId);
		} catch (error) {
			console.error("Failed to fetch crises:", error, { userId });

			throw new Error("Une erreur est survenue lors de la récupération des crises.");
		}
	}

	private async findAllInDatabase(userId: string): Promise<Crisis[]> {
		const crisisDTOs = await this.crisisPrismaDao.findAllByUserId(userId);

		return this.mapAllToCrisis(crisisDTOs);
	}

	private mapAllToCrisis(crisisDTOs: CrisisDTO[]): Crisis[] {
		return crisisDTOs.map((crisisDTO: CrisisDTO) => {
			return new Crisis(
				crisisDTO.datetime,
				crisisDTO.duration,
				crisisDTO.note,
				crisisDTO.protocolId,
				crisisDTO.protocolName,
				crisisDTO.cycleCount,
				crisisDTO.efficiency,
				crisisDTO.averageCycleTime
			);
		});
	}

	async save(userId: string, crisis: Crisis): Promise<void> {
		try {
			await this.saveToDatabase(userId, crisis);
		} catch (error) {
			this.handleSaveError(error);
		}
	}

	private async saveToDatabase(userId: string, crisis: Crisis): Promise<void> {
		const crisisDTO = new CrisisDTO(
			userId,
			crisis.datetime,
			crisis.duration,
			crisis.note,
			crisis.protocolId,
			crisis.protocolName,
			crisis.cycleCount,
			crisis.efficiency,
			crisis.averageCycleTime
		);

		await this.crisisPrismaDao.save(crisisDTO);
	}

	private handleSaveError(error: unknown): void {
		console.error("Failed to save crisis:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new Error("Un enregistrement existe déjà pour cette date.");
		} else {
			throw new Error("Une erreur est survenue lors de la sauvegarde.");
		}
	}

	async update(userId: string, crisis: Crisis): Promise<void> {
		try {
			await this.updateInDatabase(userId, crisis);
		} catch (error) {
			this.handleUpdateError(error);
		}
	}

	private async updateInDatabase(userId: string, crisis: Crisis): Promise<void> {
		const crisisDTO = new CrisisDTO(
			userId,
			crisis.datetime,
			crisis.duration,
			crisis.note,
			crisis.protocolId,
			crisis.protocolName,
			crisis.cycleCount,
			crisis.efficiency,
			crisis.averageCycleTime
		);

		await this.crisisPrismaDao.update(crisisDTO);
	}

	private handleUpdateError(error: unknown): void {
		console.error("Failed to update crisis:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw new Error("Cet enregistrement n'existe pas.");
		} else {
			throw new Error("Une erreur est survenue lors de la mise à jour.");
		}
	}

	async delete(userId: string, crisis: Crisis): Promise<void> {
		try {
			await this.deleteFromDatabase(userId, crisis);
		} catch (error) {
			this.handleDeleteError(error);
		}
	}

	private async deleteFromDatabase(userId: string, crisis: Crisis): Promise<void> {
		const crisisDTO = new CrisisDTO(userId, crisis.datetime, crisis.duration);

		await this.crisisPrismaDao.delete(crisisDTO);
	}

	private handleDeleteError(error: unknown): void {
		console.error("Failed to delete crisis:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw new Error("Cet enregistrement n'existe pas.");
		} else {
			throw new Error("Une erreur est survenue lors de la suppression.");
		}
	}
}
