import { Presenter } from "@/main/application/port/Presenter.interface";
import { Crisis } from "@/main/domain/Crisis";
import { CrisisViewModel } from "@/main/presentation/dto/Crisis.viewmodel";

export class CrisesUiPresenter implements Presenter<Crisis[], CrisisViewModel[] | string> {
	ok(crises: Crisis[]): CrisisViewModel[] {
		return crises.map(
			(crisis) =>
				new CrisisViewModel(
					this.formatDate(crisis.datetime),
					crisis.datetime,
					this.formatTime(crisis.datetime),
					this.formatDuration(crisis.duration),
					crisis.note,
					{
						id: crisis.id,
						protocolId: crisis.protocolId,
						protocolName: crisis.protocolName,
						cycleCount: crisis.cycleCount,
						efficiency: crisis.efficiency,
						averageCycleTime: crisis.averageCycleTime
					}
				)
		);
	}

	private formatDate(datetime: Date): string {
		const day = datetime.getDate().toString().padStart(2, "0");
		const month = (datetime.getMonth() + 1).toString().padStart(2, "0");
		const year = datetime.getFullYear();

		return `${day}/${month}/${year}`;
	}

	private formatTime(datetime: Date): string {
		const hours = datetime.getHours().toString().padStart(2, "0");
		const minutes = datetime.getMinutes().toString().padStart(2, "0");

		return `${hours}:${minutes}`;
	}

	private formatDuration(duration: number): string {
		const hours = Math.floor(duration / 3600);
		duration -= hours * 3600;
		const minutes = Math.floor(duration / 60);
		const seconds = duration - minutes * 60;

		let formattedDuration = "";

		if (hours > 0) {
			formattedDuration += `${hours}h `;
		}

		if (minutes > 0 || (hours > 0 && seconds > 0)) {
			formattedDuration += `${minutes.toString().padStart(2, "0")}min `;
		}

		if (seconds > 0 || (hours === 0 && minutes === 0)) {
			formattedDuration += `${seconds.toString().padStart(2, "0")}s`;
		}

		return formattedDuration.trim();
	}

	error(errorMessage: string): CrisisViewModel[] | string {
		return errorMessage;
	}
}
