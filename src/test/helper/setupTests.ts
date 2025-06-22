import { afterAll, beforeAll } from "@jest/globals";
import { execSync } from "child_process";

beforeAll(async () => {
	try {
		console.log("Starting test database container...");
		execSync("docker compose -f docker-compose.test.yaml up -d", {
			stdio: "inherit",
			timeout: 30000
		});

		await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log("[DONE] Test database container started");
	} catch (error) {
		console.error("[ERROR] Failed to start test database container:", error);
		throw error;
	}
}, 60000); // 60 seconds timeout for Docker operations

// Clean up after all tests
afterAll(async () => {
	try {
		console.log("Cleaning up test database container...");
		execSync("docker compose -f docker-compose.test.yaml down", {
			stdio: "inherit",
			timeout: 15000
		});
		console.log("[DONE] Test database container stopped");
	} catch (error) {
		console.warn("[ERROR] Failed to stop test database container:", error);
	}
}, 30000);
