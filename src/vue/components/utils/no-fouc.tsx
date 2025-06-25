"use client";

import { useEffect, useState } from "react";

interface NoFOUCProps {
	children: React.ReactNode;
}

export function NoFOUC({ children }: NoFOUCProps) {
	const [isThemeLoaded, setIsThemeLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsThemeLoaded(true);
		}, 50);

		return () => clearTimeout(timer);
	}, []);

	if (!isThemeLoaded) {
		return (
			<div
				className="flex h-screen w-full items-center justify-center"
				style={{
					backgroundColor: "var(--background)",
					color: "var(--foreground)"
				}}
			>
				<div className="animate-pulse">
					<div className="h-8 w-8 rounded-full bg-white/20"></div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
