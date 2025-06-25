"use client";

import { useState } from "react";

// Types selon les spécifications
export interface BreathingProtocol {
	name: string;
	id: string;
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

// Protocoles scientifiquement validés selon vos spécifications
export const BREATHING_PROTOCOLS: Record<string, BreathingProtocol> = {
	BOX_BREATHING: {
		id: "box-breathing",
		name: "Box Breathing (4-4-4-4)",
		description:
			"Technique de respiration carrée utilisée par les forces spéciales pour réduire le stress et améliorer la concentration.",
		phases: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
		totalCycleDuration: 16,
		isScientificallyValidated: true
	},
	TECHNIQUE_478: {
		id: "technique-478",
		name: "Technique 4-7-8",
		description:
			"Méthode développée par le Dr. Andrew Weil, particulièrement efficace pour l'endormissement et la réduction de l'anxiété.",
		phases: { inhale: 4, hold1: 7, exhale: 8 },
		totalCycleDuration: 19,
		isScientificallyValidated: true
	},
	COHERENT_BREATHING: {
		id: "coherent-breathing",
		name: "Respiration Cohérente (5-5)",
		description:
			"Respiration à 5 cycles par minute, optimale pour la variabilité cardiaque et l'équilibre du système nerveux autonome.",
		phases: { inhale: 5, exhale: 5 },
		totalCycleDuration: 10,
		isScientificallyValidated: true
	}
};

export const DEFAULT_PROTOCOL = BREATHING_PROTOCOLS.BOX_BREATHING;

// Recommandations selon les situations
export const PROTOCOL_RECOMMENDATIONS = {
	ACUTE_ANXIETY: [BREATHING_PROTOCOLS.BOX_BREATHING, BREATHING_PROTOCOLS.TECHNIQUE_478],
	RELAXATION: [BREATHING_PROTOCOLS.TECHNIQUE_478, BREATHING_PROTOCOLS.COHERENT_BREATHING],
	MEDITATION: [BREATHING_PROTOCOLS.COHERENT_BREATHING, BREATHING_PROTOCOLS.BOX_BREATHING],
	BEGINNER: [BREATHING_PROTOCOLS.COHERENT_BREATHING, BREATHING_PROTOCOLS.BOX_BREATHING],
	DAILY_PRACTICE: [BREATHING_PROTOCOLS.COHERENT_BREATHING, BREATHING_PROTOCOLS.BOX_BREATHING]
};

export function useBreathingProtocols() {
	const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocol>(DEFAULT_PROTOCOL);

	const getAllProtocols = () => Object.values(BREATHING_PROTOCOLS);

	const getProtocolById = (id: string): BreathingProtocol | undefined => {
		return Object.values(BREATHING_PROTOCOLS).find((protocol) => protocol.id === id);
	};

	const getProtocolsByCategory = (category: keyof typeof PROTOCOL_RECOMMENDATIONS): BreathingProtocol[] => {
		return PROTOCOL_RECOMMENDATIONS[category] || [];
	};

	const setProtocol = (protocol: BreathingProtocol) => {
		setSelectedProtocol(protocol);
	};

	const setProtocolById = (id: string) => {
		const protocol = getProtocolById(id);
		if (protocol) {
			setSelectedProtocol(protocol);
		}
	};

	return {
		selectedProtocol,
		allProtocols: getAllProtocols(),
		setProtocol,
		setProtocolById,
		getProtocolById,
		getProtocolsByCategory,
		DEFAULT_PROTOCOL,
		PROTOCOL_RECOMMENDATIONS
	};
}
