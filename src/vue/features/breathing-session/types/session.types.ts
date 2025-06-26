import type { BreathingProtocol } from "@/main/domain/BreathingProtocol";
import type { SVGShape } from "@/vue/hooks/useBreathingSVGShape";

export type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2" | "idle";

export interface SessionState {
	isActive: boolean;
	isPaused: boolean;
	currentPhase: BreathingPhase;
	currentPhaseStart: number;
	cycleCount: number;
	totalTime: number;
	startTime: number;
}

export interface SessionData {
	duration: number;
	cycleCount: number;
	completedAt: Date;
}

export interface SavedSessionData {
	id: string;
	protocolId: string;
	protocolName: string;
	duration: number;
	cycleCount: number;
	completedAt: Date;
	note?: string;
	efficiency: number;
	averageCycleTime: number;
}

export interface SessionMetrics {
	efficiency: number;
	averageCycleTime: number;
	completionRate: number;
	totalDuration: string;
	cyclesPerMinute: number;
}

export interface SessionCompletionData {
	sessionData: SessionData;
	metrics: SessionMetrics;
	protocolName: string;
	protocolId: string;
}

export interface SessionAnimationState {
	scale: number;
	opacity: number;
	rotation: number;
	progress: number;
}

export interface SessionAnimationProps {
	phase: BreathingPhase;
	isActive: boolean;
	shape: "circle" | "drop";
	size?: number;
	animationState?: SessionAnimationState;
	onClick?: () => void;
	className?: string;
}

export interface SessionControlsProps {
	isActive: boolean;
	isPaused: boolean;
	hapticEnabled: boolean;
	soundEnabled: boolean;
	onPause: () => void;
	onResume: () => void;
	onStop: () => void;
	onToggleHaptic: () => void;
	onToggleSound: () => void;
	className?: string;
}

export interface SessionCompletionModalProps {
	isOpen: boolean;
	onClose: () => void;
	completionData: SessionCompletionData;
	onSave: (note?: string) => void;
}

export interface BreathingSessionContainerProps {
	protocol: BreathingProtocol | null;
	shape?: SVGShape;
	onSessionComplete?: (sessionData: SessionData) => void;
	onSessionStart?: () => void;
	onSessionStop?: () => void;
	className?: string;
}
