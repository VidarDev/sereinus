import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingProtocol } from "@/main/domain/BreathingProtocol";

export interface GetBreathingProtocolsRequest {
	category?: string;
}

export class GetBreathingProtocols<T> {
	private readonly protocolRepository: BreathingProtocolRepository;
	private readonly presenter: Presenter<BreathingProtocol[], T>;

	constructor(protocolRepository: BreathingProtocolRepository, presenter: Presenter<BreathingProtocol[], T>) {
		this.protocolRepository = protocolRepository;
		this.presenter = presenter;
	}

	async execute(request: GetBreathingProtocolsRequest = {}): Promise<T> {
		try {
			let protocols: BreathingProtocol[];

			if (request.category) {
				protocols = await this.protocolRepository.findByCategory(request.category);
			} else {
				protocols = await this.protocolRepository.findAll();
			}

			return this.presenter.ok(protocols);
		} catch (error) {
			return this.presenter.error((error as Error).message);
		}
	}
}
