import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, RenderResult } from 'vitest-browser-angular';
import { Locator } from 'vitest/browser';

export function testSetup<T>(type: Type<T>) {
	const fixture = TestBed.createComponent(type);
	const component = fixture.componentInstance;

	return { fixture, component };
}

export interface VitestPageObject {
	screen?: RenderResult<any>;
	render(locator: Locator): void;
}

export abstract class VitestPageObjectBase<T> {
	screen: RenderResult<T> = null as unknown as RenderResult<T>;
	componentLocator: Locator = null as unknown as Locator;
	abstract render(): void;
}

export const vitestSetupTest = async <T, P extends VitestPageObjectBase<T>>(pageObjectType: Type<P>, componentType: Type<T>, inputs: any, providers: any[] | undefined = []) => {
	const screen = await render(componentType, {
		inputs,
		providers,
	});
	const { locator, fixture, componentClassInstance } = screen;
	const po = new pageObjectType();

	po.screen = screen;
	po.componentLocator = locator;
	po.render();

	return { fixture: fixture as ComponentFixture<T>, componentClassInstance, po };
};
