"use client";

import { AlertCircle, Check, Download, Loader2, Share, Smartphone } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/vue/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/vue/components/ui/dialog";
import { cn } from "@/vue/lib/utils";
import { usePWA } from "@/vue/providers/pwa.provider";

interface PWAInstallButtonProps {
	variant?: "default" | "outline" | "secondary" | "ghost";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

type InstallResult = "success" | "error" | "manual" | null;

export function PWAInstallButton({
	variant = "default",
	size = "default",
	className,
	children
}: PWAInstallButtonProps) {
	const {
		canInstall,
		isInstalled,
		isInstalling,
		installApp,
		platform,
		requiresManualInstall,
		canUsePrompt,
		getInstallInstructions,
		overallState
	} = usePWA();

	const [installResult, setInstallResult] = useState<InstallResult>(null);
	const [showInstructions, setShowInstructions] = useState(false);

	const handleInstall = useCallback(async (): Promise<void> => {
		try {
			// For Safari and manual installation, show instructions dialog
			if (requiresManualInstall) {
				setShowInstructions(true);
				setInstallResult("manual");
				return;
			}

			// For automatic installation (Chrome, Edge with beforeinstallprompt)
			if (canUsePrompt) {
				const result = await installApp();

				if (result.success) {
					setInstallResult("success");
				} else {
					setInstallResult("error");
					console.error("[PWA Install Button] Installation failed:", result.error);
				}
			} else {
				// Fallback
				setShowInstructions(true);
				setInstallResult("manual");
			}

			if (installResult !== "manual") {
				setTimeout(() => setInstallResult(null), 3000);
			}
		} catch (error) {
			console.error("[PWA Install Button] Installation error:", error);
			setInstallResult("error");
			setTimeout(() => setInstallResult(null), 3000);
		}
	}, [requiresManualInstall, canUsePrompt, installApp, installResult]);

	const handleCloseInstructions = useCallback(() => {
		setShowInstructions(false);
		setInstallResult(null);
	}, []);

	if (isInstalled || !canInstall) {
		return null;
	}

	if (overallState === "loading") {
		return null;
	}

	const getButtonText = (): string => {
		if (installResult === "success") return "Installé !";
		if (installResult === "error") return "Réessayer";
		if (installResult === "manual") return "Voir les instructions";
		if (isInstalling) return "Installation...";
		if (requiresManualInstall) return "Ajouter à l'écran d'accueil";
		return (children as string) || "Installer l'App";
	};

	const getIcon = () => {
		if (installResult === "success") return <Check className="h-4 w-4" />;
		if (installResult === "error") return <AlertCircle className="h-4 w-4" />;
		if (isInstalling) return <Loader2 className="h-4 w-4 animate-spin" />;
		if (platform === "safari" || requiresManualInstall) return <Share className="h-4 w-4" />;
		return <Download className="h-4 w-4" />;
	};

	const getButtonClassName = (): string => {
		const baseClasses = "gap-2 transition-colors";
		const successClasses = "bg-green-600 hover:bg-green-700 border-green-600";
		const errorClasses = "bg-red-600 hover:bg-red-700 border-red-600";
		const manualClasses = "bg-blue-600 hover:bg-blue-700 border-blue-600";

		if (installResult === "success") return cn(baseClasses, successClasses);
		if (installResult === "error") return cn(baseClasses, errorClasses);
		if (installResult === "manual") return cn(baseClasses, manualClasses);
		return baseClasses;
	};

	const isButtonDisabled = (): boolean => {
		return isInstalling || installResult === "success";
	};

	const getInstructionTitle = (): string => {
		switch (platform) {
			case "safari":
				return "Installation sur Safari";
			case "firefox":
				return "Installation sur Firefox";
			default:
				return "Instructions d'installation";
		}
	};

	const getDetailedInstructions = (): string => {
		const baseInstructions = getInstallInstructions();

		switch (platform) {
			case "safari":
				return `${baseInstructions}\n\nÉtapes détaillées:\n1. Appuyez sur le bouton Partager (⤴) dans la barre de navigation\n2. Faites défiler vers le bas et sélectionnez "Ajouter à l'écran d'accueil"\n3. Modifiez le nom si souhaité, puis appuyez sur "Ajouter"`;

			case "firefox":
				return `${baseInstructions}\n\nÉtapes détaillées:\n1. Ouvrez le menu Firefox (☰)\n2. Recherchez l'option "Installer cette application"\n3. Suivez les instructions pour finaliser l'installation`;

			default:
				return baseInstructions;
		}
	};

	return (
		<>
			<Button
				variant={variant}
				size={size}
				onClick={handleInstall}
				disabled={isButtonDisabled()}
				className={cn(getButtonClassName(), className)}
				aria-label={getButtonText()}
			>
				{getIcon()}
				{size !== "icon" && getButtonText()}
			</Button>

			<Dialog open={showInstructions} onOpenChange={setShowInstructions}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Smartphone className="h-5 w-5" />
							{getInstructionTitle()}
						</DialogTitle>
						<DialogDescription>
							Suivez ces étapes pour installer l&apos;application sur votre appareil.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="text-muted-foreground text-sm whitespace-pre-line">
							{getDetailedInstructions()}
						</div>

						<div className="flex justify-end">
							<Button onClick={handleCloseInstructions} variant="outline">
								Compris
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
