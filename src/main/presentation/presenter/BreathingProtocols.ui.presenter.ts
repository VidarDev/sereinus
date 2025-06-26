import { Presenter } from "@/main/application/port/Presenter.interface";
import { BreathingProtocol } from "@/main/domain/BreathingProtocol";

// Types de présentation pour la vue
export interface BreathingProtocolViewModel {
	id: string;
	name: string;
	description: string;
	phases: {
		inhale?: number;
		hold1?: number;
		exhale?: number;
		hold2?: number;
	};
	totalCycleDuration: number;
	isScientificallyValidated: boolean;
}

export interface BreathingProtocolsResponse {
	success: boolean;
	data?: BreathingProtocolViewModel[];
	error?: string;
	recommendations?: Record<string, BreathingProtocolViewModel[]>;
}

export class BreathingProtocolsUIPresenter implements Presenter<BreathingProtocol[], BreathingProtocolsResponse> {
	ok(protocols: BreathingProtocol[]): BreathingProtocolsResponse {
		const viewModels = protocols.map(this.toViewModel);

		return {
			success: true,
			data: viewModels,
			recommendations: this.categorizeProtocols(viewModels)
		};
	}

	error(message: string): BreathingProtocolsResponse {
		return {
			success: false,
			error: message
		};
	}

	private toViewModel(protocol: BreathingProtocol): BreathingProtocolViewModel {
		return {
			id: protocol.id,
			name: protocol.name,
			description: protocol.description,
			phases: { ...protocol.phases },
			totalCycleDuration: protocol.totalCycleDuration,
			isScientificallyValidated: protocol.isScientificallyValidated
		};
	}

	private categorizeProtocols(protocols: BreathingProtocolViewModel[]): Record<string, BreathingProtocolViewModel[]> {
		const categories: Record<string, string[]> = {
			ACUTE_ANXIETY: ["box-breathing", "technique-478"],
			DAILY_PRACTICE: ["coherent-breathing", "box-breathing"],
			SLEEP: ["technique-478", "extended-exhale"]
		};

		const recommendations: Record<string, BreathingProtocolViewModel[]> = {};

		Object.entries(categories).forEach(([category, protocolIds]) => {
			recommendations[category] = protocols.filter((p) => protocolIds.includes(p.id));
		});

		return recommendations;
	}
}
