import { Mock, vi } from 'vitest';

type ResourceMock<T> = {
	isLoading: Mock<() => boolean>;
	hasValue: Mock<() => boolean>;
	value: Mock<() => T>;
	error: Mock<() => unknown>;
};

export const createResourceMock = <T>(value: T): ResourceMock<T> => ({
	isLoading: vi.fn(() => false),
	hasValue: vi.fn(() => true),
	value: vi.fn(() => value),
	error: vi.fn(() => null),
});
