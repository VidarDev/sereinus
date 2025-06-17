import { LogIn } from "@/main/application/usecase/LogIn.usecase";
import { AuthenticationController } from "@/main/presentation/controller/Authentication.controller";

export const DI_SYMBOLS = {
	AuthenticationController: Symbol.for("AuthenticationController"),
	LogIn: Symbol.for("LogIn")
};

export interface DiReturnTypes {
	AuthenticationController: AuthenticationController;
	LogIn: LogIn;
}
