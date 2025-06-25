import { UUIDGenerator } from "@/main/domain/services/uuid-generator.interface";

export class CryptoUUIDGeneratorService implements UUIDGenerator {
	generate(): string {
		return crypto.randomUUID();
	}
}
