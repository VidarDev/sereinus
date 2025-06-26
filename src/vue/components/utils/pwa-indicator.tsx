"use client";

import { usePWA } from "@/vue/providers/pwa.provider";

export function PWAIndicator() {
	const { isInstalled, canInstall, hasUpdate, isOnline, isRegistered, platform } = usePWA();

	if (process.env.NODE_ENV === "production") return null;

	const getStatusColor = () => {
		if (!isOnline) return "bg-red-600";
		if (hasUpdate) return "bg-orange-500";
		if (isInstalled) return "bg-green-600";
		if (canInstall) return "bg-blue-600";
		if (isRegistered) return "bg-gray-600";
		return "bg-gray-400";
	};

	const getStatusText = () => {
		if (!isOnline) return "OFF";
		if (hasUpdate) return "UPD";
		if (isInstalled) return "PWA";
		if (canInstall) return "RDY";
		if (isRegistered) return "SW";
		return "---";
	};

	const getCookieValue = (name: string) => {
		if (typeof document === "undefined") return "N/A";
		const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		return match ? match[2] : "Not set";
	};

	return (
		<div className="fixed right-1 bottom-1 z-50 flex flex-col items-end gap-1">
			<div
				className={`flex size-6 items-center justify-center rounded-full ${getStatusColor()} p-3 font-mono text-xs text-white`}
			>
				{getStatusText()}
			</div>

			<div className="rounded bg-black/80 px-2 py-1 font-mono text-xs text-white backdrop-blur-sm">
				<div className="space-y-0.5 text-[10px]">
					<div>Platform: {platform}</div>
					<div>Online: {isOnline ? "✓" : "✗"}</div>
					<div>SW: {isRegistered ? "✓" : "✗"}</div>
					<div>Install: {canInstall ? "✓" : isInstalled ? "✓ Done" : "✗"}</div>
					<div>Cookie: {getCookieValue("pwa-installed")}</div>
					<div>
						Standalone:{" "}
						{typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches
							? "✓"
							: "✗"}
					</div>
					{hasUpdate && <div className="text-orange-300">Update Available!</div>}
				</div>
			</div>
		</div>
	);
}
