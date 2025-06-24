import { PrismaClient } from "@prisma/client";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { Presenter } from "@/main/application/port/Presenter.interface";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { CrisisController } from "@/main/presentation/controller/Crisis.controller";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository"),
	CrisisController: Symbol.for("CrisisController"),
	Presenter: Symbol.for("Presenter")
};

export interface DiReturnTypes<I, O> {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
	CrisisController: CrisisController;

	Presenter: Presenter<I, O>;
}
