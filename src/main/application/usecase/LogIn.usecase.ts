export class LogIn {
	public execute = async (username: string, password: string) => {
		console.log("Executing LogIn use case with", username, password);

		return {
			username: username,
			country: "FR",
			email: "placeholder@mail.com"
		};
	};
}
