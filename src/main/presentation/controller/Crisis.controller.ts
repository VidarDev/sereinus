import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";
import { ResponseViewModel } from "@/main/presentation/dto/Response.viewmodel";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

export class CrisisController {
	private readonly saveCrisis: SaveCrisis<ResponseViewModel<CrisisViewModel>>;

	constructor(crisisRepository: CrisisRepository, crisisUiPresenter: CrisisUiPresenter) {
		this.saveCrisis = new SaveCrisis(crisisRepository, crisisUiPresenter);
	}

	async save(userId: string, date: Date, duration: number): Promise<ResponseViewModel<CrisisViewModel>> {
		const crisis = new Crisis(date, duration);

		return this.saveCrisis.execute(userId, crisis);
	}
}
