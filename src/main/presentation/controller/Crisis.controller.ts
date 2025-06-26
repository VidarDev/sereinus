import { DeleteCrisis } from "@/main/application/usecase/DeleteCrisis";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { UpdateCrisis } from "@/main/application/usecase/UpdateCrisis";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";

export class CrisisController {
	private readonly saveCrisisUseCase: SaveCrisis<boolean | string>;
	private readonly getAllCrisesUseCase: GetAllCrises<CrisisViewModel[] | string>;
	private readonly updateCrisisUseCase: UpdateCrisis<boolean | string>;
	private readonly deleteCrisisUseCase: DeleteCrisis<boolean | string>;

	constructor(
		getAllCrises: GetAllCrises<CrisisViewModel[] | string>,
		saveCrisis: SaveCrisis<boolean | string>,
		updateCrisis: UpdateCrisis<boolean | string>,
		deleteCrisis: DeleteCrisis<boolean | string>
	) {
		this.getAllCrisesUseCase = getAllCrises;
		this.saveCrisisUseCase = saveCrisis;
		this.updateCrisisUseCase = updateCrisis;
		this.deleteCrisisUseCase = deleteCrisis;
	}

	async save(userId: string, date: Date, duration: number, note?: string): Promise<boolean | string> {
		const crisis = new Crisis(date, duration, note);
		return await this.saveCrisisUseCase.execute(userId, crisis);
	}

	async saveBreathingSession(
		userId: string,
		sessionData: {
			date: Date;
			duration: number;
			protocolId: string;
			protocolName: string;
			cycleCount: number;
			efficiency: number;
			averageCycleTime: number;
			note?: string;
		}
	): Promise<boolean | string> {
		const crisis = new Crisis(sessionData.date, sessionData.duration, sessionData.note, {
			protocolId: sessionData.protocolId,
			protocolName: sessionData.protocolName,
			cycleCount: sessionData.cycleCount,
			efficiency: sessionData.efficiency,
			averageCycleTime: sessionData.averageCycleTime
		});

		return await this.saveCrisisUseCase.execute(userId, crisis);
	}

	async getAll(userId: string): Promise<CrisisViewModel[] | string> {
		return await this.getAllCrisesUseCase.execute(userId);
	}

	async update(userId: string, crisisId: string, note: string): Promise<boolean | string> {
		const existingCrises = await this.getAllCrisesUseCase.execute(userId);

		if (typeof existingCrises === "string") {
			return existingCrises;
		}

		const existingCrisis = existingCrises.find((c: CrisisViewModel) => c.id === crisisId);
		if (!existingCrisis) {
			return "Crise non trouvée";
		}

		const crisis = new Crisis(existingCrisis.datetime, parseInt(existingCrisis.duration, 10), note, {
			id: crisisId,
			protocolId: existingCrisis.protocolId || undefined,
			protocolName: existingCrisis.protocolName || undefined,
			cycleCount: existingCrisis.cycleCount || undefined,
			efficiency: existingCrisis.efficiency || undefined,
			averageCycleTime: existingCrisis.averageCycleTime || undefined
		});

		return await this.updateCrisisUseCase.execute(userId, crisis);
	}

	async delete(userId: string, crisisId: string): Promise<boolean | string> {
		return await this.deleteCrisisUseCase.execute(userId, crisisId);
	}
}
