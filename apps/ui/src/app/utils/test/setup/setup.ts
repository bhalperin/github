import { TestBed } from '@angular/core/testing';
import { ComponentTestSetup } from './setup.model';
import { Type } from '@angular/core';

export function testSetup<T>(type: Type<T>): ComponentTestSetup<T> {
	const fixture = TestBed.createComponent(type);
	const component = fixture.componentInstance;

	return { fixture, component };
}
