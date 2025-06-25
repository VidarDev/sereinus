"use client";

import { useCallback, useEffect, useState } from "react";

import { getInjection } from "@/di/container";
import type {
	BreathingProtocolsResponse,
	BreathingProtocolViewModel
} from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";

export type { BreathingProtocolViewModel };

export function useBreathingProtocolsClean() {
	const [protocols, setProtocols] = useState<BreathingProtocolViewModel[]>([]);
	const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocolViewModel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [recommendations, setRecommendations] = useState<Record<string, BreathingProtocolViewModel[]>>({});

	const controller = getInjection("BreathingSessionController");

	const loadProtocols = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = (await controller.getProtocols()) as BreathingProtocolsResponse;

			if (response.success && response.data) {
				setProtocols(response.data);
				setRecommendations(response.recommendations || {});

				// Sélectionner le protocole par défaut (Box Breathing)
				const defaultProtocol = response.data.find((p) => p.id === "box-breathing");
				if (defaultProtocol) {
					setSelectedProtocol(defaultProtocol);
				}
			} else {
				setError(response.error || "Erreur lors du chargement des protocoles");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setIsLoading(false);
		}
	}, [controller]);

	useEffect(() => {
		loadProtocols();
	}, [loadProtocols]);

	const setProtocol = (protocol: BreathingProtocolViewModel) => {
		setSelectedProtocol(protocol);
	};

	const setProtocolById = (id: string) => {
		const protocol = protocols.find((p) => p.id === id);
		if (protocol) {
			setSelectedProtocol(protocol);
		}
	};

	const getProtocolById = (id: string): BreathingProtocolViewModel | undefined => {
		return protocols.find((p) => p.id === id);
	};

	const getProtocolsByCategory = (category: string): BreathingProtocolViewModel[] => {
		return recommendations[category] || [];
	};

	return {
		// État
		selectedProtocol,
		allProtocols: protocols,
		isLoading,
		error,
		recommendations,

		// Actions
		setProtocol,
		setProtocolById,
		getProtocolById,
		getProtocolsByCategory,
		reload: loadProtocols
	};
}
