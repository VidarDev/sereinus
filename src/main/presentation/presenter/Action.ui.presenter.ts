import { Presenter } from "@/main/application/port/Presenter.interface";

export class ActionUiPresenter implements Presenter<null, boolean | string> {
	ok(): boolean | string {
		return true;
	}

	error(errorMessage: string): boolean | string {
		return errorMessage;
	}
}
