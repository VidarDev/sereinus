import { BreathingProtocol } from "../BreathingProtocol";
import { type BreathingPhaseType, BreathingSession } from "../BreathingSession";

export interface SessionMetrics {
	totalDuration: number;
	cycleCount: number;
	averageCycleTime: number;
	efficiency: number;
	completionRate: number;
}

export interface SessionTransition {
	from: BreathingPhaseType;
	to: BreathingPhaseType;
	timestamp: Date;
	cycleNumber: number;
}

export interface SessionAnalytics {
	sessionId: string;
	protocol: BreathingProtocol;
	metrics: SessionMetrics;
	transitions: SessionTransition[];
	startedAt: Date;
	completedAt?: Date;
	interrupted: boolean;
}

export interface SessionUpdate {
	newPhase: BreathingPhaseType;
	isNewCycle: boolean;
	cycleProgress: number;
	shouldAutoSave: boolean;
}

export class BreathingSessionOrchestrator {
	private readonly session: BreathingSession;
	private readonly transitions: SessionTransition[] = [];

	constructor(session: BreathingSession) {
		this.session = session;
	}

	public progressSession(phaseProgress: number): SessionUpdate {
		const currentPhase = this.session.currentPhase;
		const protocol = this.session.protocol;

		const nextPhaseInfo = this.getNextPhase(currentPhase, protocol);
		const cycleProgress = this.calculateCycleProgress(currentPhase, phaseProgress, protocol);

		if (phaseProgress >= 1.0 && nextPhaseInfo.nextPhase !== currentPhase) {
			this.recordTransition(currentPhase, nextPhaseInfo.nextPhase, nextPhaseInfo.isNewCycle);
		}

		const metrics = this.calculateSessionMetrics();
		const shouldAutoSave = this.shouldAutoSave(metrics);

		return {
			newPhase: nextPhaseInfo.nextPhase,
			isNewCycle: nextPhaseInfo.isNewCycle,
			cycleProgress,
			shouldAutoSave
		};
	}

	public generateAnalytics(): SessionAnalytics {
		return {
			sessionId: this.session.id,
			protocol: this.session.protocol,
			metrics: this.calculateSessionMetrics(),
			transitions: [...this.transitions],
			startedAt: this.session.startTime,
			completedAt: this.session.endTime,
			interrupted: !this.session.isActive && !this.session.endTime
		};
	}

	private getNextPhase(
		currentPhase: BreathingPhaseType,
		protocol: BreathingProtocol
	): { nextPhase: BreathingPhaseType; isNewCycle: boolean } {
		const activePhases = this.getActivePhases(protocol);
		const currentIndex = activePhases.indexOf(currentPhase);
		const nextIndex = (currentIndex + 1) % activePhases.length;

		return {
			nextPhase: activePhases[nextIndex] ?? "idle",
			isNewCycle: nextIndex === 0
		};
	}

	private calculateCycleProgress(
		currentPhase: BreathingPhaseType,
		phaseProgress: number,
		protocol: BreathingProtocol
	): number {
		const activePhases = this.getActivePhases(protocol);
		const totalCycleDuration = protocol.totalCycleDuration;

		let accumulatedDuration = 0;

		for (let i = 0; i < activePhases.indexOf(currentPhase); i++) {
			const phase = activePhases[i];
			if (phase) {
				accumulatedDuration += this.getPhaseDuration(protocol, phase);
			}
		}

		const currentPhaseDuration = this.getPhaseDuration(protocol, currentPhase);
		accumulatedDuration += currentPhaseDuration * phaseProgress;

		return Math.min(accumulatedDuration / totalCycleDuration, 1);
	}

