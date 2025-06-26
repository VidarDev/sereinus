import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { DeleteCrisis } from "@/main/application/usecase/DeleteCrisis";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { UpdateCrisis } from "@/main/application/usecase/UpdateCrisis";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

export class CrisisController {
	private readonly saveCrisis: SaveCrisis<boolean | string>;
	private readonly getAllCrises: GetAllCrises<CrisisViewModel[] | string>;
	private readonly updateCrisis: UpdateCrisis<boolean | string>;
	private readonly deleteCrisis: DeleteCrisis<boolean | string>;

	constructor(
		crisisRepository: CrisisRepository,
		crisesUiPresenter: CrisesUiPresenter,
		actionUiPresenter: ActionUiPresenter
	) {
		this.getAllCrises = new GetAllCrises(crisisRepository, crisesUiPresenter);
		this.saveCrisis = new SaveCrisis(crisisRepository, actionUiPresenter);
		this.updateCrisis = new UpdateCrisis(crisisRepository, actionUiPresenter);
		this.deleteCrisis = new DeleteCrisis(crisisRepository, actionUiPresenter);
	}

	async save(userId: string, date: Date, duration: number, note?: string): Promise<boolean | string> {
		const crisis = new Crisis(date, duration, note);

		return await this.saveCrisis.execute(userId, crisis);
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
		const crisis = new Crisis(
			sessionData.date,
			sessionData.duration,
			sessionData.note,
			sessionData.protocolId,
			sessionData.protocolName,
			sessionData.cycleCount,
			sessionData.efficiency,
			sessionData.averageCycleTime
		);

		return await this.saveCrisis.execute(userId, crisis);
	}

	async getAll(userId: string): Promise<CrisisViewModel[] | string> {
		return await this.getAllCrises.execute(userId);
	}

	async update(userId: string, datetime: Date, note: string): Promise<boolean | string> {
		const crisis = new Crisis(datetime, -1, note);

		return await this.updateCrisis.execute(userId, crisis);
	}

	async delete(userId: string, datetime: Date): Promise<boolean | string> {
		const crisis = new Crisis(datetime, -1);

		return await this.deleteCrisis.execute(userId, crisis);
	}
}
