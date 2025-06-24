"use client";

import { ReactNode } from "react";

import { Button } from "@/vue/components/ui/button";
import { cn } from "@/vue/lib/utils";

interface SwitcherOption<T> {
	value: T;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	active: boolean;
	disabled?: boolean;
}

interface BaseSwitcherProps<T> {
	options: SwitcherOption<T>[];
	onSelect: (value: T) => void;
	className?: string;
	showLabels?: boolean;
	size?: "sm" | "default" | "lg";
	variant?: "buttons" | "palette" | "toggle";
	isLoading?: boolean;
	"aria-label"?: string;
	children?: ReactNode;
}

export function BaseSwitcher<T extends string>({
	options,
	onSelect,
	className,
	showLabels = false,
	size = "sm",
	variant = "buttons",
	isLoading = false,
	"aria-label": ariaLabel,
	children
}: BaseSwitcherProps<T>) {
	if (isLoading) {
		return (
			<div className={cn("flex gap-2", className)} aria-label={ariaLabel}>
				{options.map((_, i) => (
					<Button key={i} variant="outline" size={size} disabled className="opacity-50">
						<div className="bg-muted h-4 w-4 animate-pulse rounded" />
					</Button>
				))}
			</div>
		);
	}

	if (variant === "toggle") {
		const activeOption = options.find((opt) => opt.active);
		if (!activeOption) return null;

		const nextOption = options[options.findIndex((opt) => opt.active === true) + 1] || options[0];
		const Icon = activeOption.icon;

		return (
			<Button
				variant="outline"
				size={size}
				onClick={() => onSelect(nextOption.value)}
				className={cn("transition-all", className)}
				title={`Switch to ${nextOption.label.toLowerCase()}`}
				aria-label={ariaLabel}
				disabled={activeOption.disabled}
			>
				<Icon className="h-4 w-4" />
				{showLabels && <span className="ml-2 font-medium">{activeOption.label}</span>}
			</Button>
		);
	}

	if (variant === "palette") {
		return (
			<div
				className={cn("bg-background/50 flex gap-1 rounded-lg border p-1", className)}
				role="radiogroup"
				aria-label={ariaLabel}
			>
				{options.map((option) => {
					const Icon = option.icon;

					return (
						<Button
							key={option.value}
							variant={option.active ? "default" : "ghost"}
							size={size}
							onClick={() => onSelect(option.value)}
							className={cn(
								"transition-all",
								option.active && "ring-ring ring-2 ring-offset-2",
								!showLabels && "px-2"
							)}
							title={`Switch to ${option.label.toLowerCase()}`}
							role="radio"
							aria-checked={option.active}
							disabled={option.disabled}
						>
							<Icon className="h-4 w-4" />
							{showLabels && <span className="ml-2 font-medium">{option.label}</span>}
							{children && option.active && children}
						</Button>
					);
				})}
			</div>
		);
	}

	return (
		<div className={cn("flex gap-2", className)} role="radiogroup" aria-label={ariaLabel}>
			{options.map((option) => {
				const Icon = option.icon;

				return (
					<Button
						key={option.value}
						variant={option.active ? "default" : "outline"}
						size={size}
						onClick={() => onSelect(option.value)}
						className={cn("transition-all", option.active && "ring-ring ring-2 ring-offset-2")}
						title={`Switch to ${option.label.toLowerCase()}`}
						role="radio"
						aria-checked={option.active}
						disabled={option.disabled}
					>
						<Icon className="h-4 w-4" />
						{showLabels && <span className="ml-2 font-medium">{option.label}</span>}
					</Button>
				);
			})}
		</div>
	);
}
