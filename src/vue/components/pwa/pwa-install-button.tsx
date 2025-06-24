"use client";

import { Check, Download, Loader2, Smartphone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/vue/components/ui/button";
import { cn } from "@/vue/lib/utils";
import { usePWA } from "@/vue/providers/pwa.provider";

interface PWAInstallButtonProps {
	variant?: "default" | "outline" | "secondary" | "ghost";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

type InstallResult = "success" | "error" | null;

export function PWAInstallButton({
	variant = "default",
	size = "default",
	className,
	children
}: PWAInstallButtonProps) {
	const { canInstall, isInstalled, isInstalling, installApp, platform } = usePWA();
	const [installResult, setInstallResult] = useState<InstallResult>(null);

	if (isInstalled || !canInstall) {
		return null;
	}

	const handleInstall = async (): Promise<void> => {
		try {
			const success = await installApp();
			const result: InstallResult = success ? "success" : "error";

			setInstallResult(result);
			setTimeout(() => setInstallResult(null), 3000);
		} catch (error) {
			console.error("Installation failed:", error);
			setInstallResult("error");
			setTimeout(() => setInstallResult(null), 3000);
		}
	};

	const getButtonText = (): string => {
		if (installResult === "success") return "Installé !";
		if (installResult === "error") return "Réessayer";
		if (isInstalling) return "Installation...";
		return (children as string) || "Installer l'App";
	};

	const getIcon = () => {
		if (installResult === "success") return <Check className="h-4 w-4" />;
		if (isInstalling) return <Loader2 className="h-4 w-4 animate-spin" />;
		if (platform === "safari") return <Smartphone className="h-4 w-4" />;
		return <Download className="h-4 w-4" />;
	};

	const getButtonClassName = (): string => {
		const baseClasses = "gap-2";
		const successClasses = "bg-green-600 hover:bg-green-700";
		const errorClasses = "bg-red-600 hover:bg-red-700";

		if (installResult === "success") return cn(baseClasses, successClasses);
		if (installResult === "error") return cn(baseClasses, errorClasses);
		return baseClasses;
	};

	const isButtonDisabled = (): boolean => {
		return isInstalling || installResult === "success";
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleInstall}
			disabled={isButtonDisabled()}
			className={cn(getButtonClassName(), className)}
		>
			{getIcon()}
			{size !== "icon" && getButtonText()}
		</Button>
	);
}
