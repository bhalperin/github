import { ComponentFixture } from "@angular/core/testing";

export type ComponentTestSetup<T> = {
	fixture: ComponentFixture<T>,
	component: T
};
