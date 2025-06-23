import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { Crisis } from "@/main/domain/Crisis";

export class UpdateCrisis<T> {
	private readonly crisisRepository: CrisisRepository;
	private readonly crisisPresenter: Presenter<Crisis, T>;

	constructor(crisisRepository: CrisisRepository, crisisPresenter: Presenter<Crisis, T>) {
		this.crisisRepository = crisisRepository;
		this.crisisPresenter = crisisPresenter;
	}

	async execute(userId: string, crisis: Crisis): Promise<T> {
		try {
			await this.crisisRepository.update(userId, crisis);

			return this.crisisPresenter.ok(crisis);
		} catch (error) {
			return this.crisisPresenter.error((error as Error).message);
		}
	}
}
