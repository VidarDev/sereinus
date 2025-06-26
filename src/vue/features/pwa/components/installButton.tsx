"use client";

import { forwardRef, memo, type MouseEvent, useCallback } from "react";
import { AlertTriangle, Download, Eye, Loader2 } from "lucide-react";

import { Button } from "@/vue/components/ui/button";
import { cn } from "@/vue/lib/utils";

interface InstallButtonProps {
	onClick: () => void;
	disabled?: boolean;
	loading?: boolean;
	state?: "idle" | "loading" | "error" | "ios-manual";
	variant?: "primary" | "subtle" | "ghost" | "error";
	size?: "sm" | "md" | "lg";
	className?: string;
	children?: React.ReactNode;
	"aria-label"?: string;
}

export const InstallButton = memo(
	forwardRef<HTMLButtonElement, InstallButtonProps>(
		(
			{
				onClick,
				disabled = false,
				loading = false,
				state = "idle",
				variant = "primary",
				size = "md",
				className,
				children,
				"aria-label": ariaLabel,
				...props
			},
			ref
		) => {
			const handleClick = useCallback(
				(event: MouseEvent<HTMLButtonElement>) => {
					event.preventDefault();

					if (disabled || loading) {
						return;
					}

					onClick();
				},
				[onClick, disabled, loading]
			);

			const isDisabled = disabled || loading;

			const getShadcnVariant = () => {
				if (state === "error") return "destructive";
				if (variant === "subtle") return "outline";
				if (variant === "ghost") return "ghost";
				return "default";
			};

			const getShadcnSize = () => {
				if (size === "sm") return "sm";
				if (size === "lg") return "lg";
				return "default";
			};

			const getButtonText = (): React.ReactNode => {
				if (children) return children;

				switch (state) {
					case "loading":
						return "Installation...";
					case "error":
						return "Réessayer";
					case "ios-manual":
						return "Voir les instructions";
					default:
						return "Installer";
				}
			};

			const getIcon = () => {
				if (loading || state === "loading") {
					return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />;
				}

				switch (state) {
					case "error":
						return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
					case "ios-manual":
						return <Eye className="h-4 w-4" aria-hidden="true" />;
					default:
						return <Download className="h-4 w-4" aria-hidden="true" />;
				}
			};

			const buttonContent = (
				<>
					{getIcon()}
					<span>{getButtonText()}</span>
				</>
			);

			const getAriaLabel = (): string => {
				if (ariaLabel) return ariaLabel;

				switch (state) {
					case "error":
						return "Réessayer l'installation de l'application";
					case "ios-manual":
						return "Voir les instructions d'installation";
					case "loading":
						return "Installation en cours";
					default:
						return "Installer l'application";
				}
			};

			return (
				<Button
					ref={ref}
					variant={getShadcnVariant()}
					size={getShadcnSize()}
					onClick={handleClick}
					disabled={isDisabled}
					className={cn("transition-transform hover:scale-105 active:scale-95", className)}
					aria-label={getAriaLabel()}
					aria-disabled={isDisabled}
					{...props}
				>
					{buttonContent}
				</Button>
			);
		}
	)
);

InstallButton.displayName = "InstallButton";
