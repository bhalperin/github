import { signal, WritableSignal } from '@angular/core';

type ResourceMock<T> = {
	isLoading: WritableSignal<boolean>;
	hasValue: WritableSignal<boolean>;
	value: WritableSignal<T>;
	error: WritableSignal<unknown>;
};

export const createResourceMock = <T>(initialValue: T): ResourceMock<T> => ({
	isLoading: signal(false),
	hasValue: signal(true),
	value: signal(initialValue),
	error: signal(null),
});

export const createResourceMockWithError = <T>(initialValue: T) =>
	({
		...createResourceMock<T>(initialValue),
		error: signal(new Error()),
	}) as ResourceMock<T>;
