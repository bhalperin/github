import chalk from 'chalk';

const loggedMethod = (message = '') => {
	return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		// Now, over-write the original method
		descriptor.value = function(...args: unknown[]) {
			// Execute custom logic
			console.log(chalk.green.bold(`🔊 Called ${propertyKey}(${args})`), message ? `| message = ${message}` : '');

			// Call original function
			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
};

const measureTime = () => {
	const logTime = (methodName: string, duration: number) => {
		console.log(chalk.green.bold(`\u23f3 Method ${methodName} took ${duration.toFixed(2)}ms`));
	};

	return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function(...args: unknown[]) {
			const start = performance.now();
			const result = originalMethod.apply(this, args);

			// If result is a Promise (thenable), handle asynchronously
			if (result && typeof (result as Promise<unknown>).then === 'function') {
				return (result as Promise<unknown>)
					.then((res) => {
						const end = performance.now();

						logTime(propertyKey, end - start);

						return res;
					});
			}

			// Synchronous result
			const end = performance.now();

			logTime(propertyKey, end - start);

			return result;
		};

		return descriptor;
	}
};

export { loggedMethod, measureTime };
