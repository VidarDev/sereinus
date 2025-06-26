"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { cn } from "@/vue/lib/utils";
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

const ButtonSkeleton = memo<{ size?: "sm" | "md" | "lg"; className?: string }>(({ size = "md", className }) => {
	const sizeClasses = {
		sm: "h-8",
		md: "h-9",
		lg: "h-10"
	};

	return (
		<div className={cn("bg-muted animate-pulse rounded-md", sizeClasses[size], className)}>
			<div className="flex h-full items-center justify-center">
				<div className="bg-muted-foreground/20 h-4 w-16 rounded"></div>
			</div>
		</div>
	);
});

ButtonSkeleton.displayName = "ButtonSkeleton";

export const InstallManager = memo<InstallManagerProps>(
	({ mode = "auto", variant = "primary", size = "md", className, children }) => {
		const router = useRouter();
		const {
			canInstall,
			isInstalled,
			isInstalling: isInstallingPWA,
			isLoadingInstall,
			installApp,
			platform,
			requiresManualInstall,
			overallState,
			getInstallInstructions
		} = usePWA();

		const [installState, setInstallState] = useState<InstallState>("idle");
		const [showInstructions, setShowInstructions] = useState(false);

		const isInstalling = isInstallingPWA || installState === "installing";
		const isLoading = isLoadingInstall || overallState === "loading";

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

		const handleOpenApp = useCallback(() => {
			router.push("/app");
		}, [router]);

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

		const getShadcnVariant = () => {
			if (variant === "subtle") return "outline";
			if (variant === "ghost") return "ghost";
			return "default";
		};

		const getShadcnSize = () => {
			if (size === "sm") return "sm";
			if (size === "lg") return "lg";
			return "default";
		};

		if (isLoading) {
			return <ButtonSkeleton size={size} className={className} />;
		}

		if (isInstalled) {
			return (
				<Button
					variant={getShadcnVariant()}
					size={getShadcnSize()}
					onClick={handleOpenApp}
					className={cn("transition-transform hover:scale-105 active:scale-95", className)}
				>
					<ExternalLink className="h-4 w-4" />
					<span>Ouvrir</span>
				</Button>
			);
		}

		if (!canInstall) {
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
