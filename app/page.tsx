"use client";

import { toast } from "sonner";

import { login } from "@/app/actions";
import { ThemeSwitcher } from "@/vue/components/theme-switcher";
import { Button } from "@/vue/components/ui/button";
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

			<Button onClick={handleLogin}>Test IoC Login</Button>

			<ThemeSwitcher />
		</div>
	);
}
