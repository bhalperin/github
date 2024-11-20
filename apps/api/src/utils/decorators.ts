const messageWhenCalled = (message = '') => {
	return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: unknown[]) {
			console.log(`Called %c${propertyKey}(${args})`, 'color: green; font-size: 14px; font-style: italic; font-weight: bold;', message ? `| message = ${message}` : '');

			return originalMethod.apply(this, args);
		}

		return descriptor;
	}
};

export { messageWhenCalled };
