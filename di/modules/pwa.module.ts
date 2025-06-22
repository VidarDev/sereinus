import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "@/di/types";
import { ManagePWAInstallation } from "@/main/application/usecase/ManagePWAInstallation.usecase";
import { RegisterServiceWorker } from "@/main/application/usecase/RegisterServiceWorker.usecase";
import { PWAController } from "@/main/presentation/controller/PWA.controller";

export const createPWAModule = () => {
	const pwaModule = createModule();

	pwaModule
		.bind(DI_SYMBOLS.PWAController)
		.toClass(PWAController, [DI_SYMBOLS.RegisterServiceWorker, DI_SYMBOLS.ManagePWAInstallation]);

	pwaModule.bind(DI_SYMBOLS.RegisterServiceWorker).toClass(RegisterServiceWorker);
	pwaModule.bind(DI_SYMBOLS.ManagePWAInstallation).toClass(ManagePWAInstallation);

	return pwaModule;
};
