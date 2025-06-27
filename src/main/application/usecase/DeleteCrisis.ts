import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { Crisis } from "@/main/domain/Crisis";

export class DeleteCrisis<T> {
	private readonly crisisRepository: CrisisRepository;
	private readonly crisisPresenter: Presenter<null, T>;

	constructor(crisisRepository: CrisisRepository, crisisPresenter: Presenter<null, T>) {
		this.crisisRepository = crisisRepository;
		this.crisisPresenter = crisisPresenter;
	}

	public execute = async (userId: string, crisis: Crisis): Promise<T> => {
		try {
			await this.crisisRepository.delete(userId, crisis);

			return this.crisisPresenter.ok();
		} catch (error) {
			return this.crisisPresenter.error((error as Error).message);
		}
	};
}
