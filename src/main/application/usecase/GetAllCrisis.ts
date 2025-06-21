import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { Crisis } from "@/main/domain/Crisis";

export class GetAllCrisis<T> {
	private readonly crisisRepository: CrisisRepository;
	private readonly crisisPresenter: Presenter<Crisis[], T>;

	constructor(crisisRepository: CrisisRepository, crisisPresenter: Presenter<Crisis[], T>) {
		this.crisisRepository = crisisRepository;
		this.crisisPresenter = crisisPresenter;
	}

	public async execute(userId: string): Promise<T> {
		try {
			const crisis: Crisis[] = await this.crisisRepository.findAllByUserId(userId);

			return this.crisisPresenter.ok(crisis);
		} catch (error) {
			return this.crisisPresenter.error((error as Error).message);
		}
	}
}
