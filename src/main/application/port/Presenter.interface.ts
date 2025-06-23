export interface Presenter<I, O> {
	ok(crisis: I): O;
	error(errorMessage: string): O;
}
