import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

export class CrisisController {
	private readonly saveCrisis: SaveCrisis<boolean | string>;
	private readonly getAllCrises: GetAllCrises<CrisisViewModel[] | string>;

	constructor(
		crisisRepository: CrisisRepository,
		actionUiPresenter: ActionUiPresenter,
		crisesUiPresenter: CrisesUiPresenter
	) {
		this.saveCrisis = new SaveCrisis(crisisRepository, actionUiPresenter);
		this.getAllCrises = new GetAllCrises(crisisRepository, crisesUiPresenter);
	}

	async save(userId: string, date: Date, duration: number): Promise<boolean | string> {
		const crisis = new Crisis(date, duration);

		return await this.saveCrisis.execute(userId, crisis);
	}

	async getAll(userId: string): Promise<CrisisViewModel[] | string> {
		return await this.getAllCrises.execute(userId);
	}
}
