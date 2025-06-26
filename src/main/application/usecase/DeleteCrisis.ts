import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";

export class DeleteCrisis<T> {
	private readonly crisisRepository: CrisisRepository;

	constructor(crisisRepository: CrisisRepository) {
		this.crisisRepository = crisisRepository;
	}

	public execute = async (userId: string, crisisId: string): Promise<T> => {
		try {
			const existingCrises = await this.crisisRepository.findAllByUserId(userId);
			const crisisExists = existingCrises.some((crisis) => crisis.id === crisisId);

			if (!crisisExists) {
				return "Crise non trouvée" as T;
			}

			await this.crisisRepository.delete(userId, crisisId);
			return true as T;
		} catch (error) {
			console.error("Error in DeleteCrisis use case:", error);
			return "Une erreur est survenue lors de la suppression de la crise." as T;
		}
	};
}
