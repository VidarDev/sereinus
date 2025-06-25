import { BreathingProtocol } from "@/main/domain/BreathingProtocol";

export interface BreathingProtocolRepository {
	findAll(): Promise<BreathingProtocol[]>;
	findById(id: string): Promise<BreathingProtocol | null>;
	findByCategory(category: string): Promise<BreathingProtocol[]>;
}
