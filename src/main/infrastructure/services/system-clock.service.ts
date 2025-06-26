import { Clock } from "@/main/domain/services/clock.interface";

export class SystemClockService implements Clock {
	now(): Date {
		return new Date();
	}
}
