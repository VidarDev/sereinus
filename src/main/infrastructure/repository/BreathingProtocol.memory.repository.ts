import { BreathingProtocolRepository } from "@/main/application/port/BreathingProtocol.repository.interface";
import { BreathingProtocol } from "@/main/domain/BreathingProtocol";

export class BreathingProtocolMemoryRepository implements BreathingProtocolRepository {
	private readonly protocols = new Map<string, BreathingProtocol>();
	private readonly categoryMap = new Map<string, string[]>();

	constructor() {
		this.initializeProtocols();
		this.initializeCategories();
	}

	async findAll(): Promise<BreathingProtocol[]> {
		return Array.from(this.protocols.values());
	}

	async findById(id: string): Promise<BreathingProtocol | null> {
		return this.protocols.get(id) || null;
	}

	async findByCategory(category: string): Promise<BreathingProtocol[]> {
		const protocolIds = this.categoryMap.get(category) || [];
		return protocolIds
			.map((id) => this.protocols.get(id))
			.filter((protocol): protocol is BreathingProtocol => protocol !== undefined);
	}

	private initializeProtocols(): void {
		// Protocoles scientifiquement validés
		const protocols = [
			new BreathingProtocol(
				"box-breathing",
				"Box Breathing (4-4-4-4)",
				"Technique de respiration carrée utilisée par les forces spéciales pour réduire le stress et améliorer la concentration.",
				{ inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
				true
			),
			new BreathingProtocol(
				"technique-478",
				"Technique 4-7-8",
				"Méthode développée par le Dr. Andrew Weil, particulièrement efficace pour l'endormissement et la réduction de l'anxiété.",
				{ inhale: 4, hold1: 7, exhale: 8 },
				true
			),
			new BreathingProtocol(
				"coherent-breathing",
				"Respiration Cohérente (5-5)",
				"Respiration à 5 cycles par minute, optimale pour la variabilité cardiaque et l'équilibre du système nerveux autonome.",
				{ inhale: 5, exhale: 5 },
				true
			),
			new BreathingProtocol(
				"wim-hof",
				"Méthode Wim Hof",
				"Technique de respiration intense basée sur l'hyperventilation contrôlée suivie d'une rétention de souffle.",
				{ inhale: 2, exhale: 1, hold2: 15 },
				true
			),
			new BreathingProtocol(
				"triangle-breathing",
				"Respiration Triangle (4-4-4)",
				"Technique simple en trois phases, idéale pour les débutants et la relaxation rapide.",
				{ inhale: 4, hold1: 4, exhale: 4 },
				true
			),
			new BreathingProtocol(
				"extended-exhale",
				"Expiration Prolongée (4-8)",
				"Technique axée sur l'expiration longue pour activer le système nerveux parasympathique.",
				{ inhale: 4, exhale: 8 },
				true
			)
		];

		protocols.forEach((protocol) => {
			this.protocols.set(protocol.id, protocol);
		});
	}

	private initializeCategories(): void {
		// Catégorisation par objectif thérapeutique
		this.categoryMap.set("ACUTE_ANXIETY", ["box-breathing", "technique-478"]);
		this.categoryMap.set("RELAXATION", ["technique-478", "coherent-breathing", "extended-exhale"]);
		this.categoryMap.set("MEDITATION", ["coherent-breathing", "box-breathing"]);
		this.categoryMap.set("BEGINNER", ["coherent-breathing", "triangle-breathing", "box-breathing"]);
		this.categoryMap.set("DAILY_PRACTICE", ["coherent-breathing", "box-breathing"]);
		this.categoryMap.set("ENERGY", ["wim-hof"]);
		this.categoryMap.set("SLEEP", ["technique-478", "extended-exhale"]);
	}
}
