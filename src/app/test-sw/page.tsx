"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/vue/components/ui/badge";
import { Button } from "@/vue/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/vue/components/ui/card";

export default function ServiceWorkerTestPage() {
	const [results, setResults] = useState<{
		apiAvailable: boolean;
		isPrivateMode: boolean;
		registrationAttempt: string;
		registrationSuccess: boolean;
		activeWorker: boolean;
		error?: string;
	}>({
		apiAvailable: false,
		isPrivateMode: false,
		registrationAttempt: "Non testé",
		registrationSuccess: false,
		activeWorker: false
	});

	// Détection du mode privé (même logique que dans PWADebugModal)
	const detectPrivateMode = async (): Promise<boolean> => {
		try {
			// Test 1: Vérifier si on peut utiliser localStorage
			if (typeof window.localStorage === "undefined") {
				return true;
			}

			// Test 2: Tenter d'écrire dans localStorage
			const testKey = "__private_mode_test__";
			try {
				localStorage.setItem(testKey, "test");
				localStorage.removeItem(testKey);
			} catch {
				return true;
			}

			// Test 3: Pour iOS Safari, vérifier les quotas
			if ("storage" in navigator && "estimate" in navigator.storage) {
				try {
					const estimate = await navigator.storage.estimate();
					// En mode privé, le quota est généralement très limité
					if (estimate.quota && estimate.quota < 10 * 1024 * 1024) {
						// < 10MB
						return true;
					}
				} catch {
					// Si l'API échoue, possiblement en mode privé
					return true;
				}
			}

			return false;
		} catch {
			return true; // En cas d'erreur, assumer mode privé
		}
	};

	const testServiceWorker = async () => {
		console.log("🔍 Test Service Worker - Début");

		const newResults = {
			apiAvailable: false,
			isPrivateMode: false,
			registrationAttempt: "Non testé",
			registrationSuccess: false,
			activeWorker: false,
			error: undefined as string | undefined
		};

		// Test 1: API disponible
		console.log("📋 Test 1: Vérification de l'API");
		if ("serviceWorker" in navigator) {
			newResults.apiAvailable = true;
			console.log("✅ API Service Worker disponible");
		} else {
			newResults.apiAvailable = false;
			console.log("❌ API Service Worker non disponible");
			setResults(newResults);
			return;
		}

		// Test 2: Mode privé
		console.log("📋 Test 2: Vérification du mode privé");
		newResults.isPrivateMode = await detectPrivateMode();
		if (newResults.isPrivateMode) {
			console.log("⚠️ Mode navigation privée détecté - Service Workers désactivés");
			newResults.error = "Mode navigation privée détecté. Les Service Workers sont désactivés en mode privé.";
			setResults(newResults);
			return;
		} else {
			console.log("✅ Mode normal détecté");
		}

		// Test 3: Tentative d'enregistrement
		console.log("📋 Test 3: Tentative d'enregistrement");
		try {
			newResults.registrationAttempt = "En cours...";
			setResults({ ...newResults });

			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/"
			});

			console.log("✅ Enregistrement réussi:", registration);
			newResults.registrationAttempt = "Réussi";
			newResults.registrationSuccess = true;

			// Test 4: Service Worker actif
			console.log("📋 Test 4: Vérification du Service Worker actif");
			if (registration.active) {
				newResults.activeWorker = true;
				console.log("✅ Service Worker actif:", registration.active);
			} else {
				console.log("⚠️ Service Worker pas encore actif");

				// Attendre qu'il devienne actif
				if (registration.installing) {
					console.log("⏳ Service Worker en cours d'installation...");
					registration.installing.addEventListener("statechange", (e) => {
						const worker = e.target as ServiceWorker;
						console.log("🔄 État du Service Worker:", worker.state);
						if (worker.state === "activated") {
							newResults.activeWorker = true;
							setResults({ ...newResults });
						}
					});
				}
			}
		} catch (error) {
			console.error("❌ Erreur lors de l'enregistrement:", error);
			newResults.registrationAttempt = "Échec";
			newResults.registrationSuccess = false;
			newResults.error = error instanceof Error ? error.message : "Erreur inconnue";
		}

		setResults(newResults);
		console.log("🔍 Test Service Worker - Terminé", newResults);
	};

	useEffect(() => {
		testServiceWorker();
	}, []);

	const getIOSInfo = () => {
		const userAgent = navigator.userAgent;
		const isIOS = /iPad|iPhone|iPod/.test(userAgent);
		const version = userAgent.match(/OS (\d+)_(\d+)/);

		return {
			isIOS,
			version: version ? `${version[1]}.${version[2]}` : "Inconnue",
			userAgent
		};
	};

	const iosInfo = getIOSInfo();

	return (
		<div className="container mx-auto space-y-6 p-4">
			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-bold">Test Service Worker</h1>
				<p className="text-muted-foreground">
					Page de test pour diagnostiquer les problèmes de Service Worker sur iOS
				</p>
			</div>

			{/* iOS Info */}
			<Card>
				<CardHeader>
					<CardTitle>Informations Système</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between">
						<span>Plateforme</span>
						<Badge variant={iosInfo.isIOS ? "default" : "secondary"}>
							{iosInfo.isIOS ? "iOS" : "Autre"}
						</Badge>
					</div>
					{iosInfo.isIOS && (
						<div className="flex items-center justify-between">
							<span>Version iOS</span>
							<Badge variant="outline">{iosInfo.version}</Badge>
						</div>
					)}
					<div className="text-muted-foreground bg-muted/30 rounded p-2 text-xs">
						<strong>User Agent:</strong>
						<br />
						{iosInfo.userAgent}
					</div>
				</CardContent>
			</Card>

			{/* Test Results */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Résultats des Tests</CardTitle>
					<Button onClick={testServiceWorker} size="sm">
						Relancer les tests
					</Button>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between">
						<span>API Service Worker</span>
						<Badge variant={results.apiAvailable ? "default" : "destructive"}>
							{results.apiAvailable ? "✓ Disponible" : "✗ Indisponible"}
						</Badge>
					</div>

					<div className="flex items-center justify-between">
						<span>Mode Navigation Privée</span>
						<Badge variant={results.isPrivateMode ? "destructive" : "default"}>
							{results.isPrivateMode ? "⚠️ Détecté" : "✓ Normal"}
						</Badge>
					</div>

					<div className="flex items-center justify-between">
						<span>Enregistrement</span>
						<Badge
							variant={
								results.registrationSuccess
									? "default"
									: results.registrationAttempt === "Non testé"
										? "secondary"
										: "destructive"
							}
						>
							{results.registrationAttempt}
						</Badge>
					</div>

					<div className="flex items-center justify-between">
						<span>Service Worker Actif</span>
						<Badge variant={results.activeWorker ? "default" : "secondary"}>
							{results.activeWorker ? "✓ Actif" : "✗ Inactif"}
						</Badge>
					</div>

					{results.error && (
						<div className="bg-destructive/10 border-destructive/20 rounded border p-3">
							<div className="text-destructive font-medium">Erreur:</div>
							<div className="text-muted-foreground text-sm">{results.error}</div>
						</div>
					)}

					{results.isPrivateMode && (
						<div className="rounded border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
							<div className="text-sm font-medium text-amber-800 dark:text-amber-200">
								⚠️ Mode navigation privée détecté
							</div>
							<div className="mt-1 text-xs text-amber-700 dark:text-amber-300">
								Les Service Workers sont complètement désactivés en mode navigation privée sur iOS
								Safari. Pour tester les Service Workers, veuillez utiliser Safari en mode normal.
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Console Log */}
			<Card>
				<CardHeader>
					<CardTitle>Instructions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="text-sm">
						1. Ouvrez les outils de développement de Safari (Réglages → Safari → Avancé → Inspecteur Web)
					</p>
					<p className="text-sm">2. Regardez la console pour voir les logs détaillés des tests</p>
					<p className="text-sm">
						3. Vérifiez l&apos;onglet &quot;Service Workers&quot; dans les outils de développement
					</p>
					<p className="text-sm font-medium text-amber-600">
						4. ⚠️ IMPORTANT: Si vous êtes en mode navigation privée, les Service Workers seront désactivés
					</p>
					<p className="text-sm">
						5. Pour tester, assurez-vous d&apos;utiliser Safari en mode normal (pas privé)
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
