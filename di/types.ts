import { PrismaClient } from "@prisma/client";

import { CrisisRepository } from "@/main/application/port/Crisis.repository.interface";
import { ManagePWAInstallation } from "@/main/application/usecase/ManagePWAInstallation.usecase";
import { RegisterServiceWorker } from "@/main/application/usecase/RegisterServiceWorker.usecase";
import { CrisisPrismaDao } from "@/main/infrastructure/dao/Crisis.prisma.dao";
import { PWAController } from "@/main/presentation/controller/PWA.controller";

export const DI_SYMBOLS = {
	PrismaClient: Symbol.for("PrismaClient"),
	CrisisPrismaDao: Symbol.for("CrisisPrismaDao"),
	CrisisRepository: Symbol.for("CrisisRepository"),
	PWAController: Symbol.for("PWAController"),
	RegisterServiceWorker: Symbol.for("RegisterServiceWorker"),
	ManagePWAInstallation: Symbol.for("ManagePWAInstallation")
};

export interface DiReturnTypes {
	PrismaClient: PrismaClient;
	CrisisPrismaDao: CrisisPrismaDao;
	CrisisRepository: CrisisRepository;
	PWAController: PWAController;
	RegisterServiceWorker: RegisterServiceWorker;
	ManagePWAInstallation: ManagePWAInstallation;
}
