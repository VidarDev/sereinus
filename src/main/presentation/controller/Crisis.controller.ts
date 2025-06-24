import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ResponseViewModel } from "@/main/presentation/dto/Response.viewmodel";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

export class CrisisController {
	private readonly saveCrisis: SaveCrisis<ResponseViewModel<CrisisViewModel>>;
	private readonly getAllCrises: GetAllCrises<ResponseViewModel<CrisisViewModel[]>>;

	constructor(
		crisisRepository: CrisisRepository,
		crisisUiPresenter: CrisisUiPresenter,
		crisesUiPresenter: CrisesUiPresenter
	) {
		this.saveCrisis = new SaveCrisis(crisisRepository, crisisUiPresenter);
		this.getAllCrises = new GetAllCrises(crisisRepository, crisesUiPresenter);
	}

	async save(userId: string, date: Date, duration: number): Promise<ResponseViewModel<CrisisViewModel>> {
		const crisis = new Crisis(date, duration);

		return this.saveCrisis.execute(userId, crisis);
	}

	async getAll(userId: string): Promise<ResponseViewModel<CrisisViewModel[]>> {
		return this.getAllCrises.execute(userId);
	}
}
