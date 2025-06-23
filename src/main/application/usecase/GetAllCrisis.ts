import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { Crisis } from "@/main/domain/Crisis";

export class GetAllCrisis<T> {
	private readonly crisisRepository: CrisisRepository;
	private readonly crisesPresenter: Presenter<Crisis[], T>;

	constructor(crisisRepository: CrisisRepository, crisisPresenter: Presenter<Crisis[], T>) {
		this.crisisRepository = crisisRepository;
		this.crisesPresenter = crisisPresenter;
	}

	async execute(userId: string): Promise<T> {
		try {
			const crisis: Crisis[] = await this.crisisRepository.findAllByUserId(userId);

			return this.crisesPresenter.ok(crisis);
		} catch (error) {
			return this.crisesPresenter.error((error as Error).message);
		}
	}
}
