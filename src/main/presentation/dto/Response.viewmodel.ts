export class ResponseViewModel<T> {
	private readonly _success: boolean;
	private readonly _data?: T;
	private readonly _message?: string;

	private constructor(success: boolean, data?: T, message?: string) {
		this._success = success;
		this._data = data;
		this._message = message;
	}

	public static success<T>(data: T): ResponseViewModel<T> {
		return new ResponseViewModel<T>(true, data);
	}

	public static error<T>(message: string): ResponseViewModel<T> {
		return new ResponseViewModel<T>(false, undefined, message);
	}

	public get success(): boolean {
		return this._success;
	}

	public get data(): T | undefined {
		return this._data;
	}

	public get message(): string | undefined {
		return this._message;
	}
}
