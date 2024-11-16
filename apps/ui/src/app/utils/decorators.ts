const loggedMethod = (target: object, propertyName: string, descriptor: PropertyDescriptor) => {
	// Store Original Method Implemetation
	const originalMethod = descriptor.value;

	// Now, over-write the original method
	descriptor.value = function (...args: unknown[]) {
		// Call original function
		const result = originalMethod.apply(this, args);
		// Execute custom logic
		console.log(`Called %c${propertyName}(${args})`, 'color: green; font-size: 14px; font-style: italic; font-weight: bold;');

		return result;
	};

	return descriptor;
};

export { loggedMethod };
