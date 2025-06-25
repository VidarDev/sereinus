import { BreathingSessionRepository } from "@/main/application/port/BreathingSession.repository.interface";
import { BreathingSession } from "@/main/domain/BreathingSession";

export class BreathingSessionMemoryRepository implements BreathingSessionRepository {
	private readonly sessions = new Map<string, BreathingSession>();
	private readonly userSessions = new Map<string, string[]>();

	async save(userId: string, session: BreathingSession): Promise<void> {
		// Générer un ID pour la session si elle n'en a pas
		const sessionId = session.id || this.generateSessionId();

		// Stocker la session
		this.sessions.set(sessionId, session);

		// Associer la session à l'utilisateur
		const userSessionIds = this.userSessions.get(userId) || [];
		if (!userSessionIds.includes(sessionId)) {
			userSessionIds.push(sessionId);
			this.userSessions.set(userId, userSessionIds);
		}
	}

	async findById(sessionId: string): Promise<BreathingSession | null> {
		return this.sessions.get(sessionId) || null;
	}

	async findByUserId(userId: string): Promise<BreathingSession[]> {
		const sessionIds = this.userSessions.get(userId) || [];
		const sessions: BreathingSession[] = [];

		for (const sessionId of sessionIds) {
			const session = this.sessions.get(sessionId);
			if (session) {
				sessions.push(session);
			}
		}

		return sessions;
	}

	async update(session: BreathingSession): Promise<void> {
		// Mettre à jour la session existante
		if (session.id && this.sessions.has(session.id)) {
			this.sessions.set(session.id, session);
		}
	}

	async delete(sessionId: string): Promise<void> {
		// Supprimer la session
		this.sessions.delete(sessionId);

		// Supprimer la référence dans userSessions
		for (const [userId, sessionIds] of this.userSessions.entries()) {
			const index = sessionIds.indexOf(sessionId);
			if (index > -1) {
				sessionIds.splice(index, 1);
				this.userSessions.set(userId, sessionIds);
				break;
			}
		}
	}

	private generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
