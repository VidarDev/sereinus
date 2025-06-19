"use client";

import { toast } from "sonner";

import { login } from "@/app/actions";
import { logger } from "@/vue/lib/logger";

export default function Home() {
	const handleLogin = async () => {
		const data = await login("testuser", "testpassword");
		logger.debug("Login data:", data);
		toast.success("Login data:", {
			description: JSON.stringify(data)
		});
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Sereinus - Test PWA</h1>

			<button onClick={handleLogin} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				Test IoC Login
			</button>
		</div>
	);
}
