import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function testSetup<T>(type: Type<T>) {
	const fixture = TestBed.createComponent(type);
	const component = fixture.componentInstance;

	return { fixture, component };
}
