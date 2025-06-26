"use client";

import { useEffect, useState } from "react";

interface NoFOUCProps {
	children: React.ReactNode;
}

export function NoFOUC({ children }: NoFOUCProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<div className="bg-background text-foreground flex h-screen w-full items-center justify-center">
				<div className="animate-pulse">
					<div className="h-8 w-8 rounded-full bg-white/20"></div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
