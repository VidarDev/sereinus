import { cn } from "@/vue/lib/utils";

interface AlertProps {
	children: React.ReactNode;
	variant?: "default" | "destructive";
	className?: string;
}

export function Alert({ children, variant = "default", className }: AlertProps) {
	return (
		<div
			className={cn(
				"relative w-full rounded-lg border p-4",
				variant === "destructive"
					? "border-destructive/50 text-destructive dark:border-destructive"
					: "border-border",
				className
			)}
		>
			{children}
		</div>
	);
}

interface AlertDescriptionProps {
	children: React.ReactNode;
	className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
	return <div className={cn("text-sm [&_p]:leading-relaxed", className)}>{children}</div>;
}
