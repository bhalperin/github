class MicroserviceMetadata {
	constructor(
		public readonly name: string,
	) {}
}

export const MICROSERVICES = {
	users: {
		name: 'USERS_MICROSERVICE',
	} as MicroserviceMetadata
} as const;
export const MICROSERVICE_NAME_USERS = 'USERS_MICROSERVICE';
