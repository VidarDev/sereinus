"use client";

import { useEffect, useState } from "react";

import { Button } from "@/vue/components/ui/button";

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: boolean }).MSStream
		);

		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
	}, []);

	if (isStandalone) {
		return null;
	}

	return <Button>Install {isIOS ? "on iOS" : "on Android"}</Button>;
}
