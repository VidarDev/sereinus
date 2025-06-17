import { LogIn } from "@/main/application/usecase/LogIn.usecase";

export class AuthenticationController {
	private readonly logIn: LogIn;

	constructor(logIn: LogIn) {
		this.logIn = logIn;
	}

	public async login(username: string, password: string) {
		return this.logIn.execute(username, password);
	}
}
