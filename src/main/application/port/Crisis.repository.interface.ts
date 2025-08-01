import { Crisis } from "@/main/domain/Crisis";

export interface CrisisRepository {
	findAllByUserId(userId: string): Promise<Crisis[]>;
	save(userId: string, crisis: Crisis): Promise<void>;
	update(userId: string, crisis: Crisis): Promise<void>;
	delete(userId: string, crisis: Crisis): Promise<void>;
}
