import { PrismaClient } from "@prisma/client";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { ActionUiPresenter } from "@/main/presentation/presenter/Action.ui.presenter";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository"),
	CrisisController: Symbol.for("CrisisController"),
	ActionUiPresenter: Symbol.for("ActionUiPresenter"),
	CrisesUiPresenter: Symbol.for("CrisesUiPresenter")
};

export interface DiReturnTypes {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
	CrisisController: CrisisController;
	ActionUiPresenter: ActionUiPresenter;
	CrisesUiPresenter: CrisesUiPresenter;
}
