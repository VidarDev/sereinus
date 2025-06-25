"use client";

import { memo, useCallback, useMemo, useState } from "react";

import { usePWA } from "@/vue/providers/pwa.provider";
import { InstallButton } from "./installButton";
import { InstallModal } from "./installModal";

interface InstallManagerProps {
	mode?: "button" | "prompt" | "auto";
	variant?: "primary" | "subtle" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
	children?: React.ReactNode;
}

type InstallState = "idle" | "installing" | "manual" | "success" | "error";

export const InstallManager = memo<InstallManagerProps>(
	({ mode = "auto", variant = "primary", size = "md", className, children }) => {
		const {
			canInstall,
			isInstalled,
			isInstalling: isInstallingPWA,
			installApp,
			platform,
			requiresManualInstall,
			overallState,
			getInstallInstructions
		} = usePWA();

		const [installState, setInstallState] = useState<InstallState>("idle");
		const [showInstructions, setShowInstructions] = useState(false);

		const isInstalling = isInstallingPWA || installState === "installing";

		const isIOSDevice = useMemo(() => {
			return platform === "safari" && requiresManualInstall;
		}, [platform, requiresManualInstall]);

		const getButtonState = useMemo(() => {
			if (isInstalling) return "loading";
			if (installState === "error") return "error";
			if (isIOSDevice) return "ios-manual";
			return "idle";
		}, [isInstalling, installState, isIOSDevice]);

		const handleInstall = useCallback(async () => {
			if (isInstalling || isInstalled) {
				return;
			}

			try {
				setInstallState("installing");

				if (requiresManualInstall) {
					setInstallState("manual");
					setShowInstructions(true);
					return;
				}

				const result = await installApp();

				if (result.success) {
					setInstallState("success");
					setTimeout(() => setInstallState("idle"), 2000);
				} else {
					setInstallState("error");
					console.warn("[PWA Install Manager] Installation échouée:", result.error);
					setTimeout(() => setInstallState("idle"), 5000);
				}
			} catch (error) {
				console.error("[PWA Install Manager] Erreur d'installation:", error);
				setInstallState("error");
				setTimeout(() => setInstallState("idle"), 5000);
			}
		}, [isInstalling, isInstalled, requiresManualInstall, installApp]);

		const handleCloseInstructions = useCallback(() => {
			setShowInstructions(false);
			setInstallState("idle");
		}, []);

		const modalTitle = useMemo(() => {
			switch (platform) {
				case "safari":
					return "Installation sur iOS/Safari";
				case "firefox":
					return "Installation sur Firefox";
				default:
					return "Instructions d'installation";
			}
		}, [platform]);

		const instructionsContent = useMemo(() => {
			const instructions = getInstallInstructions();

			return (
				<div className="space-y-4">
					<div className="text-center text-sm whitespace-pre-line">{instructions}</div>
				</div>
			);
		}, [getInstallInstructions]);

		if (isInstalled || !canInstall || overallState === "loading") {
			return null;
		}

		if (mode === "button") {
			return (
				<>
					<InstallButton
						onClick={handleInstall}
						loading={isInstalling}
						disabled={installState === "success"}
						state={getButtonState}
						variant={variant}
						size={size}
						className={className}
					>
						{children}
					</InstallButton>

					<InstallModal open={showInstructions} onClose={handleCloseInstructions} title={modalTitle}>
						{instructionsContent}
					</InstallModal>
				</>
			);
		}

		return (
			<>
				<InstallModal open={showInstructions} onClose={handleCloseInstructions} title={modalTitle}>
					{instructionsContent}
				</InstallModal>
			</>
		);
	}
);

InstallManager.displayName = "InstallManager";
