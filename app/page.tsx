"use client";

import { login } from "./actions";

import { logger } from "@/vue/lib/logger";
import { getCurrentPWAConfig } from "@/vue/lib/pwa-config";

export default function Home() {
	const handleLogin = async () => {
		const data = await login("testuser", "testpassword");
		console.log("Login data:", data);
	};

	const pwaConfig = getCurrentPWAConfig();

	logger.debug(pwaConfig);

	return <button onClick={handleLogin}>Click on me</button>;
}
