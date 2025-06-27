import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "@/di/types";
import { CryptoUUIDGeneratorService } from "@/main/infrastructure/services/crypto-uuid-generator.service";
import { SystemClockService } from "@/main/infrastructure/services/system-clock.service";

export const createApplicationModule = () => {
	const applicationModule = createModule();

	// Services
	applicationModule.bind(DI_SYMBOLS.UuidGenerator).toClass(CryptoUUIDGeneratorService);
	applicationModule.bind(DI_SYMBOLS.Clock).toClass(SystemClockService);

	return applicationModule;
};
