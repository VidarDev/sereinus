import { PrismaClient } from "@prisma/client";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";
import { CrisesUiPresenter } from "@/main/presentation/presenter/Crises.ui.presenter";
import { CrisisUiPresenter } from "@/main/presentation/presenter/Crisis.ui.presenter";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository"),
	CrisisController: Symbol.for("CrisisController"),
	CrisisUiPresenter: Symbol.for("CrisisUiPresenter"),
	CrisesUiPresenter: Symbol.for("CrisesUiPresenter")
};

export interface DiReturnTypes {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
	CrisisController: CrisisController;
	CrisisUiPresenter: CrisisUiPresenter;
	CrisesUiPresenter: CrisesUiPresenter;
}