	private calculateSessionMetrics(): SessionMetrics {
		const totalDuration = this.session.duration;
		const cycleCount = this.session.cycleCount;

		const averageCycleTime = cycleCount > 0 ? totalDuration / cycleCount : 0;
		const efficiency = this.calculateEfficiency();
		const expectedCycles = this.calculateExpectedCycles();
		const completionRate = expectedCycles > 0 ? Math.min((cycleCount / expectedCycles) * 100, 100) : 0;

		return {
			totalDuration,
			cycleCount,
			averageCycleTime,
			efficiency,
			completionRate
		};
	}

	private shouldAutoSave(metrics: SessionMetrics): boolean {
		const minDuration = 30000;
		const minCycles = 1;
		const minEfficiency = 20;

		return (
			this.session.duration >= minDuration &&
			this.session.cycleCount >= minCycles &&
			metrics.efficiency >= minEfficiency
		);
	}

	private recordTransition(from: BreathingPhaseType, to: BreathingPhaseType, isNewCycle: boolean): void {
		this.transitions.push({
			from,
			to,
			timestamp: new Date(),
			cycleNumber: isNewCycle ? this.session.cycleCount + 1 : this.session.cycleCount
		});
	}

	private getActivePhases(protocol: BreathingProtocol): BreathingPhaseType[] {
		const allPhases: BreathingPhaseType[] = ["inhale", "hold1", "exhale", "hold2"];
		return allPhases.filter((phase) => {
			if (phase === "inhale" || phase === "exhale") return true;
			if (phase === "hold1") return (protocol.phases.hold1 ?? 0) > 0;
			if (phase === "hold2") return (protocol.phases.hold2 ?? 0) > 0;
			return false;
		});
	}

	private getPhaseDuration(protocol: BreathingProtocol, phase: BreathingPhaseType): number {
		switch (phase) {
			case "inhale":
				return protocol.phases.inhale;
			case "hold1":
				return protocol.phases.hold1 ?? 0;
			case "exhale":
				return protocol.phases.exhale;
			case "hold2":
				return protocol.phases.hold2 ?? 0;
			case "idle":
			default:
				return 0;
		}
	}

	private calculateEfficiency(): number {
		if (this.transitions.length < 2) return 100;

		const phaseGroups = this.groupTransitionsByPhase();
		let totalVariance = 0;
		let phaseCount = 0;

		for (const [phase, transitions] of Object.entries(phaseGroups)) {
			const durations = this.calculatePhaseDurations(transitions);
			const expectedDuration = this.getPhaseDuration(this.session.protocol, phase as BreathingPhaseType);

			if (expectedDuration > 0 && durations.length > 0) {
				const variance = this.calculateVariance(durations, expectedDuration);
				totalVariance += variance;
				phaseCount++;
			}
		}

		if (phaseCount === 0) return 100;

		const averageVariance = totalVariance / phaseCount;
		const maxVariance = 4;
		const efficiency = Math.max(0, 100 - (averageVariance / maxVariance) * 100);

		return Math.round(efficiency);
	}

	private calculateExpectedCycles(): number {
		const cycleDurationMs = this.session.protocol.totalCycleDuration * 1000;
		return Math.floor(this.session.duration / cycleDurationMs);
	}

	private groupTransitionsByPhase(): Record<string, SessionTransition[]> {
		const groups: Record<string, SessionTransition[]> = {};

		for (const transition of this.transitions) {
			if (!groups[transition.from]) {
				groups[transition.from] = [];
			}
			groups[transition.from]?.push(transition);
		}

		return groups;
	}

	private calculatePhaseDurations(transitions: SessionTransition[]): number[] {
		const durations: number[] = [];
		for (let i = 1; i < transitions.length; i++) {
			const currentTransition = transitions[i];
			const previousTransition = transitions[i - 1];
			if (currentTransition && previousTransition) {
				const duration = currentTransition.timestamp.getTime() - previousTransition.timestamp.getTime();
				durations.push(duration / 1000);
			}
		}
		return durations;
	}

	private calculateVariance(values: number[], expected: number): number {
		if (values.length === 0) return 0;

		const squaredDifferences = values.map((value) => Math.pow(value - expected, 2));
		return squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;
	}
}
