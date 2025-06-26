"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { SiteConfig } from "../site-config";

export interface BreathingProtocolViewModel {
	id: string;
	name: string;
	description: string;
	pattern: number[];
	phases: {
		inhale: number;
		hold1?: number;
		exhale: number;
		hold2?: number;
	};
	duration: number;
	totalCycleDuration: number;
	category: string;
	difficulty: "beginner" | "intermediate" | "advanced";
	benefits: string[];
	isScientificallyValidated: boolean;
}

const STATIC_PROTOCOLS: BreathingProtocolViewModel[] = [
	{
		id: "box-breathing",
		name: "Box Breathing (4-4-4-4)",
		description:
			"Technique de respiration carrée utilisée par les forces spéciales pour réduire le stress et améliorer la concentration.",
		pattern: [4, 4, 4, 4],
		phases: {
			inhale: 4,
			hold1: 4,
			exhale: 4,
			hold2: 4
		},
		duration: 300,
		totalCycleDuration: 16,
		category: "ACUTE_ANXIETY",
		difficulty: "beginner",
		benefits: ["Réduit le stress", "Améliore la concentration", "Calme l'anxiété"],
		isScientificallyValidated: true
	},
	{
		id: "technique-478",
		name: "Technique 4-7-8",
		description:
			"Méthode développée par le Dr. Andrew Weil, particulièrement efficace pour l'endormissement et la réduction de l'anxiété.",
		pattern: [4, 7, 8],
		phases: {
			inhale: 4,
			hold1: 7,
			exhale: 8
		},
		duration: 240,
		totalCycleDuration: 19,
		category: "SLEEP",
		difficulty: "intermediate",
		benefits: ["Favorise l'endormissement", "Réduit l'anxiété", "Apaise l'esprit"],
		isScientificallyValidated: true
	},
	{
		id: "coherent-breathing",
		name: "Respiration Cohérente (5-5)",
		description:
			"Respiration à 5 cycles par minute, optimale pour la variabilité cardiaque et l'équilibre du système nerveux autonome.",
		pattern: [5, 5],
		phases: {
			inhale: 5,
			exhale: 5
		},
		duration: 300,
		totalCycleDuration: 10,
		category: "DAILY_PRACTICE",
		difficulty: "beginner",
		benefits: ["Équilibre le système nerveux", "Améliore la variabilité cardiaque"],
		isScientificallyValidated: true
	}
];

const STORAGE_KEY = `${SiteConfig.appId}-selected-breathing-protocol`;

export function useBreathingProtocolsClean() {
	const [protocols] = useState<BreathingProtocolViewModel[]>(STATIC_PROTOCOLS);
	const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocolViewModel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadSelectedProtocol = useCallback(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const savedProtocol = JSON.parse(stored) as BreathingProtocolViewModel;
				const protocolExists = STATIC_PROTOCOLS.find((p) => p.id === savedProtocol.id);
				if (protocolExists) {
					return protocolExists;
				}
			}
		} catch (error) {
			console.warn("Erreur lors du chargement du protocole sauvé:", error);
		}
		return null;
	}, []);

	const saveSelectedProtocol = useCallback((protocol: BreathingProtocolViewModel | null) => {
		try {
			if (protocol) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(protocol));
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch (error) {
			console.warn("Erreur lors de la sauvegarde du protocole:", error);
		}
	}, []);

	const loadProtocols = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			await new Promise((resolve) => setTimeout(resolve, 100));

			const savedProtocol = loadSelectedProtocol();

			if (savedProtocol) {
				setSelectedProtocol(savedProtocol);
			} else {
				const defaultProtocol = STATIC_PROTOCOLS.find((p) => p.id === "box-breathing");
				if (defaultProtocol) {
					setSelectedProtocol(defaultProtocol);
					saveSelectedProtocol(defaultProtocol);
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setIsLoading(false);
		}
	}, [loadSelectedProtocol, saveSelectedProtocol]);

	useEffect(() => {
		loadProtocols();
	}, [loadProtocols]);

	const setProtocol = useCallback(
		(protocol: BreathingProtocolViewModel) => {
			setSelectedProtocol(protocol);
			saveSelectedProtocol(protocol);

			toast.success(`Programme "${protocol.name}" sélectionné`);
		},
		[saveSelectedProtocol]
	);

	const setProtocolById = useCallback(
		(id: string) => {
			const protocol = protocols.find((p) => p.id === id);
			if (protocol) {
				setSelectedProtocol(protocol);
				saveSelectedProtocol(protocol);

				toast.success(`Programme "${protocol.name}" sélectionné`);
			}
		},
		[protocols, saveSelectedProtocol]
	);

	const getProtocolById = (id: string): BreathingProtocolViewModel | undefined => {
		return protocols.find((p) => p.id === id);
	};

	const getProtocolsByCategory = (category: string): BreathingProtocolViewModel[] => {
		return protocols.filter((p) => p.category === category);
	};

	return {
		// State
		selectedProtocol,
		allProtocols: protocols,
		isLoading,
		error,
		recommendations: {
			ACUTE_ANXIETY: protocols.filter((p) => p.category === "ACUTE_ANXIETY"),
			DAILY_PRACTICE: protocols.filter((p) => p.category === "DAILY_PRACTICE"),
			SLEEP: protocols.filter((p) => p.category === "SLEEP")
		},

		// Actions
		setProtocol,
		setProtocolById,
		getProtocolById,
		getProtocolsByCategory,
		reload: loadProtocols
	};
}
