import { signal, WritableSignal } from '@angular/core';

type ResourceMock<T> = {
	isLoading: WritableSignal<boolean>;
	hasValue: WritableSignal<boolean>;
	value: WritableSignal<T>;
	error: WritableSignal<unknown>;
};

export const createResourceMock = <T>(initialValue: T): ResourceMock<T> => ({
	isLoading: signal(false),
	hasValue: signal(!!initialValue),
	value: signal(initialValue),
	error: signal(null),
});
