"use client";

import { login } from "./actions";

export default function Home() {
	const handleLogin = async () => {
		const data = await login("testuser", "testpassword");
		console.log("Login data:", data);
	};

	return <button onClick={handleLogin}>Click on me</button>;
}
