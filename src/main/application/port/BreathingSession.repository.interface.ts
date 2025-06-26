import { BreathingSession } from "@/main/domain/BreathingSession";

export interface BreathingSessionRepository {
	save(userId: string, session: BreathingSession): Promise<void>;
	findById(sessionId: string): Promise<BreathingSession | null>;
	findByUserId(userId: string): Promise<BreathingSession[]>;
	update(session: BreathingSession): Promise<void>;
	delete(sessionId: string): Promise<void>;
}
