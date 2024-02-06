export abstract class ModelMock<T> {
	data!: T;

	get model(): T {
		return this.data;
	}
}
