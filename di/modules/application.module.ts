import { createModule } from "@evyweb/ioctopus";

import { DeleteCrisis } from "@/main/application/usecase/DeleteCrisis";
import { GetAllCrises } from "@/main/application/usecase/GetAllCrises";
import { SaveCrisis } from "@/main/application/usecase/SaveCrisis";
import { UpdateCrisis } from "@/main/application/usecase/UpdateCrisis";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { DI_SYMBOLS } from "../types";

export const createApplicationModule = () => {
	const applicationModule = createModule();

	// Use Cases
	applicationModule
		.bind(DI_SYMBOLS.GetAllCrises)
		.toClass(GetAllCrises, [DI_SYMBOLS.CrisisRepository, DI_SYMBOLS.CrisesUIPresenter]);

	applicationModule
		.bind(DI_SYMBOLS.SaveCrisis)
		.toClass(SaveCrisis, [DI_SYMBOLS.CrisisRepository, DI_SYMBOLS.ActionUIPresenter]);

	applicationModule
		.bind(DI_SYMBOLS.UpdateCrisis)
		.toClass(UpdateCrisis, [DI_SYMBOLS.CrisisRepository, DI_SYMBOLS.ActionUIPresenter]);

	applicationModule
		.bind(DI_SYMBOLS.DeleteCrisis)
		.toClass(DeleteCrisis, [DI_SYMBOLS.CrisisRepository, DI_SYMBOLS.ActionUIPresenter]);

	// Controllers
	applicationModule
		.bind(DI_SYMBOLS.CrisisController)
		.toClass(CrisisController, [
			DI_SYMBOLS.GetAllCrises,
			DI_SYMBOLS.SaveCrisis,
			DI_SYMBOLS.UpdateCrisis,
			DI_SYMBOLS.DeleteCrisis
		]);

	return applicationModule;
};
