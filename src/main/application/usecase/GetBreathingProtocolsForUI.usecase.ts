import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import { BreathingProtocolViewModel } from "@/main/presentation/dto/BreathingProtocol.viewmodel";

export interface GetBreathingProtocolsForUIRequest {
	category?: string;
}

export class GetBreathingProtocolsForUI<T> {
	private readonly protocolRepository: BreathingProtocolRepository;
	private readonly presenter: Presenter<BreathingProtocolViewModel[], T>;

	constructor(
		protocolRepository: BreathingProtocolRepository,
		presenter: Presenter<BreathingProtocolViewModel[], T>
	) {
		this.protocolRepository = protocolRepository;
		this.presenter = presenter;
	}

	async execute(request: GetBreathingProtocolsForUIRequest = {}): Promise<T> {
		try {
			let protocols: BreathingProtocol[];

			if (request.category) {
				protocols = await this.protocolRepository.findByCategory(request.category);
			} else {
				protocols = await this.protocolRepository.findAll();
			}

			const viewModels = protocols.map(this.transformToViewModel);

			return this.presenter.ok(viewModels);
		} catch (error) {
			return this.presenter.error((error as Error).message);
		}
	}

	private transformToViewModel(protocol: BreathingProtocol): BreathingProtocolViewModel {
		return {
			id: protocol.id,
			name: protocol.name,
			description: protocol.description,
			phases: {
				inhale: protocol.phases.inhale,
				exhale: protocol.phases.exhale,
				...(protocol.phases.hold1 && { hold1: protocol.phases.hold1 }),
				...(protocol.phases.hold2 && { hold2: protocol.phases.hold2 })
			},
			totalCycleDuration: protocol.totalCycleDuration,
			isScientificallyValidated: protocol.isScientificallyValidated
		};
	}
}
