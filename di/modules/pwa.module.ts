import { createModule } from "@evyweb/ioctopus";

export const createPWAModule = () => {
	const pwaModule = createModule();

	// No PWA bindings - everything is managed by React Context in the presentation layer

	return pwaModule;
};
