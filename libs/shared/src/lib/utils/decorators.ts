const loggedMethod = (message = '') => {
	return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		// Now, over-write the original method
		descriptor.value = function (...args: unknown[]) {
			// Execute custom logic
			console.log(`Called %c${propertyKey}(${args})`, 'color: green; font-size: 14px; font-style: italic; font-weight: bold;', message ? `| message = ${message}` : '');

			// Call original function
			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
};

export { loggedMethod };
