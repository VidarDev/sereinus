export interface Presenter<I, O> {
	ok(value?: I): O;
	error(errorMessage: string): O;
}
