"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getInjection } from "@/di/container";
import type {
	BreathingProtocolsResponse,
	BreathingProtocolViewModel
} from "@/main/presentation/presenter/BreathingProtocols.ui.presenter";
import { SiteConfig } from "../site-config";

export type { BreathingProtocolViewModel };

const STORAGE_KEY = `${SiteConfig.appId}-selected-breathing-protocol`;

export function useBreathingProtocolsClean() {
	const [protocols, setProtocols] = useState<BreathingProtocolViewModel[]>([]);
	const [selectedProtocol, setSelectedProtocol] = useState<BreathingProtocolViewModel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [recommendations, setRecommendations] = useState<Record<string, BreathingProtocolViewModel[]>>({});

	const controller = getInjection("BreathingSessionController");

	const loadSelectedProtocol = useCallback(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const savedProtocol = JSON.parse(stored) as BreathingProtocolViewModel;
				return savedProtocol;
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

			const response = (await controller.getProtocols()) as BreathingProtocolsResponse;

			if (response.success && response.data) {
				setProtocols(response.data);
				setRecommendations(response.recommendations || {});

				const savedProtocol = loadSelectedProtocol();

				if (savedProtocol) {
					const protocolExists = response.data.find((p) => p.id === savedProtocol.id);
					if (protocolExists) {
						setSelectedProtocol(protocolExists);
						return;
					}
				}

				const defaultProtocol = response.data.find((p) => p.id === "box-breathing");
				if (defaultProtocol) {
					setSelectedProtocol(defaultProtocol);
					saveSelectedProtocol(defaultProtocol);
				}
			} else {
				setError(response.error || "Erreur lors du chargement des protocoles");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue");
		} finally {
			setIsLoading(false);
		}
	}, [controller, loadSelectedProtocol, saveSelectedProtocol]);

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
		return recommendations[category] || [];
	};

	return {
		// State
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
